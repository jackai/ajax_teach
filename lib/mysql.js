//导入模块
const mysql = require('mysql2');

// 创建连接池，设置连接池的参数
const pool = mysql.createPool({
  host: process.env['MYSQL_HOST'] ?? 'localhost',
  user: process.env['MYSQL_USER'] ?? 'root',
  password: process.env['MYSQL_PASSWORD'] ?? 'root',
  database: process.env['MYSQL_DB'] ?? 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = { pool, promisePool };