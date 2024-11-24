import axios from 'axios';

export interface HttpCheckResult {
  url: string;
  status: number;
  responseTime: string;
}

export const performHttpCheck = async (url: string): Promise<HttpCheckResult> => {
  const startTime = Date.now();
  try {
    const response = await axios.get(url);
    const endTime = Date.now();
    return {
      url,
      status: response.status,
      responseTime: `${endTime - startTime}ms`,
    };
  } catch (error: any) {
    throw new Error(`HTTP check failed: ${error.message}`);
  }
};
