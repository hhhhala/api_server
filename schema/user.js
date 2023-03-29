// 导入定义验证规则包
const Joi = require('joi')

// 定义用户名和密码的验证规则
/**
    string() 值必须时字符串
    number() 整型-数字
    integer() 整数，不能带小数点
    alphanum() 值只能是包含 a-z A-Z 0-9的字符串
    min(length) 最想长度
    max(length) 最大长度
    required() 值是必填项,不能为undefined
    pattern(正则表达式) 值必须符合正则表达式的规则
    dataUri() base64格式的字符串数据 如 - data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
**/
const username = Joi.string().alphanum().min(3).max(10).required()
const password = Joi.string().pattern(/^[\S]{6,12}$/).required()
const id = Joi.number().integer().min(1).required()
const nickname = Joi.string().required()
const email = Joi.string().email().required()
const avatar = Joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}
// 验证规则 - 更新用户的信息规则
exports.update_userinfo_schema = {
    // 需要对 req.body 里面的数据进行验证
    body: {
        nickname,
        email,
    }
}
// 验证规则 - 重置密码
exports.update_password_schema = {
    body: {
        oldPwd: password,
        // joi.ref('oldPwd') 表示 newPwd 的值必须与 oldPwd 的值保持一致
        // joi.not 表示为否
        // .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: Joi.not(Joi.ref('oldPwd')).concat(password)
    }
}

// 验证规则 - 更新头像
exports.update_avatar_schema = {
    body: {
        avatar
    }
}