import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Lectures from './Lectures';

const Topics = ({ courseId, topics, fetchCourse,isTrainer }) => {
    const [title, setTitle] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [topicId, setTopicId] = useState('');
    const [expandedTopic, setExpandedTopic] = useState(null);

    const handleAddTopic = async (event) => {
        event.preventDefault();
        try {
            const token = Cookies.get('token');
            await axios.post(`/course/${courseId}/topic`, { title }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTitle("");
            setShowAddForm(false);
            fetchCourse(); // Refresh the course data
        } catch (error) {
            console.error('Error adding topic:', error);
        }
    };

    const handleEditTopic = async (event) => {
        event.preventDefault();
        try {
            const token = Cookies.get('token');
            await axios.put(`/course/${courseId}/topic/${topicId}`, { title }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTitle("");
            fetchCourse(); // Refresh the course data
            setShowEditForm(false);
        } catch (error) {
            console.error('Error editing topic:', error);
        }
    };

    const handleDeleteCourse = async (topicId) => {
        try {
            const token = Cookies.get('token');
            await axios.delete(`/course/${courseId}/topic/${topicId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchCourse();
        } catch (error) {
            console.error('Error deleting topic:', error);
        }
    };

    const handleInputChange = (event) => {
        setTitle(event.target.value);
    };

    const handleEditClick = (topicId, currentTitle) => {
        setTopicId(topicId);
        setTitle(currentTitle);
        setShowEditForm(true);
    };

    const handleToggleLectures = (topicId) => {
        setExpandedTopic(expandedTopic === topicId ? null : topicId);
    };

    return (
        <div className='px-4 sm:px-6 py-4 bg-teal-600 rounded-lg'>
            <h2 className="mt-3 mb-5 text-xl font-semibold">Topics</h2>
            {topics && topics.length > 0 ? (
                topics.map((topic, index) => (
                    <div key={topic._id} className='bg-teal-200 mt-0.5 p-4 rounded-lg'>
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold cursor-pointer" onClick={() => handleToggleLectures(topic._id)}>
                                 {topic.title}
                            </h4>
                            {isTrainer&&(
                            <div>
                                <button
                                    className="bg-rose-500 text-white px-4 py-2 rounded mr-2 hover:bg-rose-700"
                                    onClick={() => handleDeleteCourse(topic._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => handleEditClick(topic._id, topic.title)}
                                >
                                    Edit
                                </button>
                            </div>
                )}
                        </div>
                        {expandedTopic === topic._id && (
                            <Lectures courseId={courseId} topicId={topic._id} lectures={topic.lectures} fetchCourse={fetchCourse} isTrainer={isTrainer}/>
                        )}
                    </div>
                ))
            ) : (
                <p>No topics available.</p>
            )}
            {isTrainer&&(<div className="text-center mt-3">
                <button
                    className="bg-teal-200 text-teal-900 px-4 py-2 rounded hover:bg-teal-400"
                    onClick={() => setShowAddForm(true)}
                >
                    Add topic
                </button>
            </div>)}
            {showAddForm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Topic</h3>
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowAddForm(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddTopic}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={handleInputChange}
                                    required
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
                                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditForm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Topic</h3>
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowEditForm(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditTopic}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
                                    onClick={() => setShowEditForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Topics;
