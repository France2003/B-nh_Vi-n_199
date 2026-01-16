import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;
const FLOWISE_API_URL = 'https://flowise.imagentu.cloud/api/v1/prediction/3cc3bd56-726c-4cc6-baa4-eae9719b8d36';
const FLOWISE_API_KEY = 'GCsVbQFghmgWibHPFtnD2k5RrEfyD9oWVmXkxHiaCdU';
const API_TIMEOUT = 15 * 60 * 1000; // 15 minutes for long-running flows

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint - helpful message
app.get('/', (req, res) => {
  res.json({
    message: '🏥 Hospital 199 Chatbot Backend Proxy',
    status: 'running',
    frontend: 'http://localhost:5173',
    api: {
      health: 'GET /health',
      flowise: 'POST /api/flowise',
    },
    note: 'Access the frontend at http://localhost:5173',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    flowise_url: FLOWISE_API_URL,
    timeout: `${API_TIMEOUT / 1000}s`,
  });
});

// Test Flowise endpoint
app.get('/test-flowise', async (req, res) => {
  console.log('🧪 Testing Flowise connectivity...');
  console.log('Endpoint:', FLOWISE_API_URL);
  console.log('API Key:', FLOWISE_API_KEY.substring(0, 10) + '...');
  
  try {
    // Try with API key in query parameter (Flowise format)
    const testUrl = `${FLOWISE_API_URL}?apikey=${FLOWISE_API_KEY}`;
    console.log('Testing with URL:', testUrl.substring(0, 100) + '...');
    
    const testResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: 'test' }),
      signal: AbortSignal.timeout(30000), // 30 second test timeout
    });

    console.log('✅ Flowise test response:', testResponse.status);
    const responseText = await testResponse.text();
    console.log('Response preview:', responseText.substring(0, 200));
    
    res.json({
      status: 'ok',
      flowise_status: testResponse.status,
      message: 'Flowise connectivity test successful',
      response_preview: responseText.substring(0, 500),
    });
  } catch (error) {
    console.error('❌ Flowise test failed:', error.name, error.message);
    res.status(503).json({
      status: 'error',
      message: 'Cannot connect to Flowise',
      error: error.message,
      error_name: error.name,
      flowise_url: FLOWISE_API_URL,
      note: 'Make sure Flowise server is running and endpoint is correct',
    });
  }
});

// Proxy endpoint cho Flowise với timeout handling
app.post('/api/flowise', async (req, res) => {
  const startTime = Date.now();
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ 
        error: 'Question is required',
        text: 'Vui lòng nhập nội dung câu hỏi'
      });
    }

    console.log('📤 Calling Flowise API...');
    console.log('Question:', question);
    console.log('🔑 Using API Key:', FLOWISE_API_KEY.substring(0, 10) + '...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Main timeout triggered after', API_TIMEOUT / 1000, 'seconds');
      controller.abort();
    }, API_TIMEOUT);

    // Connection timeout (fires if no response within CONNECT_TIMEOUT)
    const connectTimeoutId = setTimeout(() => {
      console.log('⚠️ Connection timeout after', CONNECT_TIMEOUT / 1000, 'seconds');
      controller.abort();
    }, CONNECT_TIMEOUT);

    try {
      // Use API key in query parameter format (Flowise preferred format)
      const floWiseUrl = `${FLOWISE_API_URL}?apikey=${FLOWISE_API_KEY}`;
      console.log('🌐 API URL:', FLOWISE_API_URL.substring(0, 100) + '...');
      
      const response = await fetch(floWiseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(connectTimeoutId);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log('📥 Flowise Response Status:', response.status, `(${elapsed}s)`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error('❌ Flowise API Error:', response.status);
        console.error('Error Details:', errorText.substring(0, 200));
        
        // Return user-friendly error message
        return res.status(response.status).json({
          error: `Flowise API error: ${response.status}`,
          text: response.status === 504 
            ? 'Flowise server timeout. Vui lòng thử lại sau ít phút hoặc kiểm tra endpoint.' 
            : 'Hệ thống đang bảo trì. Vui lòng thử lại sau ít phút.',
          status: response.status,
          debug: {
            elapsed: `${elapsed}s`,
            endpoint: FLOWISE_API_URL,
          }
        });
      }

      const data = await response.json();
      const elapsed2 = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log('✅ Success:', data.text?.substring(0, 100) || 'No text', `(Total: ${elapsed2}s)`);
      res.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      clearTimeout(connectTimeoutId);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.error('🔴 Fetch Error:', fetchError.name, `-`, fetchError.message);
      
      if (fetchError.name === 'AbortError') {
        if (elapsed < (CONNECT_TIMEOUT / 1000)) {
          console.error('⏱️ Flowise API Processing Timeout (>' + API_TIMEOUT / 60000 + ' phút)');
          return res.status(504).json({
            error: 'Flowise API Timeout',
            text: `Flow xử lý quá lâu (>${API_TIMEOUT / 60000} phút). Bài toán có thể quá phức tạp. Vui lòng kiểm tra flow trong Flowise.`,
            elapsed: `${elapsed}s`,
          });
        } else {
          console.error('❌ Connection timeout to Flowise server');
          return res.status(503).json({
            error: 'Connection Timeout',
            text: `Không thể kết nối đến Flowise server. Vui lòng kiểm tra: \n1. Flowise server đang chạy?\n2. URL endpoint đúng?\n3. Internet connection ổn?`,
            elapsed: `${elapsed}s`,
          });
        }
      }

      throw fetchError;
    }
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error('🔴 Proxy error:', error.message);
    const statusCode = error.message?.includes('ECONNREFUSED') ? 503 : 500;
    
    res.status(statusCode).json({
      error: 'Failed to call Flowise API',
      message: error instanceof Error ? error.message : 'Unknown error',
      text: 'Có lỗi khi kết nối với hệ thống. Vui lòng kiểm tra kết nối internet và thử lại.',
      elapsed: `${elapsed}s`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
