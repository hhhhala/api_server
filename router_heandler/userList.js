const db = require('../db/index')

// 查看用户列表用户数据的路由处理函数
exports.getUserList = (req, res) => {
    // 定义 SQL 语句
    const sql = `select * from ev_users_list where is_delete=0 order by id asc`
    // 执行 SQL 语句并判断是否查询成功
    db.query(sql, (err, results) => {
        // SQL 语句执行失败
        if(err) return res.cc(err)
        if(results.length < 1) return res.cc('查询失败')
        res.send({
            status: 0,
            message: '用户列表数据获取成功！',
            data: results,
        })
    })

}

// 添加用户数据到用户列表的路由处理函数
exports.addUserList = (req, res) => {
    
    // const sql = `insert into ev_users_list ?`
    // db.query(sql, req.body, (err, results) => {
    //     if(err) return res.cc(err)
    //     if(results.affectedRows !== 1) return res.cc('添加失败！')
    //     res.cc('用户添加成功！', 0)
    // })
}