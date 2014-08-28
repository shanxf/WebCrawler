var mysql = require('mysql');
exports.db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'sina_blog',
  user: 'root',
  password: 'root'
});

//博客配置
exports.sinaBlog = {
  url: 'http://blog.sina.com.cn/u/1776757314' //博客首页地址
};

//定时更新
exports.autoUpdate = '* * /30 * * *';

exports.port = 3000;


