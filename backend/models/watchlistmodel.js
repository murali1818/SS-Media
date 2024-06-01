const mongoose = require('mongoose');
const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }]
});
const Watchlist = mongoose.model('Watchlist', watchlistSchema);
module.exports = Watchlist;
