const express = require('express');
const router = express.Router();
const checkAuth = require('../middelWare/checkAuth');
const courseController = require('../controller/course-controller');

router.post('/course', courseController.add_course); 

router.get('/courses' , courseController.get_all_courses);

router.get('/course/:courseId', courseController.get_single_course);

router.put('/course/:courseId/applyin',checkAuth,courseController.apply_in);
module.exports = router;