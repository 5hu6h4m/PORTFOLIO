const http = require('http');

const data = JSON.stringify({
    name: "Final Verification User",
    email: "shubhamja9863@gmail.com",
    subject: "Load Order Fix Test",
    message: "Checking if moving dotenv to the top fixed the issue."
});

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Result:', body);
    });
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
