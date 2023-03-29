// 导入数据库操作模块
const db = require('../db/index')

const bcrypt = require('bcryptjs')


// 获取用户基本信息路由处理函数
exports.getUserInfo = (req, res) => {
    const sql = 'select id, username, nickname, email, user_pic from ev_user where id=?'

    db.query(sql, req.user.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('用户信息查询失败')
        res.send({
            status: 0,
            message: '成功获取用户信息',
            data: results[0],
        })
    })
    
}
// 更新用户基本信息路由处理函数
exports.updateUserInfo = (req, res) => {
    // 定义 SQL 语句
    const sql = 'update ev_user set ? where id=?'
    db.query(sql, [req.body, req.user.id], (err, results) => {
        // SQL 语句执行失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不为 1
        if(results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
}
// 修改用户密码的路由处理函数
exports.updatepwd = (req, res) => {
    const sql = 'select * from ev_user where id=?'
    // 根据 id 查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // SQL 语句执行失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不为 1
        if(results.length !== 1) return res.cc('修改用户基本信息失败！')
        // 判断用户提交过来的旧密码是否一致
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if(!compareResult) return res.cc('密码不正确！')


        const sql = `update ev_user set password=? where id=?`
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if(err) return res.cc(err)
            // 执行 SQL 语句成功，但是影响行数不为 1
            if(results.affectedRows !== 1) return res.cc('密码更新失败！')
            // 成功
            res.cc('密码更新成功',0)
        })
        
    })
}

// 更换用户头像的路由处理函数
exports.updateAvatar = (req, res) => {
    const sql = `update ev_user set user_pic=? where id=?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // SQL 语句执行失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不为 1
        if(results.affectedRows !== 1) return res.cc('更换头像失败！')
        // 成功
        res.cc('更换头像成功', 0)
    })
}