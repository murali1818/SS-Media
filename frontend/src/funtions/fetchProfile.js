import axios from 'axios';
import Cookies from 'js-cookie';

const fetchProfile = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get("http://localhost:5000/myprofile", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.user;
  } catch (error) {
    throw new Error('Failed to fetch profile');
  }
};
export default fetchProfile;
