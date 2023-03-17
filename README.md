# 后台 API 项目
### 项目初始化
#### 创建项目
1. 新建 api_server 文件夹作为项目根目录,并在项目根目录中运行如下的命令,初始化包管理配置文件:
``` sh
npm init -y
```
2. 安装特定版本的 express :
``` sh
npm i express@4.17.1
```
3. 在根目录下新建 app.js 作为整个项目的入口文件,并初始化如下代码:
```js
// 导入 express 模块
const express = require('express')
// 创建服务器的实例
const app = express()

...

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})
```

#### 配置 cors 跨域
1. 安装 cors 中间件:
``` sh
npm i cors@2.8.5
```
2. 在 app.js 中导入并配置 cors 中间件:
``` js
// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())
```

#### 配置解析表单数据中间件
- 注意:这个中间件,只能解析 application/x-www-form-urlencoded 格式的表单数据
``` js
app.use(express.urlencoded({ extended: false}))
```

#### 初始化路由相关文件夹
1. 在项目根目录下,新建 router 文件夹,用来存放所有的**路由模块**
> 路由模块中，只存放客户端的请求与处理函数之间的映射关系
2. 在项目根目录下,新建 router_handler 文件夹,用来存放所有的**路由处理函数模块**
> 路由处理函数模块中，专门负责存放每个路由对应的处理函数

#### 初始化用户路由模块
1. 在 router 文件夹中新建 user.js 文件,作为用户的路由模块,并初始化代码:
```js
// 导入 express 并创建路由对象
const express = require('express')
const router = express.Router()

// 注册新用户
router.post('/register', (req, res) => {
    res.send('register OK!')
})
// 登录
router.post('/login', (req, res) => {
    res.send('login OK!')
})

module.exports = router
```
2. 在 app.js 中导入路由模块
```js
// 导入用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
```