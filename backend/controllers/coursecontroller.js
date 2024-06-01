const Course = require('../models/coursemodel');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodels');
const mongoose = require('mongoose');

// Add a new course
exports.addCourse = async (req, res) => {
    try {
        const { title, description, amount, level, category, duration,syllabus } = req.body;
        const { _id: trainerId, name: trainer } = req.user;
        //console.log(title, description, amount, level, category, duration);
        const course = await Course.create({
            title,
            description,
            amount,
            level,
            category,
            duration,
            trainerId,
            trainer,
            syllabus
        });

        res.status(201).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
///get user coursers
exports.getUserCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        const userCourses = await Course.find({ trainerId: userId });
        res.status(200).json({ success: true, courses: userCourses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        // Ensure that the course belongs to the logged-in user
        const userId = req.user._id;
        const course = await Course.findOne({ _id: courseId, trainerId: userId });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        await Course.findByIdAndDelete(courseId);
        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Edit a course
exports.editCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user._id;
        const { title, description, amount, level, category, duration, rating, syllabus,image} = req.body;
        const course = await Course.findOneAndUpdate(
            { _id: courseId, trainerId: userId },
            { title, description, amount, level, category, duration, rating, syllabus,image },
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, course});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, courses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Get a single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user._id;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, course,userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//add topic
exports.addTopic = async (req, res) => {
    try {
        const courseId = req.params.id;
        const {title } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const newTopic = { title,lectures: [] };
        course.topics.push(newTopic);
        await course.save();

        res.status(201).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//edit topic
exports.editTopic = async (req, res) => {
    try {
        const courseId = req.params.id;
        const topicId=req.params.tid
        const { title, description } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const topic = course.topics.id(topicId);

        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }

        topic.title = title || topic.title;
        topic.description = description || topic.description;
        await course.save();

        res.status(200).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteTopic = async (req, res) => {
    try {
        const { courseId, topicId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        course.topics.pull({ _id: topicId });
        await course.save();

        res.status(200).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//lectures
exports.addLecture = async (req, res) => {
    try {
        const { courseId, topicId } = req.params;
        const { title, videoURL,pdf } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const topic = course.topics.id(topicId);

        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        const newLecture = { title,  videoURL,pdf };
        topic.lectures.push(newLecture);
        await course.save();

        res.status(201).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.editLecture = async (req, res) => {
    try {
        const { courseId, topicId,lectureId} = req.params;
        const { title, duration, videoURL } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const topic = course.topics.id(topicId);

        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }

        const lecture = topic.lectures.id(lectureId);

        if (!lecture) {
            return res.status(404).json({ error: "Lecture not found" });
        }

        lecture.title = title || lecture.title;
        lecture.duration = duration || lecture.duration;
        lecture.videoURL = videoURL || lecture.videoURL;
        await course.save();

        res.status(200).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteLecture = async (req, res) => {
    try {
        const { courseId, topicId, lectureId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const topic = course.topics.id(topicId);

        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        topic.lectures.pull({ _id: lectureId });

        await course.save();

        res.status(200).json({ success: true, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
