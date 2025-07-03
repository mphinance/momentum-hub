### 2. Environment Configuration

For sensitive data like API keys, use environment variables.

Create a `.env` file in the root directory for local development:
```env
# Polygon.io API Key (Required for market data)
VITE_POLYGON_API_KEY=your_polygon_api_key

# Optional: Custom API endpoints
VITE_API_BASE_URL=[https://your-api-url.com](https://your-api-url.com)

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
