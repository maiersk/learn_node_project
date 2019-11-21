const express = require("express")
const router = express.Router()
const checkNotLogin = require("../middlewares/check").checkNotLogin

router.get("/", checkNotLogin, function(req, res, next) {
    res.send("登录页")
})

router.post("/", checkNotLogin, function(req, res, next) {
    res.send("登陆")
})

module.exports = router