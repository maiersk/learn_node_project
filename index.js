const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const config = require("config-lite")(__dirname)
const routes = require("./routes")
const pkg = require("./package")

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    name    :   config.session.key,     //保存session id
    secret  :   config.session.secret,  //计算hash值，使产生的 signedCookie 防篡改
    resave  :   true,                   //强行更新session
    saveUninitialized   :   false,      //强行创建session，即使用户未登陆
    cookie  :{
        maxAge  :   config.session.maxAge   //cookie 过期时间
    },
    store   : new MongoStore({          //储存mongodb信息
        url :   config.mongodb
    })
}))

//flash中间件，用来显示通知
app.use(flash())

//处理表单及文件上传的中间件
app.use(require('express-formidable') ({
    uploadDir   :   path.join(__dirname, 'public/img'), //上传文件目录
    keepExtensions  : true  //保留后缀
}))

//数组模板全局变量
app.locals.blog = {
    title       :   pkg.name,
    description :   pkg.description
}

//模板必须的三个变量
app.use(function(req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash("success").toString()
    res.locals.error = req.flash("error").toString()
    next()
})

//路由
routes(app)

//监听事件，（端口、回调func）
app.listen(config.port, function() {
    console.log(`${pkg.name} listenging on prot ${config.port}`)
})