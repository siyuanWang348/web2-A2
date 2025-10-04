// server.js
const express = require('express');
const path = require('path');
const app = express();

// 端口号
const PORT = 3000;

// ✅ 设置静态文件目录
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// ✅ 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// ✅ event页面
app.get('/event', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'event.html'));
});

// ✅ search页面
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'search.html'));
});

// ✅ 其他未知路径返回404
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// ✅ 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 前端服务器已启动：http://localhost:${PORT}`);
});
