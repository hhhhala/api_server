# 后台 API 项目
## 项目初始化
#### 创建项目
1. 新建 `api_server` 文件夹作为项目根目录,并在项目根目录中运行如下的命令,初始化包管理配置文件:
``` bash
npm init -y
```
2. 安装特定版本的 `express` :
``` bash
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
1. 安装 `cors` 中间件:
``` sh
npm i cors@2.8.5
```
2. 在 app.js 中导入并配置 `cors` 中间件:
``` js
// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())
```

#### 配置解析表单数据中间件
- 注意:这个中间件,只能解析 application/x-www-form-urlencoded <!--格式的表单数据-->
``` js
app.use(express.urlencoded({ extended: false}))
```

#### 初始化路由相关文件夹
1. 在项目根目录下,新建 router 文件夹,用来存放所有的`路由模块`
> 路由模块中，只存放客户端的请求与处理函数之间的映射关系
2. 在项目根目录下,新建 router_handler 文件夹,用来存放所有的`路由处理函数模块`
> 路由处理函数模块中，专门负责存放每个路由对应的处理函数

#### 初始化用户路由模块
1. 在 `router` 文件夹中新建 user.js 文件,作为用户的路由模块,并初始化代码:
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

#### 抽离用户路由模块中的处理函数
> 目的：为了保证 `路由模块`的纯粹性，所有的`路由处理函数`，必须抽离到对应的`路由处理函数模块`中
1. 在 `/router_handler/user.js`中，使用`exprots`对象，分别向外共享如下两个`路由处理函数`：
```js
// 用户注册的处理函数
exports.regUser = (req, res) => {
	res.send('reguser OK')
}
// 用户登录的处理函数
exports.login = (req, res) => {
    res.send('Login OK')
}
```

2. 将 `/router/user.js` 中的代码修改为如下结构：
```js
const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 注册新用户
router.post('/register', userHandler.regUser)
// 登录
router.post('/login', userHandler.login)

module.exports = router
```

## 登陆注册
#### 新建 ev_users 表
- 在 `my_db_01` 数据库中，新建 `ev_users` 表：
  ![create-ev_users](G:\study\Project\api_server\create-ev_users.png)
#### 安装并配置 `mysql` 模块
> 在 API 接口项目中，需要安装并配置 `mysql` 这个第三方模块，来连接和操作MySQL数据库
1. 运行如下命令，安装 `mysql` 模块： 
``` bash
npm i mysql@2.18.1
```
2. 在项目更目录下新建 `/db/index.js/` 文件，再次自定义模块中创建数据库的连接对象：
```js
// 导入 mysql 模块
const mysql = require('mysql')
// 创建数据库连接对象
const db = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	passowrd: '123456',
	database: 'my_db_01',
})
// 向外共享 db 数据库连接对象
module.exports = db
```

### 注册
- 实现步骤
	1. 检测表单数据是否合法
	2. 检测用户名是否被占用
	3. 对密码进行加密处理
	4. 插入新用户
#### 检测表单数据是否合法
1. 判断用户名和密码是否为空
```js
// 接收表单数据
const userinfo = req.body
// 判断数据是否合法
if(!userinfo.username || !userinfo.password){
	return res.send({ status: 1, message: '用户名或密码不能为空！'})
}
```
#### 检测用户名是否被占用
- 导入数据空操作模块：
```js
const db = require('../db/index')
```

- 定义 SQL 语句
``` js
const sql = 'select * from ev_users where username=?'
```

- 执行 SQL 语句并根据结果判断用户名是否被占用：
``` js
db.query(sql, userinfo.username, (err, results) => {
	// 执行 SQL 语句失败
	if(err){
		return res.send({ status: 1, message: err.message )}
	}
	// 用户名被占用
	if(results.length > 0){
	 return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！'})
	}
}
```

#### 对密码进行加密处理
> 为了保证密码的安全性，不建议在数据以 `明文` 的形式保存用户密码，推荐对密码进行 `加密存储`
在当前项目中，使用 bcryptjs 对密码进行加密，优点：
- 加密之后的密码，**无法被逆向破解**
- 同一明文密码多次加密，得到**加密结果各不相同**，保证了安全性

1. 运行如下代码，安装指定版本的 `bcryptjs` ：
``` bash
npm i bcryptjs@2.4.3
```
2. 在 `/router_handler/user` 中，导入 `bcryptjs` ：
``` js
const bcrypt = require('bcryptjs')
```
3. 在注册用户的处理函数中没确认用户名可用之后，调用 `bcrypt.hashSync(明文密码，随机盐的长度)` 方法，对用户密码进行加密处理：
```js
// 调用 bcrypt,hashSync() 对密码进行加密，返回值是加密之后的密码字符串
userinfo.password = bcrypt.hashSync(userinfo.password, 10)
```
#### 插入新用户
- 定义插入新用户的 SQL 语句
``` js
const sql = 'insert into ev_users set ?'
```

- 执行 SQL 语句并根据结果判断用户名是否添加成功
```js
// 调用 db.query() 执行 SQL 语句
db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            // 判断 SQL 语句是否执行成功
            // if(err) return res.send({status: 1, msg: err.message})
            if(err) return res.cc(err)
            // 判断影响行数是否为 1
            // if(results.affectedRows !== 1) return res.send({status: 1, msg: '注册用户失败,请稍后尝试!'})
            if(results.affectedRows !== 1)return res.cc('注册用户失败,请稍后尝试!')
            // res.send({status: 0, msg: '注册成功!'})
            res.cc('注册成功!', 0)
        })
