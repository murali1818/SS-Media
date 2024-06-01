/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import fetchProfile from '../../funtions/fetchProfile';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate,useParams } from 'react-router-dom';
import Topics from './Topics';

const MyCourse = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [course, setCourse] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedCourse, setEditedCourse] = useState({});
    const [isTrainer, setIsTrainer] = useState(false);
    const navigate = useNavigate();

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

    const fetchCourse = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`http://localhost:5000/mycourse/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data.course);
            setCourse(response.data.course);
            setEditedCourse(response.data.course);
            if (user && user._id === response.data.course.trainerId) {
                setIsTrainer(true);
            }
            
        } catch (error) {
            navigate('/');
            setError('Failed to fetch courses');
        }
    };

    useEffect(() => {
            fetchCourse();
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCourse({
            ...editedCourse,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.put(`http://localhost:5000/mycourse/edit/${id}`, editedCourse, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data.course);
            setCourse(response.data.course);
            setIsEditing(false);
        } catch (error) {
            setError('Failed to save course');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="px-4 sm:px-6 py-4">
                <div>
                    {isEditing ? (
                        <div className='p-0'>
                            <h2 className="mt-3 text-xl font-semibold">Edit Course</h2>
                            <label htmlFor="title" className="block text-md font-medium text-gray-900">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={editedCourse.title}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <label htmlFor="image" className="block text-md font-medium text-gray-900">Image Url:</label>
                            <input
                                type="text"
                                name="image"
                                value={editedCourse.image}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <label htmlFor="description" className="block text-md font-medium text-gray-900">Description:</label>
                            <textarea
                                name="description"
                                value={editedCourse.description}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <label htmlFor="duration" className="block text-md font-medium text-gray-900">Duration:</label>
                            <input
                                type="text"
                                name="duration"
                                value={editedCourse.duration}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <label htmlFor="level" className="block text-md font-medium text-gray-900">Level:</label>
                            <select
                                id="level"
                                name="level"
                                value={editedCourse.level}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            >
                                <option value="">Select Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <label htmlFor="category" className="block text-md font-medium text-gray-900">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={editedCourse.category}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            <label htmlFor="trainer" className="block text-md font-medium text-gray-900">Trainer Name:</label>
                            <input
                                type="text"
                                name="trainer"
                                value={editedCourse.trainer}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <label htmlFor="amount" className="block text-md font-medium text-gray-900">Amount:</label>
                            <input
                                type="number"
                                name="amount"
                                value={editedCourse.amount}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700">Syllabus</label>
                            <input
                                type="text"
                                id="syllabus"
                                name="syllabus"
                                value={editedCourse.syllabus}
                                onChange={handleChange}
                                className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className=" py-5">
                                <div className="bg-teal-300 p-4 rounded-lg flex flex-col lg:flex-row lg:items-start justify-between">
                                    <div className="lg:w-3/4">
                                        <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
                                        <p className="mt-2">{course.description}</p>
                                        <p className="mt-2"><strong>Category:</strong> {course.category}</p>
                                        <p className="mt-2"><strong>Duration:</strong> {course.duration}</p>
                                        <p className="mt-2"><strong>Level:</strong> {course.level}</p>
                                        <p className="mt-2"><strong>Trainer:</strong> {course.trainer}</p>
                                        <p className="mt-2"><strong>Price:</strong> ${course.amount}</p>
                                        {course.syllabus && <a href={course.syllabus} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white mt-2 mb-3 px-4 py-2 rounded transition duration-300 ease-in-out">View Syllabus</a>}
                                    </div>
                                    <div className="lg:w-1/4 ml-auto">
                                        <img src={course.image} alt={course.title} className="rounded-lg shadow-lg mb-4 lg:mb-0" />
                                        {isTrainer && ( // Show the edit button only if the user is the trainer
                                            <button
                                                onClick={handleEdit}
                                                className="block w-full px-4 py-2 mt-5 bg-teal-600 text-white rounded hover:bg-teal-500"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Topics courseId={id} topics={course.topics} fetchCourse={fetchCourse} isTrainer={isTrainer}/>
                        </div>
                    )}
                </div>

        </div>
    );
};

export default MyCourse;
