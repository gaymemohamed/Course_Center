const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

exports.user_signup = async (req, res, next) => {
    try {
        console.log(req.files);
        let checkMail = await User.findOne({ email: req.body.email });
        if (checkMail) {
            return res.status(409).json({
                message: "Email is Exist"
            })
        }
        bcrypt.hash(req.body.password, 10 , async (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: err
                })
            } else {
                const user = new User({
                    name: req.body.name,
                    type: req.body.type,
                    email: req.body.email,
                    password: hash,
                    usersImg: req.files
                })                
                    let createUser = await User.create(user);
                    return res.status(201).json({
                        message: "User Created",
                        userDetails : user
                    })
                console.log(createUser);
            }
        })
    }
    catch (err) {
        next(err);
    }
};

exports.user_login = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).json({
                "message": "email or password is worng"
            })
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            if (result) {
                const token =jwt.sign({
                    email:user.email,
                    userId : user.id
                },    
                    'secret'
                ,{
                    expiresIn : "1h"                    
                }
            )
                return res.status(200).json({
                    message: "Auth Success",
                    token : token
                })
            } else {
                return res.status(401).json({
                    message: "Auth Failed"
                })
            }
        })

    }
    catch (err) {
        next(err);
    }
}

exports.get_all_users = async(req , res , next)=>{
    if(User.type === 'Admin'){
        let getUsers = await User.find({}).populate('courses').sort({ creationDate : -1 });
        return res.status(200).json({
        numberOfUsers : getUsers.length,
        Users : getUsers.map(getUsers=>{
            return {
                id : getUsers.id,
                name : getUsers.name,
                email : getUsers.email,
                type : getUsers.type,
                usersImg : req.files
            }
        })
    })
    }else{
        
        let getUsers = await User.find({}).populate('courses').sort({creationDate : -1}) ;
        return res.status(200).json({
        numberOfUsers : getUsers.length,
        Users : getUsers.map(getUsers=>{
            return {
                id : getUsers.id,
                name : getUsers.name,
                email : getUsers.email,
                type : getUsers.type,
                courses : getUsers.courses,
                usersImg : req.files
            }
        })
    })
    }
    
} ;

exports.get_user = async (req, res , next)=>{
    try{
        const id = req.params.userId;
    let userDetails = await User.findById(id).select('name id courses email type').populate('course', 'name price num_hours description');
    return res.status(200).json({
        userDetails : userDetails
    });
}
catch(err){
    next(err);
}
};

exports.update_user = async(req , res , next)=>{
    try{
        let id = req.params.userId 
        let user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                message: "user not found"
            })
        }
        if(req.file){
        req.body.usersImg = req.file.path;     
        }
        let userUpdated = await User.findByIdAndUpdate(id, req.body ,{new : true});
        return res.status(200).json({
            message:"user updated",
            userUpdated : userUpdated
        })                        
        

    }
    catch(err){
        next(err);
    }
}

exports.delete_user =  async (req, res, next) => {
    try{
    const id = req.params.productID;
    let userDelete = await Product.remove({ _id: id });
    return res.status(200).json({
        message: "delete product",
        productDelete: productDelete,
    });
}
catch(err){
    next(err);
}
};