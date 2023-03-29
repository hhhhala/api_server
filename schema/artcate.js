// 导入定义验证规则的模块
const joi = require('joi')

const name = joi.string().required()
const alias = joi.string().alphanum().required()
const id = joi.number().integer().min(1).required()

// 向外共享验证规则
exports.add_cates_schema = {
    body:{
        name,
        alias,
    }
}
exports.delete_cates_schema = {
    params:{
        id
    }
}
exports.get_cates_schema = {
    params:{
        id
    }
}
exports.update_cates_schema = {
    body:{
        Id:id,
        name,
        alias,
    }
}