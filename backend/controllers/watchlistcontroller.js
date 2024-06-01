const Watchlist = require('../models/watchlistmodel');
// Function to add a course to the watchlist
exports.addToWatchlist = async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.params;

    try {
        // Check if the product already exists in the watchlist
        const existingWatchlist = await Watchlist.findOne({ userId: userId });
        if (existingWatchlist && existingWatchlist.courses.includes(courseId)) {
            return res.status(400).json({ success: false, message: 'Course already exists in the watchlist' });
        }
        // Add the product to the watchlist
        const watchlist = await Watchlist.findOneAndUpdate(
            { userId: userId },
            { $push: { courses: courseId } },
            { upsert: true, new: true }
        );

        return res.status(200).json({ success: true, message: 'Courses added to watchlist', watchlist: watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Function to remove a Course from the watchlist
exports.removeFromWatchlist = async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.params;
    try {
        const watchlist = await Watchlist.findOneAndUpdate(
            { userId: userId },
            { $pull: {  courses: courseId} },
            { new: true }
        );
        if (!watchlist) {
            return res.status(404).json({ success: false, message: 'Watchlist not found for this user' });
        }
        return res.status(200).json({ success: true, message: 'Crouses removed from watchlist', watchlist: watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Function to get the user's watchlist
exports.getWatchlist = async (req, res) => {
    const userId = req.user._id;
    try {
        const watchlist = await Watchlist.findOne({ userId: userId }).populate('courses');
        if (!watchlist) {
            return res.status(404).json({ success: false, message: 'Watchlist not found for this user' });
        }
        return res.status(200).json({ success: true, watchlist: watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
