// 这是用户列表模块
const express = require('express')
const router =express.Router()

const userList = require('../router_heandler/userList')
const expressJoi = require('@escook/express-joi')
const { add_userlist_schema } = require('../schema/userList')

router.get('/cates', userList.getUserList)
router.post('/addcates', expressJoi(add_userlist_schema), userList.addUserList)


module.exports = router

