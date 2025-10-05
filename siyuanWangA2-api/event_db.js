const mysql = require('mysql2');

// 创建数据库连接配置对象
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'wsy20030313.',
  database: 'charityevents_db'
};

// 建立数据库连接
const dbConnection = mysql.createConnection(connectionConfig);

// 处理连接事件
dbConnection.connect((error) => {
  if (error) {
    console.error('数据库连接失败:', error.stack);
    return;
  }
  console.log(`✅ MySQL 已连接，连接ID: ${dbConnection.threadId}`);
});

module.exports = dbConnection;