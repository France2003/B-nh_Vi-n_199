import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;
const FLOWISE_API_URL = 'https://flowise.imagentu.cloud/api/v1/prediction/3cc3bd56-726c-4cc6-baa4-eae9719b8d36';
const API_TIMEOUT = 30000; // 30 seconds

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    flowise_url: FLOWISE_API_URL
  });
});

// Proxy endpoint cho Flowise với timeout handling
app.post('/api/flowise', async (req, res) => {
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(FLOWISE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Flowise Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error('❌ Flowise API Error:', response.status, errorText);
        
        // Return user-friendly error message
        return res.status(response.status).json({
          error: `Flowise API error: ${response.status}`,
          text: 'Hệ thống đang bảo trì. Vui lòng thử lại sau ít phút.',
          status: response.status,
        });
      }

      const data = await response.json();
      console.log('✅ Success:', data);
      res.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('⏱️ Flowise API Timeout (>30s)');
        return res.status(504).json({
          error: 'Flowise API Timeout',
          text: 'Máy chủ không phản hồi kịp thời. Vui lòng thử lại sau.',
        });
      }

      throw fetchError;
    }
  } catch (error) {
    console.error('🔴 Proxy error:', error);
    const statusCode = error.message?.includes('ECONNREFUSED') ? 503 : 500;
    
    res.status(statusCode).json({
      error: 'Failed to call Flowise API',
      message: error instanceof Error ? error.message : 'Unknown error',
      text: 'Có lỗi khi kết nối với hệ thống. Vui lòng kiểm tra kết nối internet và thử lại.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
