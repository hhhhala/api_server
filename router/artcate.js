const express = require('express')
const router = express.Router()

const artcate_handler = require('../router_heandler/artcate')

const expressJoi = require('@escook/express-joi')
const { add_cates_schema, delete_cates_schema, get_cates_schema, update_cates_schema } = require('../schema/artcate')

// 获取文章分类的路由
router.get('/cates', artcate_handler.getArticleCates)
// 添加文章分类的路由
router.post('/addcates', expressJoi(add_cates_schema), artcate_handler.addArticleCates)
// 删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cates_schema), artcate_handler.deleteCateById)
// 根据Id获取文章分类数据
router.get('/cates/:id', expressJoi(get_cates_schema), artcate_handler.getatesById)
// 根据 ID 更新文章分类数据
router.post('/updatecate', expressJoi(update_cates_schema), artcate_handler.updateCateById)
module.exports = router