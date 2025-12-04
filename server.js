const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let path = './innex/'; // your folder name

    switch(req.url) {
        case '/':
            path += 'about.html';      // matches your file name
            break;
        case '/content':
            path += 'content.html';   // matches your file name
            break;
        default:
            path += 'index.html';     // matches your file name
            break;
    }

    res.setHeader('Content-Type', 'text/html');

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);              // logs error if file not found
            res.writeHead(404);
            res.end('Page not found');     // show user-friendly message
        } else {
            res.write(data);
            res.end();
        }
    });
});

server.listen(3000, 'localhost', () => {
    console.log('Listeening for request on port 3000');
});
