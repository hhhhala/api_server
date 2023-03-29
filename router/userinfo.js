// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入数据验证的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')
// 获取用户基本信息
const userinfo = require('../router_heandler/userinfo')





// 获取用户的基本信息
router.get('/userinfo', userinfo.getUserInfo)
// 更新用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo.updateUserInfo)
// 重置密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo.updatepwd)
// 更新头像的路由
router.post('/updateAvatar', expressJoi(update_avatar_schema), userinfo.updateAvatar)


// 向外共享路由对象
module.exports = router