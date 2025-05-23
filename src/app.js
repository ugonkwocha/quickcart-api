const http = require('http');
const url = require('url');

// Sample product data (in real life, this comes from a database)
const products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
  { id: 2, name: 'Phone', price: 599.99, stock: 25 },
  { id: 3, name: 'Headphones', price: 199.99, stock: 15 }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set CORS headers (allows frontend apps to call our API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (path === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'QuickCart API is running great!', // Added "great!"
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }));
  } 
  else if (path === '/products') {
    res.writeHead(200);
    res.end(JSON.stringify({
      products: products,
      total: products.length
    }));
  }
  else if (path.startsWith('/products/')) {
    const productId = parseInt(path.split('/')[2]);
    const product = products.find(p => p.id === productId);
    
    if (product) {
      res.writeHead(200);
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Product not found' }));
    }
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`QuickCart API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /health - Health check');
  console.log('  GET /products - List all products');
  console.log('  GET /products/:id - Get specific product');
});