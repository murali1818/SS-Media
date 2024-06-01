import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    const isAuthenticated = !!Cookies.get('token');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownVisible(prevState => !prevState);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:5000/logout");
            toast.success(response.data.message);
            Cookies.remove('token');
            setIsDropdownVisible(false);
            navigate('/');
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-700 p-3 ">
            <div className="px-3 flex justify-between  items-center">
                <Link className="text-white text-2xl font-bold" to={"/"}>
                    <img style={{ width: "150px" }} src="/images/logo.png" alt="logo" />
                </Link>
                {isAuthenticated ? (
                    <div className="">
                        <div className=" mr-0" ref={dropdownRef}>
                            <img
                                src={'/images/image.png'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full cursor-pointer"
                                onClick={toggleDropdown}
                            />
                            {isDropdownVisible && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-teal-700">
                                    <Link className="block px-4 py-2 text-gray-800 hover:bg-teal-400" to="/">Home</Link>
                                    <Link className="block px-4 py-2 text-gray-800 hover:bg-teal-400" to="/myprofile">Profile</Link>
                                    
                                    <button
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-800"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link className="bg-teal-300 text-teal-900 px-4 py-2 rounded hover:bg-teal-900 hover:text-teal-100" to={"/login"}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Header;