```

#### 优化 res.send() 代码
> 在处理函数中，需要多次调用 res.send() 向客户端响应 `处理失败` 的结果，为了简化代码，溃疡手动封装一个 res.cc() 函数
> 一定要在路由定义之前声明，不然路由将不会又 res.cc() 函数
1. 在 `app.js` 中，所有的路由之前，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数：
``` js
// 响应数据的中间件
app.use((req, res, next) => {
	// status = 0 为成功；1 为失败；默认将 status 的值设置为 1，方便处理失败的情况
	res.cc = (err, status = 1 ) => {
        res.send({
        	// 状态
            status,
            // 若 err 时错误函数实例,则返回 err的错误提示,则输出字符串错误描述
            msg: err instanceof Error ? err.message : err,
        })
    }
    next()
})
```

#### 优化表单数据验证
> 表单验证的原则：前端验证为辅，后端验证为主，后端**永远不要想要**前端提交过来的**任何内容**

在实际开发中，前后端都需要对表单的数据进行合法性的验证，而且，**后端作为数据合法性验证的最后一个关口**，再拦截非法数据方面起到至关重要的作用。
单纯的使用 `if...else...` 的形式对数据合法性进行验证，效率低下，出错率搞，维护性差。因此推荐使用**第三方数据验证模块**来降低出错率，提高验证的效率与可维护性，**让后端程序员把更多的精力放在核心业务逻辑的处理上。**
1. 安装 `joi` 包，为表单中携带的每一个数据项，定义验证规则：
``` bash
npm install joi@17.4.0
```
2. 安装 `@escook/express-joi` 中间件，来实现自动对表单数据进行验证的功能：
``` bash
npm install @escook/express-joi
```
3. 新建 `/schema/user` 用户信息验证规则模块，并初始化代码：
``` js
// 导入定义验证规则包
const Joi = require('joi')

// 定义用户名和密码的验证规则
/**
    string() 值必须时字符串
    alphanum() 值只能是包含 a-z A-Z 0-9的字符串
    min(length) 最想长度
    max(length) 最大长度
    required() 值是必填项,不能为undefined
    pattern(正则表达式) 值必须符合正则表达式的规则
**/
const username = Joi.string().alphanum().min(3).max(10).required()
const password = Joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}
```

4. 修改 `/router/user` 中的代码：
```js
const express = require('express')
const router = express.Router()
const user_handler = require('../router_heandler/user')

// 1 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

// 注册新用户
// 在用户注册的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 数据验证失败后，会终止后续的代码执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/register', expressJoi(reg_login_schema), user_handler.regUser)
// 登录
router.post('/login', user_handler.login)

module.exports = router
```

5. 在 `app.js` 的全局错误级别中间件中，捕获失败的错误，并把验证失败的结果响应给客户端：
``` js
const Joi = require('joi')		// 导入 joi 包

...

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if(err instanceof Joi.ValidationError) return res.cc(err)
    // 未知的错误
    res.cc(err)
})
```

### 登录
- 实现步骤
	1. 检测表单数据是否合法
	2. 根据用户名查询用户的数据
	3. 判断用户输入的密码是否正确
	4. 生成 JWT 的 Token 字符串

#### 检测表单数据是否合法
- 将 `/router/user` 中 `登录` 的路由代码如下修改：
```js
// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)
```
#### 根据用户名查询用户的数据
1. 接收表单数据
``` js
const userinfo = req.body
```
2. 定义 SQL 语句
``` js
const sql = 'select * from ev_users where username=?'
```
3. 执行 SQL 语句，根据用户名查询用户的信息
``` js
db.query(sql, userinfo.usernam, (err, results) => {
	// 执行 SQL 语句失败
	if(err) return res.cc(err)
	// 执行 SQL 语句成功，但获取到的数据条不等于 1 - 即没有注册到数据库中
	if(results.length !== 1) return res.cc('登陆失败！')
})
```
#### 判断用户输入的密码是否正确
> 核心实现思路：调用 `bcrypt.compareSync(用户提交的密码，数据库中的密码) 方法比较密码是否一直

