import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { getStats } from '../api/books';
import { RESET_STATE } from '../redux/actions/types'; // Importing the reset action type
import { setBooksRead, setTotalAuthors, setTotalBooks } from '../redux/slices/statSlice';

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // React Router's navigation hook
  const userName = useSelector((state: RootState) => state.user.name);
  const totalBooks = useSelector((state: RootState) => state.stat.totalBooks);
  const totalAuthors = useSelector((state: RootState) => state.stat.totalAuthors);
  const booksRead = useSelector((state: RootState) => state.stat.booksRead);

  // State for dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getStats();
        dispatch(setTotalBooks(stats.total_books));
        dispatch(setTotalAuthors(stats.total_authors));
        dispatch(setBooksRead(stats.books_read));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, [dispatch]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    // Dispatch a global state reset action
    dispatch({ type: RESET_STATE });

    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome Back {userName}!</h2>
        <div className="relative">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={toggleDropdown}
          >
            User Menu
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
              {/* Additional dropdown items can be added here */}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-500 text-white p-4 rounded-md">
          <p className="text-lg">Total Books</p>
          <p className="text-3xl font-bold">{totalBooks}</p>
        </div>
        <div className="bg-indigo-500 text-white p-4 rounded-md">
          <p className="text-lg">Total Authors</p>
          <p className="text-3xl font-bold">{totalAuthors}</p>
        </div>
        <div className="bg-indigo-500 text-white p-4 rounded-md">
          <p className="text-lg">Books Read</p>
          <p className="text-3xl font-bold">{booksRead} / {totalBooks}</p>
        </div>
        <div className="bg-indigo-500 text-white p-4 rounded-md">
          <p className="text-lg">Coming Soon</p>
          <p className="text-3xl font-bold">N/A</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
