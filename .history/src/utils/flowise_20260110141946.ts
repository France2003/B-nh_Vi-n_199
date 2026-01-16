const FLOWISE_API_URL = "https://flowise.imagentu.cloud/api/v1/prediction/3cc3bd56-726c-4cc6-baa4-eae9719b8d36";

export interface FloWiseResponse {
  text?: string;
  [key: string]: any;
}

export const floWiseService = {
  async query(question: string): Promise<FloWiseResponse> {
    try {
      const response = await fetch(FLOWISE_API_URL, {
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
