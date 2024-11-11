import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <nav className="navbar bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">MyApp</Link>
          <div className="space-x-4">
            <Link to="/" className="text-white hover:text-gray-200 transition duration-300">Home</Link>
            <Link to="/register" className="text-white hover:text-gray-200 transition duration-300">Register</Link>
            <Link to="/login" className="text-white hover:text-gray-200 transition duration-300">Login</Link>
          </div>
        </div>
      </nav>
        {children}
      <footer className="footer bg-gray-800 p-4">
        <div className="container mx-auto text-center text-white">
          <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
          <div className="space-x-4 mt-2">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;