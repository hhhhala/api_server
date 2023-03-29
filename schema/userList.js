const Joi = require('joi')

// 定义 name、age、sex 的验证规则
const name = Joi.string().min(2).max(6).required()
const age = Joi.number().max(3).min(1).required()
const sex = Joi.number().valid(0, 1).required()

exports.add_userlist_schema = {
    body:{
        name,
        age,
        sex
    }
}