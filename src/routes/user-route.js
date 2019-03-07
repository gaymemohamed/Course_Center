const express = require('express');
const router = express.Router();
const checkAuth = require('../middelWare/checkAuth');
const userController = require('../controller/user-controller');
const multer = require('multer');
const storage = multer.diskStorage({
    destination(req , file , cb){
        cb(null, './uploads/');
    },
    filename(req, file , cb){
        cb(null, file.originalname);
    }
});



const upload = multer({
    storage:storage
})

router.post('/signup',upload.array('usersImg', 3), userController.user_signup);

router.post('/login', userController.user_login);

router.get('/users' , userController.get_all_users);

router.get('/user/:userId' , userController.get_user);

router.put('/user/:userId',upload.single('usersImg'), userController.update_user);

router.delete('/user/:userId', userController.delete_user);

module.exports = router;