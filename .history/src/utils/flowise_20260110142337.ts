// Using backend proxy to avoid CORS issues
const PROXY_API_URL = "http://localhost:3001/api/flowise";

export interface FloWiseResponse {
  text?: string;
  [key: string]: any;
}

export const floWiseService = {
  async query(question: string): Promise<FloWiseResponse> {
    try {
      const response = await fetch(PROXY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error calling FloWise API:", error);
      throw error;
    }
  },
};

