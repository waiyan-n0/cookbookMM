const {RDB} = require('./helperFunc');

const setCacheUser = async(userId, user) => {
    await RDB.set(userId, user);
}

const getCacheUser = async(userId) =>{
    return await RDB.get(userId);
}

module.exports = {
    setCacheUser,
    getCacheUser,
}