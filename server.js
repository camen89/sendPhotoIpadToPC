const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: http });

app.use(express.static('public'));

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // data が Buffer の場合は文字列化する
    let msg;
    if (Buffer.isBuffer(data)) {
      msg = data.toString('utf8');
    } else {
      msg = data;
    }

    // 受け取ったメッセージを全クライアントに送信
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server running on port ${port}`));
