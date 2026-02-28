/**
 * Rate Limiter Utility for API calls
 * Manages request queuing and automatic retry with exponential backoff
 * Specifically designed to handle Jikan API rate limits (3 req/sec)
 */

class RateLimiter {
  constructor(requestsPerSecond = 2, retryAttempts = 3) {
    this.minDelay = 1000 / requestsPerSecond; // Minimum delay between requests
    this.retryAttempts = retryAttempts;
    this.lastRequestTime = 0;
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Add a request to the queue
   * @param {Function} requestFn - Async function that makes the API call
   * @returns {Promise} - Resolves with the request result
   */
  async enqueue(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the queue with proper delays
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { requestFn, resolve, reject } = this.queue.shift();
      
      // Calculate delay needed
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const delay = Math.max(0, this.minDelay - timeSinceLastRequest);
      
      if (delay > 0) {
        await this.sleep(delay);
      }

      try {
        this.lastRequestTime = Date.now();
        const result = await this.executeWithRetry(requestFn);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Execute a request with retry logic for rate limit errors
   */
  async executeWithRetry(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      const isRateLimited = 
        error.response?.status === 429 || 
        error.message?.toLowerCase().includes('rate') ||
        error.response?.data?.message?.toLowerCase().includes('rate');

      if (isRateLimited && attempt < this.retryAttempts) {
        // Exponential backoff: 1s, 2s, 4s
        const backoffDelay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Rate limited, retrying in ${backoffDelay}ms (attempt ${attempt}/${this.retryAttempts})`);
        await this.sleep(backoffDelay);
        return this.executeWithRetry(requestFn, attempt + 1);
      }
      
      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear the queue (useful for cleanup on unmount)
   */
  clear() {
    this.queue = [];
  }
}

// Create a singleton instance for global use
const rateLimiter = new RateLimiter(2, 3); // 2 requests per second, 3 retry attempts

/**
 * Execute multiple API calls with staggered timing
 * @param {Array<Function>} requestFns - Array of async functions
 * @returns {Promise<Array>} - Array of results (or errors)
 */
export async function executeStaggered(requestFns) {
  const results = [];
  
  for (const fn of requestFns) {
    try {
      const result = await rateLimiter.enqueue(fn);
      results.push({ success: true, data: result });
    } catch (error) {
      results.push({ success: false, error });
    }
  }
  
  return results;
}

/**
 * Execute a single API call through the rate limiter
 * @param {Function} requestFn - Async function that makes the API call
 * @returns {Promise} - Resolves with the request result
 */
export async function executeRateLimited(requestFn) {
  return rateLimiter.enqueue(requestFn);
}

/**
 * Clear the rate limiter queue
 */
export function clearQueue() {
  rateLimiter.clear();
}

export default rateLimiter;
