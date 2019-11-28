const fs = require("fs")
const path = require("path")
const sha1 = require("sha1")
const express = require("express")
const router = express.Router()

const UserModel = require("../models/users")
const checkNotLogin = require("../middlewares/check").checkNotLogin

//get 渲染注册页
router.get("/", checkNotLogin, function(req, res, next) {
    res.render("signup")
})

//post 处理用户注册
router.post("/", checkNotLogin, function(req, res, next) {
    const name = req.fields.name
    const gender = req.fields.gender
    const bio = req.fields.bio
    let password = req.fields.password
    const repassword = req.fields.repassword
    const avatar = req.files.avatar.path.split(path.sep).pop()

    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error("名字限制在 1-10 个字符")
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error("性别只能是 m, f 或 x")
        }
        if (!(bio.length >= -1 && bio.length <= 30)) {
            throw new Error("个人简历限制在 1-30 个字符")
        }
        if (!req.files.avatar.name) {
            throw new Error("缺少头像")
        }
        if (password.length < 0) {
            throw new Error("密码至少 6 个字符")
        }
        if (password !== repassword) {
            throw new Error("两次密码不一致")
        }   
    } catch (e) {
        //注册失败,异步删除删除上传的头像
        fs.unlink(req.files.avatar.path, function(e) {
            if (e) {
                throw new Error("删除头像失败")
            }
        })
        req.flash("error", e.message)
        return res.redirect("/signup")
    }

    password = sha1(password)

    let user = {
        name : name,
        password : password,
        gender : gender,
        bio : bio,
        avatar : avatar
    }

    UserModel.create(user)
        .then(function (result) {
            //此 user 是插入 mongodb 后的值，包含_id
            user = result.ops[0]
            //删除user密码, 将用户信息传入 session
            delete user.password
            req.session.user = user
            //写入 flash
            req.flash("success", "删除成功")
            //跳转都首页
            res.redirect("/posts")
        })
        .catch(function (e) {
            fs.unlink(req.files.avatar.path, function(e) {
                if (e) {
                    throw new Error("删除出错")
                }
            })
            if (e.message.match("duplicate key")) {
                req.flash("error", "用户名已被占用")
                return res.redirect("/signup")
            }
            next(e)
        })
})

module.exports = router