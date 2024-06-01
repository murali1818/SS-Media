import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Lectures = ({ courseId, topicId, lectures, fetchCourse,isTrainer }) => {
  const [title, setTitle] = useState('');
  const [videoURL, setVideoUrl] = useState('');
  const [pdf, setPdf] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [lectureId, setLectureId] = useState('');

  const handleAddLecture = async (event) => {
    event.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.post(`/course/${courseId}/topic/${topicId}/lecture`, { title, videoURL, pdf }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTitle('');
      setVideoUrl('');
      setPdf('');
      setShowAddForm(false);
      fetchCourse(); // Refresh the course data
    } catch (error) {
      console.error('Error adding lecture:', error);
    }
  };

  const handleEditLecture = async (event) => {
    event.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.put(`/course/${courseId}/topic/${topicId}/lecture/${lectureId}`, { title, videoURL, pdf }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTitle('');
      setVideoUrl('');
      setPdf('');
      setShowEditForm(false);
      fetchCourse(); // Refresh the course data
    } catch (error) {
      console.error('Error editing lecture:', error);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      const token = Cookies.get('token');
      await axios.delete(`/course/${courseId}/topic/${topicId}/lecture/${lectureId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchCourse(); // Refresh the course data
    } catch (error) {
      console.error('Error deleting lecture:', error);
    }
  };

  const handleEditClick = (lecture) => {
    setLectureId(lecture._id);
    setTitle(lecture.title);
    setVideoUrl(lecture.videoURL);
    setPdf(lecture.pdf);
    setShowEditForm(true);
  };

  return (
    <div className='px-4 sm:px-6 py-4 rounded-lg mt-5'>
      {lectures && lectures.length > 0 ? (
        lectures.map((lecture, index) => (
          <div key={lecture._id} className='bg-teal-700 mt-4 p-4 rounded-lg shadow-md'>
            <div className="flex justify-between items-center">

            <a href={lecture.videoURL} target="_blank" rel="noopener noreferrer" ><h4 className="text-lg font-semibold mb-2">{index + 1}. {lecture.title}</h4></a>
            <div>
            {lecture.pdf  && <a href={lecture.pdf} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white mt-2 mb-3 px-4 py-2 rounded transition duration-300 ease-in-out">Notes</a>}
            </div>
            
            </div>
            
            {isTrainer&&(<div className="flex space-x-2">
              <button
                className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-700"
                onClick={() => handleDeleteLecture(lecture._id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleEditClick(lecture)}
              >
                Edit
              </button>
            </div>)}
          </div>
        ))
      ) : (
        <p className="text-teal-900">No lectures available.</p>
      )}
      {isTrainer&&(<div className="text-center mt-3">
        <button
          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
          onClick={() => setShowAddForm(true)}
        >
          Add Lecture
        </button>
      </div>)}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Lecture</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowAddForm(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddLecture}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video URL</label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoURL}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">PDF</label>
                <input
                  type="text"
                  id="pdf"
                  name="pdf"
                  value={pdf}
                  onChange={(e) => setPdf(e.target.value)}
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
              <h3 className="text-lg font-semibold">Edit Lecture</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowEditForm(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditLecture}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video URL</label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoURL}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">PDF</label>
                <input
                  type="text"
                  id="pdf"
                  name="pdf"
                 value={pdf}
                  onChange={(e) => setPdf(e.target.value)}
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

export default Lectures;
