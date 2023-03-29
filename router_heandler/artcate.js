const db = require('../db/index')


// 查看文章分类的路由处理函数
exports.getArticleCates = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, results) => {
        if(err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results,
        })
    })
}

// 新增文章分类的路由处理函数
exports.addArticleCates = (req, res) => {
    const sql = `select * from ev_article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if(err) return res.cc(err)
        // 查重判断 - 四种情况
        if(results.length === 2) return res.cc('分类名称与分类别名被占用，请跟换使用！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与分类别名被占用，请更换使用！')
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换使用！')
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换使用！')
        // 分类名称和分类别名都可用，执行添加的动作
        const sql = `insert into ev_article_cate set ?`
        db.query(sql, req.body, (err, results) => {
            if(err) res.cc(err)
            if(results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.cc('新增文章分类成功！', 0)
        })
    })
}

// 删除文章分类的路由处理函数
exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除文章分类成功！', 0)
    })
}
// 根据 ID 查询文章分类数据
exports.getatesById = (req, res) => {
    const sql = `select * from ev_article_cate where id=? `
    db.query(sql, req.params.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('根据 ID 查询文章分类失败！')
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}
// 根据 ID 更新文章分类数据
exports.updateCateById = (req, res) => {
    // 定义查重的 SQL 语句
    const sql = `select * from  ev_article_cate where Id<>? and (name=? or alias=?)`
    db.query(sql, [req.body.Id, req.body.name, req.alias], (err, results) => {
        if(err) return res.cc(err)
        // 查重判断 - 四种情况
        if(results.length === 2) return res.cc('分类名称与分类别名被占用，请跟换使用！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与分类别名被占用，请更换使用！')
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换使用！')
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换使用！')
        // 名称和别名都可以用，执行根据 ID 更新
        const sql = `update ev_article_cate set ? where id=?`
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            res.cc('更新文章分类成功！')
        })
    })
}