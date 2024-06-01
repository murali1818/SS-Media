import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fetchProfile from '../../funtions/fetchProfile';
import { Link } from 'react-router-dom';
import MyCourses from '../courses/Mycourses';

function Home() {
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLecturer, setisLecturer] = useState(false)
    const [isLearner, setisLearner] = useState(false)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/allcourses");
                setCourses(response.data.courses);
                setLoading(false)
                console.log(response.data.courses);
            } catch (error) {
                setError(error)
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfile = await fetchProfile();
                setUser(userProfile);
                if (user && user.role === 'Lecturer') {
                    setisLecturer(true)
                }
                if (user && user.role === 'Learner') {
                    setisLearner(true)
                }
                setLoading(false);
            } catch (error) {
                setisLecturer(false)
                setisLearner(false)
                setLoading(false);
            }
        };
        fetchData();
    }, [user, courses]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    const handlewatchlist = async (id) => {
        console.log(id);
        alert(id);
    }

    return (
        <>
            {isLecturer && (
                <MyCourses isAuthenticated={isLecturer}></MyCourses>
            )}
            {!isLecturer && (
            <>
                <div className="px-4 sm:px-6 py-4 mx-4">
                    <h2 className="text-2xl font-bold mb-4">Courses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-3">
                        {courses.map(course => (
                            <div key={course._id} className="bg-gray-200 shadow-md shadow-gray-500 rounded-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:bg-gray-300">
                                <div >
                                    <Link to={`/course/${course.title}/${course._id}`}>
                                        <img src={course.image} alt={course.title} className="rounded-lg shadow-lg mb-4 min-h-60 max-h-60  min-w-full lg:mb-0" />
                                        <div className='p-2'>
                                            <h3 className="text-lg font-semibold">{course.title}</h3>
                                            <p>Duration: {course.duration}</p>
                                            <p>Category: {course.category}</p>
                                            <p>Level: {course.level}</p>
                                        </div>
                                    </Link>
                                </div>
                                {isLearner && (
                                <div className='p-2'>
                                    <button onClick={() => handlewatchlist(course._id)} className='bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-700'>Add to watch list</button>
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}
        </>
    );
}
export default Home;