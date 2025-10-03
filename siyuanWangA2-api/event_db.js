const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // ← 你的 MySQL 用户名
  password: 'wsy20030313.',   // ← 你的 MySQL 密码
  database: 'charityevents_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('✅ MySQL connected as id ' + db.threadId);
});

module.exports = db;
