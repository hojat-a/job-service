export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2, // Exponential backoff factor
};


export default async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {

  const retryOpts = {...defaultOptions, ...options};
  let lastError: any;
  
  for (let attempt = 1; attempt <= retryOpts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      if (error?.status < 500) {
        throw error;
      }
      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryOpts.initialDelay * Math.pow(retryOpts.backoffFactor, attempt - 1),
        retryOpts.maxDelay
      );
      if (attempt < retryOpts.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
