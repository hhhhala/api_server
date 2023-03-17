// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcrypt 加密模块
const bcrypt = require('bcryptjs')


// 新用户注册操作
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body
    // 对表单中的数据,进行合法性的校验
    // if(!userinfo.username || !userinfo.password){
    //     return res.send({status: 1, msg: '用户名或密码不合法'})
    // }

    // 定于 SQL 语句,查询用户名是否被占用
    const sqlStr = 'select * from ev_user where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        // if(err) return res.send({status: 1, msg: err.message})
        if(err) return res.cc(err) 
        // 判断用户名是否被占用
        // if(results.length > 0) return res.send({status: 1, msg: '用户名被占用,请更换用户名!'})
        if(results.length > 0) return res.cc('用户名被占用,请更换用户名!')

        // 调用 bcrypt,hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 定义插入新用户的 SQL 语句
        const sql = 'insert into ev_user set ?'
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
    }) 
     
}



exports.login = (req, res) => {
    res.send('login OK')
}