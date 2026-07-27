const users = require('./../models/user_model');
const {Msg,Encoder,Token} = require('./../utils/helperFunc');
const {setCacheUser} = require("../utils/caches");

const register = async(req, res, next) =>{
    const {name,email,password} = req.body;
    try{
        const isUserExist = await users.findOne({name: name});
        const isEmailExist = await users.findOne({email: email});
        if(isUserExist){
            next(new Error('User already exists'));
            return;
        }
        if(isEmailExist){
            next(new Error('Email already exists'));
            return;
        }
        const encodePw = Encoder.encode(password);
        await new users({name: name, email: email, password: encodePw}).save();
        Msg(res, "User registered successfully.", req.body);
    }catch(err){
        console.log(err);
    }
}
const login = async(req, res, next) => {
    const {name, email, password} = req.body;
    const isUserExist =await users.findOne({name: name, email: email});

    if(!isUserExist){
        next(new Error('Credential Error(Wrong username or email)!'));
        return;
    }
    //password matched or not
    if(!Encoder.compare(password, isUserExist.password)){
        next(new Error('Wrong Password!'));
        return;
    }
    //deleting unwanted data for jwt
    const curUser = isUserExist.toObject();
    delete curUser.password;
    delete curUser.__v;
    await setCacheUser(isUserExist._id.toString(), curUser);

    let token = Token.make({id:isUserExist._id.toString()});
    Msg(res, "User login successfully.", {token:token});
}
const getAllUsers = async(req, res, next) => {
    try{
        const allUsers = await users.find();
        if(!allUsers){
            console.log(allUsers);
            next(new Error('Error getting all users from db.'));
            return;
        }
        Msg(res, "All users retrieved successfully.", allUsers);
    }catch(err){
        console.log(err);
        next(new Error('Error getting all users.'));
    }
}
const getMe = async(req, res, next) => {
    Msg(res, "User Info", req.user);
}
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { name, image } = req.body;

        if (!userId) {
            return next(new Error('User ID is required!'));
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (image !== undefined) updateFields.image = image;

        if (Object.keys(updateFields).length === 0) {
            return next(new Error('No fields provided to update!'));
        }

        const updatedUserDoc = await users.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { returnDocument: 'after', runValidators: true }
        ).select('-password');

        if (!updatedUserDoc) {
            return next(new Error('User not found!'));
        }
        const updatedUserObj = updatedUserDoc.toObject();
        await setCacheUser(userId.toString(), updatedUserObj);
        Msg(res, "Profile updated successfully.", updatedUserObj);
    } catch (err) {
        console.log('Error updating profile: ', err);
        next(new Error('Error updating profile'));
    }
};

module.exports ={
    register, login,
    getMe, getAllUsers,
    updateProfile
}