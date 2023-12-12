const http = require('http');
const fs = require('fs');
const functionProcessor = require('./functionProcessor.js');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // 提供index.html給前端
        fs.readFile('public/index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/submit-function-list') {
        // 處理來自前端的函數列表數據
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { functionList, entryPoint } = JSON.parse(body);
                console.log('Received function list:', functionList);

                // 使用 functionProcessor 處理函數列表
                functionProcessor.runFunctionModule(functionList, entryPoint);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Function list received and processed' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(5566, () => {
    console.log('Server running on port http://localhost:5566');
});
