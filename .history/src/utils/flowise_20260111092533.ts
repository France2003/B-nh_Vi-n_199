// Using backend proxy to avoid CORS issues
const PROXY_API_URL = "http://localhost:3001/api/flowise";

export interface FloWiseResponse {
  text?: string;
  answer?: string;
  [key: string]: any;
}

export const floWiseService = {
  async query(question: string, files?: File[]): Promise<FloWiseResponse> {
    try {
      const formData = new FormData();
      formData.append("question", question);
      
      // Add files if provided
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
        console.log(`📎 Uploading ${files.length} file(s) with question...`);
      }

      const response = await fetch(PROXY_API_URL, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      const data = await response.json();

      // If status is not ok, server returns error in JSON
      if (!response.ok) {
        console.error('FloWise API Error:', data);
        return {
          text: data.text || 'Hệ thống không thể xử lý yêu cầu. Vui lòng thử lại sau.',
          error: data.error || 'API Error',
        };
      }

      return data;
    } catch (error) {
      console.error("Error calling FloWise API:", error);
      return {
        text: 'Có lỗi xảy ra khi kết nối với hệ thống. Vui lòng kiểm tra kết nối internet và thử lại sau.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};

