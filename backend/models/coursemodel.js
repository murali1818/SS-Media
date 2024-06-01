const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true },
    comment: { type: String }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId },
    trainer: { type: String },
    rating: { type: Number,
        default:0
     },
    syllabus: { type: String,
        default: 'www.example.com'
     },
    topics: [{
        title: String,
        lectures: [{
            title: String,
            videoURL: String,
            pdf:String
        }]
    }],
    image: {
        type: String,
        default: '/images/No.png'
    },
    feedbacks: [feedbackSchema] 
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
