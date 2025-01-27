import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const RESET_STATE = 'RESET_STATE'; // Replace with your actual action type if different

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch a global state reset action
    dispatch({ type: RESET_STATE });

    // Navigate to the login page
    navigate('/login');
  };

  return (
    <nav className="bg-white text-blue-600 shadow-md rounded-2xl mb-6">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex space-x-8">
          <Link
            to="/home"
            className="bg-gray-100 hover:bg-gray-200 text-lg font-medium transition-all px-4 py-2 rounded-lg shadow-sm"
          >
            Home
          </Link>
          <Link
            to="/insight"
            className="bg-gray-100 hover:bg-gray-200 text-lg font-medium transition-all px-4 py-2 rounded-lg shadow-sm"
          >
            Insight
          </Link>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg text-lg font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
