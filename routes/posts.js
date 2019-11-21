const express = require("express")
const router = express.Router()

const checkLogin = require("../middlewares/check").checkLogin

//Get 所有或特定用户的文章页
//eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
    res.send("主页")
})

router.get("/create", function(req, res, next) {
    res.send("发表文章")
})

router.get("/:postId", function(req, res, next) {
    res.send("文章详情页")
})

router.get("/:postId/edit", checkLogin, function(req, res, next) {
    res.send("更新文章页")
})

router.post("/:postId/edit", checkLogin, function(req, res, next) {
    res.send("更新文章")
})

router.post("/postId/remove", checkLogin, function(req, res, next) {
    res.send("删除文章")
})

module.exports = router