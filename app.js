// 导入 express 模块
const express = require('express')
// 创建服务器的实例
const app = express()
// 导入 joi 定义验证规则包
const Joi = require('joi')
// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件,注意:这个中间件,只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.json())
app.use(express.urlencoded({ extended: false}))



// 一定要在路由之前,封装 res.cc 函数
app.use((req, res, next) => {
    // status 默认值为 1, 表示失败的情况
    // err 的值,可能是一个错误对象,也可能是一个错误的描述字符串
    res.cc = (err, status = 1 ) => {
        res.send({
            status,
            // 若 err 时错误函数实例,则返回 err的错误提示,则输出字符串错误描述
            msg: err instanceof Error ? err.message : err,
        })
    }
    next()
})



// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))




// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)


// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)


// 导入并使用文章分类列表路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)


// 导入并使用用户列表信息路由模块
const userListRouter = require('./router/userList')
app.use('/my/userlist', userListRouter)




// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if(err instanceof Joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
	if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    res.cc('err')
})



// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})