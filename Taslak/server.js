import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const dataPath = path.join(__dirname, '../server/data.json');

const readData = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- STATIC FILES FOR UPLOADS ---
  if (req.url.startsWith('/uploads/') && req.method === 'GET') {
    const filePath = path.join(__dirname, 'public', req.url);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.gif') mimeType = 'image/gif';
      else if (ext === '.webp') mimeType = 'image/webp';

      res.setHeader('Content-Type', mimeType);
      res.writeHead(200);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return;
    } else {
      res.writeHead(404);
      return res.end('File not found');
    }
  }

  // Parse Body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

    req.on('end', () => {
    // ... Moved to the top

    const parsedBody = body ? JSON.parse(body) : null;
    res.setHeader('Content-Type', 'application/json');

    try {
      // --- FABRICS ---
      if (req.url === '/api/fabrics' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(readData().fabrics));
      } 
      else if (req.url === '/api/fabrics' && req.method === 'POST') {
        const data = readData();
        const newFabric = { ...parsedBody, id: 'f' + Date.now() };
        data.fabrics.push(newFabric);
        writeData(data);
        res.writeHead(201);
        res.end(JSON.stringify(newFabric));
      }
      else if (req.url.match(/\/api\/fabrics\/([^/]+)/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        const data = readData();
        const index = data.fabrics.findIndex(f => f.id === id);
        if (index !== -1) {
          data.fabrics[index] = { ...data.fabrics[index], ...parsedBody };
          writeData(data);
          res.writeHead(200);
          res.end(JSON.stringify(data.fabrics[index]));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ message: 'Not found' }));
        }
      }
      else if (req.url.match(/\/api\/fabrics\/([^/]+)/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        const data = readData();
        data.fabrics = data.fabrics.filter(f => f.id !== id);
        writeData(data);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      }

      // --- PRODUCTS ---
      else if (req.url === '/api/products' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(readData().products));
      }
      else if (req.url === '/api/products' && req.method === 'POST') {
        const data = readData();
        const newProduct = { ...parsedBody, id: 'p' + Date.now() };
        data.products.push(newProduct);
        writeData(data);
        res.writeHead(201);
        res.end(JSON.stringify(newProduct));
      }
      else if (req.url.match(/\/api\/products\/([^/]+)/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        const data = readData();
        const index = data.products.findIndex(p => p.id === id);
        if (index !== -1) {
          data.products[index] = { ...data.products[index], ...parsedBody };
          writeData(data);
          res.writeHead(200);
          res.end(JSON.stringify(data.products[index]));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ message: 'Not found' }));
        }
      }
      else if (req.url.match(/\/api\/products\/([^/]+)/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        const data = readData();
        data.products = data.products.filter(p => p.id !== id);
        writeData(data);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      }

      // --- CATEGORIES ---
      else if (req.url === '/api/categories' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(readData().categories));
      }

      // --- UPLOAD ---
      else if (req.url === '/api/upload' && req.method === 'POST') {
        const { filename, data } = parsedBody;
        if (!filename || !data) {
          res.writeHead(400);
          return res.end(JSON.stringify({ message: 'Missing filename or data' }));
        }

        // Extract base64 part
        const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          res.writeHead(400);
          return res.end(JSON.stringify({ message: 'Invalid base64 string' }));
        }

        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Ensure unique filename
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        const uniqueFilename = `${name}-${Date.now()}${ext}`;
        
        // Write to public/uploads
        const uploadPath = path.join(__dirname, 'public', 'uploads', uniqueFilename);
        fs.writeFileSync(uploadPath, buffer);

        res.writeHead(200);
        res.end(JSON.stringify({ url: `/uploads/${uniqueFilename}` }));
      }

      // 404
      else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Route not found' }));
      }
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Internal Server Error', error: error.toString() }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Native Node.js Server is running on http://localhost:${PORT}`);
});
