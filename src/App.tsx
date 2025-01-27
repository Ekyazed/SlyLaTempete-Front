import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import BookCollection from './components/BookCollection';
import AddBookPage from './pages/AddBookForm';
import EditBook from './pages/EditBookForm';
import { RootState } from './redux/store';
import InsightsPage from './pages/Insight';

interface PrivateRouteProps {
  element: JSX.Element;
  redirectPath?: string;
}

// PrivateRoute component for protecting routes
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, redirectPath = '/login' }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);

  // Redirect to login if the user is not authenticated
  return isAuthenticated ? element : <Navigate to={redirectPath} replace />;
};

const AppRouter: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);

  // Handle browser close or tab close event
  useEffect(() => {
    const handleUnload = () => {
      
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
        />

        {/* Private Routes */}
        <Route
          path="/home"
          element={<PrivateRoute element={<HomePage />} />}
        />
        <Route
          path="/books"
          element={<PrivateRoute element={<BookCollection />} />}
        />
        <Route
          path="/add-book"
          element={<PrivateRoute element={<AddBookPage />} />}
        />
        <Route
          path="/edit-book/:id"
          element={<PrivateRoute element={<EditBook />} />}
        />

        <Route
          path="/insight"
          element={<PrivateRoute element={<InsightsPage />} />}
          />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
