import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Lectures from './Lectures';

const Course = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedTopic, setExpandedTopic] = useState(null);

    const fetchCourse = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`http://localhost:5000/mycourse/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCourse(response.data.course);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    useEffect(() => {
        fetchCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleLectures = (topicId) => {
        setExpandedTopic(expandedTopic === topicId ? null : topicId);
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-4 sm:px-6 py-4'>
            <h2>Course Details</h2>
            {course ? (
                <div>
                    <div className="py-5">
                        <div className="bg-teal-300 p-4 rounded-lg flex flex-col lg:flex-row lg:items-start justify-between">
                            <div className="lg:w-3/4">
                                <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
                                <p className="mt-2">{course.description}</p>
                                <p className="mt-2"><strong>Category:</strong> {course.category}</p>
                                <p className="mt-2"><strong>Duration:</strong> {course.duration}</p>
                                <p className="mt-2"><strong>Level:</strong> {course.level}</p>
                                <p className="mt-2"><strong>Trainer:</strong> {course.trainer}</p>
                                <p className="mt-2"><strong>Price:</strong> ${course.amount}</p>
                                {course.syllabus && (
                                    <a href={course.syllabus} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white mt-2 mb-3 px-4 py-2 rounded transition duration-300 ease-in-out">View Syllabus</a>
                                )}
                            </div>
                            <div className="lg:w-1/4 ml-auto">
                                <img src={course.image} alt={course.title} className="rounded-lg shadow-lg mb-4 lg:mb-0" />
                            </div>
                        </div>
                    </div>
                    <div className='px-4 sm:px-6 py-4 bg-teal-600 rounded-lg'>
                        <h2 className="mt-3 text-xl font-semibold">Topics</h2>
                        {course.topics && course.topics.length > 0 ? (
                            course.topics.map((topic, index) => (
                                <div key={topic._id} className='bg-teal-200 mt-4 p-4 rounded-lg'>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold cursor-pointer" onClick={() => handleToggleLectures(topic._id)}>
                                            {index + 1}. {topic.title}
                                        </h4>

                                    </div>
                                    {expandedTopic === topic._id && (
                                        <Lectures courseId={course._id} topicId={topic._id} lectures={topic.lectures} fetchCourse={fetchCourse} />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No topics available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>Course not found</div>
            )}
        </div>
    );
};

export default Course;
