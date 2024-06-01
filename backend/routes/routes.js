const express=require('express');
const {registerUser, login, logout, forgetpassword, resetpassword, myprofile, changepassword,getAllUsers,editUserRole} = require('../controllers/authController');
const { isauthenticateuser } = require('../middleware/authenticate');
const { addCourse, getUserCourses, deleteCourse, editCourse, getCourseById, getAllCourses, addTopic, editTopic, deleteTopic, addLecture, editLecture, deleteLecture, } = require('../controllers/coursecontroller');
const { addToWatchlist, removeFromWatchlist, getWatchlist } = require('../controllers/watchlistcontroller');
const router=express.Router();
//user routes
router.route('/register').post(registerUser);
router.route('/login').post (login);
router.route('/logout').post(logout);
router.route('/password/forgot').post(forgetpassword);
router.route('/password/reset/:token').post(resetpassword);
router.route('/myprofile').get(isauthenticateuser,myprofile);
router.route('/changepassword').post(isauthenticateuser,changepassword);
router.route('/users').get(getAllUsers);
router.route('/edit-role').put(editUserRole);
//courseroutes
router.route('/addcourse').post(isauthenticateuser,addCourse);  
router.route('/mycourses').get(isauthenticateuser,getUserCourses);
router.route('/mycourse/delete/:id').delete(isauthenticateuser,deleteCourse);
router.route('/mycourse/edit/:id').put(isauthenticateuser,editCourse);
router.route('/mycourse/:id').get(isauthenticateuser,getCourseById);
router.route('/course/:id').get(isauthenticateuser,getCourseById);
router.route('/allcourses').get(getAllCourses);
// Topic routes
router.route('/course/:id/topic').post(isauthenticateuser,addTopic);
router.route('/course/:id/topic/:tid').put(isauthenticateuser,editTopic);
router.route('/course/:courseId/topic/:topicId').delete(isauthenticateuser, deleteTopic);
// Lecture routes
router.route('/course/:courseId/topic/:topicId/lecture').post(isauthenticateuser,addLecture);
router.route('/course/:courseId/topic/:topicId/lecture/:lectureId').put(isauthenticateuser,editLecture);
router.route('/course/:courseId/topic/:topicId/lecture/:lectureId').delete(isauthenticateuser,deleteLecture);
//watchlist
router.route('/course/addwatchlist/:courseId').post(isauthenticateuser,addToWatchlist);
router.route('/course/removewatchlist/:courseId').delete(isauthenticateuser,removeFromWatchlist);
router.route('/courses/watchlist').get(isauthenticateuser,getWatchlist);

module.exports=router