> 返回值是布尔值（trun 一致， false 不一致）

具体实现如下：
```js
// 判断密码是否正确 - 用户输入的密码和数据库中储存的密码进行对比
const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if(!compareResult) return res.cc('登陆失败！')
        res.send('登陆成功') 
```

#### 生成 JWT 的 Token 字符串
> 核心注意点：在生成 Token 字符串的时候,一定要剔除 **密码** 和 **头像 **的值

1. 通过 ES6 的高级语法,快速提出`密码`和`头像`的值：
``` js
// 提出完毕之后 user 中只保留了用户的 id, username, nickname, emaill 这四个属性的值
const user = { ...resluts[0], password: '', user_pic: ''}
```

2. 运行如下的命令,安装生成 Token 字符串的包：
``` bash
npm i jsonwebtoken@8.5.1
```

3. 在 `/router_handler/user` 模块的头部区域，导入 `jsonwebtoken` 包：
``` js
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
```

4. 创建 `config.js` 文件，并向外共享**加密**和**还原**Token的 `jwtSecretKey` 字符串：
``` js
module.exports = {
	jwtSecretKey: 'itheima No1. ^_^',
}
```

5. 将用户信息对象加密成 Token 字符串：
```js
// 导入配置文件
const config = require('../config')

// 生成 Token 字符串
const tokenStr = jwt.sign(user, config.jwtSecretKey, {
	expiresIn: '10h'
})
```

6. 将生成的 Token 字符串响应给客户端：
```js
res.send({
	status: 0,
	message: '登录成功！',
	// 为了方便客户端使用 Token，在服务器直接拼接上 Bearer 的前缀
	token: 'Bearer' + tokenStr,
})
```

#### 配置解析Token的中间件
1. 运行如下的命令，安装 Token 的中间件：

```bash
npm i express-jwt@5.3.3
```

2. 在 `app.js` 中注册路由之前，配置解析 Token 的中间件：
```js
// 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
```

3. 在 `app.js` 中的`错误级别中间件` 里面，捕获并处理 Token 认证失败后的错误：
```js
// 错误级别中间件
app.use((err, req, res, next) => {
	// 省略其他代码 ...
	
	// 捕获身份认证失败的错误
	if(err,name === 'UnauthorizedError') return res.cc('身份认证失败！')
	
	// 未知错误...
})

```

## 个人中心
### 获取用户的基本信息
- 实现步骤
	1. 初始化**路由**模块
	2. 初始化**路由处理函数**模块
	3. 获取用户的基本信息
	
#### 初始化路由模块
1. 创建`/router/userinfo`路由模块，并初始化如下的代码：

``` js
// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 获取用户基本信息
router.get('/userinfo'. (req, res) => {
	res.send('ok')
})
// 向外共享路由对象
module.exports = router
```
2. 在 `app.js` 中导入并使用个人中心的路由模块

```js
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)
```
#### 初始化路由处理函数模块
1. 创建 `/router_handler/userinfo` 路由处理函数模块，并初始化如下的代码：

```js
// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
	res.send('ok')
})
```
2. 修改 `/router/userinf` 中的代码如下：

```js
const express = require('express')
const router = express.Router()

// 导入用户信息的处理函数模块
const userinfo = require('../router_handler/userinfo')

// 获取用户基本信息
router.get('/useringo', userinfo_handler.getUserInfo)

module.exports = router
```
#### 获取用户基本信息
1. 在 `/router_handler/userinfo` 头部导入数据库操作模块

```js
// 导入数据库操作模块
const db = require('../db/index')
```
2. 定义 SQL 语句

```js
// 根据用户 id，查询用户的基本信息
// 注意：为了防止用户密码泄露，需要排除 password 字段
const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'
```
3. 调用 `db.query()` 执行 SQL 语句

``` js
// 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
db.query(sql, req,user.id, (err, results) => {
	// 1. 执行 SQL 语句失败
	if(err) return res.cc(err)
	// 2. 执行 SQL 语句成功，但是查询到的数据条不等于 1
	if(results.length !== 1) return res.cc('获取用户信息失败！')
	// 3. 将用户信息响应给客户端
	res.send({
		status: 0,
		message: '获取用户基本信息成功',
		data: results[0],
	})
})
```
