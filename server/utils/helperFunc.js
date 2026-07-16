const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('async-redis').createClient();

const RDB = {
    set: async (key, value) => await redis.set(key, JSON.stringify(value).toString()),
    get: async (key) => JSON.parse(await redis.get(key)),
    del: async (key) => await redis.del(key),
}

const Msg = (res, msg='',result={}) => {
    return res.status(200).json({con:true, msg:msg, result:result});
}

const Encoder = {
    encode: (password) => bcryptjs.hashSync(password, 10),
    compare: (plainPw,hashPw) => bcryptjs.compareSync(plainPw,hashPw),
}

const Token = {
    make: (payload) => jwt.sign(payload, process.env.SECRET_KEY_HASH, {expiresIn: '1d'}),
}

module.exports = {
    Msg,
    Encoder,
    Token,
    RDB,
}