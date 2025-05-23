const http = require('http');

// Helper function to make HTTP requests during testing
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test our API endpoints
describe('QuickCart API', () => {
  test('Health endpoint returns healthy status', async () => {
    const response = await makeRequest('/health');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.message).toBe('QuickCart API is running!');
  });

  test('Products endpoint returns product list', async () => {
    const response = await makeRequest('/products');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.products).toHaveLength(3);
    expect(response.body.total).toBe(3);
  });

  test('Specific product endpoint returns correct product', async () => {
    const response = await makeRequest('/products/1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Laptop');
    expect(response.body.price).toBe(999.99);
  });

  test('Invalid product returns 404 error', async () => {
    const response = await makeRequest('/products/999');
    
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Product not found');
  });
});