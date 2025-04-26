import express, { Request, Response } from 'express';
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import retry from 'async-retry';
import CircuitBreaker from 'opossum';

const app = express();
const PORT = process.env.PORT || 3000;

// Rate Limiter: Limit to 100 requests per 15 minutes
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  message: 'Too many requests, please try again later.',
}));

// Circuit Breaker options
const breakerOptions = {
  timeout: 5000, // Timeout after 5 seconds
  errorThresholdPercentage: 50, // Open circuit after 50% failure rate
  resetTimeout: 30000, // Try again after 30 seconds
};

// Proxy error handler compatible with http-proxy-middleware
const onError = (err: Error, req: Request, res: Response) => {
  console.error(`Proxy error: ${err.message}`);
  res.status(500).json({ error: 'Proxy error', details: err.message });
};

// Wrapper for proxy with Retry and Time Limiter
const createResilientProxy = (target: string): RequestHandler => {
  const breaker = new CircuitBreaker(async (url: string) => {
    // Dynamically import p-timeout
    const { default: pTimeout } = await import('p-timeout');
    return await retry(
      async () => await pTimeout(
        fetch(url).then(res => {
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          return res.json();
        }),
        { milliseconds: 5000 } // Timeout after 5 seconds
      ),
      { retries: 3 } // Retry 3 times
    );
  }, breakerOptions);

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    onError,
    onProxyReq: (proxyReq, req: Request, res: Response) => {
      // Ensure JSON content type is forwarded correctly
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req: Request, res: Response) => {
      // Handle successful responses
      proxyRes.on('data', () => {
        breaker.fire(req.url).catch((err: Error) => {
          console.error('Circuit breaker error:', err);
        });
      });
    }
  } as Options);
};

// Proxy routes
app.use('/products', createResilientProxy('http://product-service:3001'));
app.use('/orders', createResilientProxy('http://order-service:3002'));
app.use('/customers', createResilientProxy('http://customer-service:3003'));

// Default route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Sales Management System API Gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});