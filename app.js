var path = require('path');
var express = require('express');
var read = require('./web/read');
var config = require('./config');
var spawn = require('child_process').spawn;
var cronJob = require('cron').CronJob;

var app = express();

//配置express
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(app.router);
  app.use('/public', express.static(path.join(__dirname, 'public')));
});

//网址首页
app.get('/', function (req, res, next) {
  var classId = 0;
  var offset = 0;
  var limit = 20;
  read.articleListByClassId(classId, offset, limit, function (err, list) {
  	if (err) {
  	  return next(err);
  	};
  	//渲染模板
  	res.locals.articleList = list;
  	res.render('index');
  });
});
//文章页面
app.get('/article/:id', function (req, res, next) {
  //通过req.params.id来获取URL中：id参数
  read.article(req.params.id, function (err, article) {
  	if (err) {
  	  return next(err);
  	};
  	//模板渲染
  	res.locals.article = article;
  	res.render('article');
  });
});

app.listen(config.port);
console.log('服务已启动');

//定时执行更新任务
var job = new cronJob(config.autoUpdate, function () {
  console.log('开始执行定时更新任务');
  var update = spawn(process.execPath, [path.resolve(__dirname, 'update/all.js')]);
  update.stdout.pipe(process.stdout);
  update.stderr.pipe(process.stderr);
  update.on('close', function (code) {
    console.log('更新任务结束，代码=%d', code);
  });
});
job.start();


