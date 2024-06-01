import React, { useState, useEffect } from 'react';
import fetchProfile from '../../funtions/fetchProfile';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const MyCourses = ({isAuthenticated}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', amount: '', level: '', category: '', duration: '', syllabus: '' });
    const [formError, setFormError] = useState('');
    const [reload, setReload] = useState(false);
    const categories = [
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Biomedical Engineering",
        "Environmental Engineering",
        "Industrial Engineering",
        "Software Engineering",
        "Information Technology",
        "Telecommunication Engineering",
        "Robotics",
        "Materials Engineering",
        "Nuclear Engineering",
        "Petroleum Engineering",
        "Systems Engineering",
        "Automotive Engineering",
        "Mining Engineering",
        "Marine Engineering"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfile = await fetchProfile();
                setUser(userProfile);
                setLoading(false);
            } catch (error) {
                setError('You are not authorized to access this page.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get("http://localhost:5000/mycourses", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCourses(response.data.courses);
            } catch (error) {
                setError('not autherized to fetch course');
            }
        };

        if (user && user.role === 'Lecturer') {
            fetchCourses();
        }
    }, [user, reload]);

    const handleAddCourse = async (e) => {
        e.preventDefault(); // Prevent page reload
        const { title, description, amount, level, category, duration, syllabus } = newCourse;
        if (!title || !description || !amount || !level || !category || !duration || !syllabus) {
            setFormError('Please fill in all required fields.');
            return;
        }

        try {
            const token = Cookies.get('token');
            await axios.post("http://localhost:5000/addcourse", newCourse, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShowAddForm(false); // Hide the modal after successful submission
            setNewCourse({ title: '', description: '', amount: '', level: '', category: '', duration: '', syllabus: '' }); // Clear the form
            setFormError(''); // Clear any previous form errors
            setReload(!reload); // Reload courses
        } catch (error) {
            setError('Failed to add course');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: value });
    };

    const handleDeleteCourse = async (courseId) => {
        setReload(true);
        const token = Cookies.get('token');
        try {
            await axios.delete(`http://localhost:5000/mycourse/delete/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setReload(false);
        } catch (error) {
            // Handle error
            console.error('Error deleting course:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className=" px-4 sm:px-6 py-4">
            {isAuthenticated ? (
                <div>
                    <div className='flex bg-gray-400 justify-between items-center py-3 px-3 rounded-md shadow-md shadow-gray-500 mb-5'>
                        <h2 className=" text-sm font-bold lg:text-lg uppercase  px-3">My Courses</h2>
                        <div className="text-center">
                            <button
                                className="bg-teal-700 text-white  px-3 lg:px-5 py-2 text-sm font-bold lg:text-lg rounded hover:bg-teal-600"
                                onClick={() => setShowAddForm(true)}
                            >
                                Add New Course
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-3">
                        {courses.map(course => (
                            <div key={course._id} className="bg-gray-200 shadow-md shadow-gray-500 rounded-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:bg-gray-300">
                                <div>
                               
                                    <Link to={`/mycourse/${course._id}`} className="">
                                    <img src={course.image} alt={course.title} className="rounded-lg shadow-lg mb-4 min-h-60 max-h-60  min-w-full lg:mb-0" />
                                        <h3 className="text-lg font-semibold">{course.title}</h3>
                                        <p>Duration: {course.duration}</p>
                                        <p>Category: {course.category}</p>
                                        <p>Level: {course.level}</p>
                                    </Link>
                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-700"
                                            onClick={() => handleDeleteCourse(course._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showAddForm && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Add New Course</h3>
                                    <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowAddForm(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {formError && <p className="text-red-500">{formError}</p>}
                                <form onSubmit={handleAddCourse}>
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={newCourse.title}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={newCourse.description}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        ></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                                        <input
                                            type="number"
                                            id="amount"
                                            name="amount"
                                            value={newCourse.amount}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                                        <select
                                            id="level"
                                            name="level"
                                            value={newCourse.level}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        >
                                            <option value="">Select Level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={newCourse.category}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                                        <input
                                            type="text"
                                            id="duration"
                                            name="duration"
                                            value={newCourse.duration}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700">Syllabus</label>
                                        <input
                                            type="text"
                                            id="syllabus"
                                            name="syllabus"
                                            value={newCourse.syllabus}
                                            onChange={handleInputChange}
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
                                            onClick={() => setShowAddForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>You are not authorized to access this page.</p>
            )}
        </div>
    );
};

export default MyCourses;
