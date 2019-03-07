const mongoose = require('mongoose');
const Course = require('../models/course');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middelWare/checkAuth');
const User = require('../models/user');

exports.add_course = async(req,res,next)=>{
    try{
    const course  = new Course({
        name:req.body.name,
        price: req.body.price,
        num_hours:req.body.num_hours,
        description :req.body.description
    })
    let addCourse = await Course.create(course);
    return res.status(200).json({
        message:"Course Created",
        courseDetails : course
    });

}
catch(err){
    next(err);
}
};

exports.get_all_courses =async (req, res , next)=>{
try{
    let getCourses = await Course.find({}).populate('students');
    return res.status(200).json({
        numberOfCourses : getCourses.length,
        courses : getCourses.map(getCourses=>{
            return {
                id:getCourses.id,
                name:getCourses.name,
                students : getCourses.students,
                price: getCourses.price,
                num_hours:getCourses.num_hours,
                description:getCourses.description
            }
        })
    });
}
catch(err){
    next(err);
}
};

exports.get_single_course =async (req, res , next)=>{
    try{
        const id = req.params.courseId;
        let CourseDetail = await Course.findById(id).populate('students');
        return res.status(200).json({
            CourseDetail : CourseDetail
        }) 
    }
    catch(err){
        next(err);
    }
};

exports.apply_in = async(req , res , next )=>{
    let courseId = req.params.courseId;
    let userId = req.userData.userId;
    console.log(req.userData);
    let course = await Course.findById(courseId);
    let user = await User.findById(userId);
    let studentsArr = course.students;
    for(let i =0 ; i< studentsArr.length ; i++){
        if(userId == studentsArr[i]){
            return res.json({
                message:"you apply in"
            })
        }
    }
    course.students.push(userId);
    await course.save();
    user.courses.push(courseId);
    await user.save();
    let courseDoc = await Course.findById(courseId).populate('students');
    let userDoc = await User.findById(userId).populate('courses');
    return res.status(200).json({
        message : "user Updated",
        courseDoc: courseDoc,
        userDoc : userDoc
    });
}