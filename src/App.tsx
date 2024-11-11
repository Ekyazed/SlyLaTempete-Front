import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import BookCollection from './components/BookCollection';
import AddBookPage from './pages/AddBookForm';
import { RootState } from './redux/store';
import EditBook from './pages/EditBookForm';


interface PrivateRouteProps {
  element: JSX.Element;
  isAuthenticated: boolean;
  redirectPath?: string;
}

// Composant PrivateRoute pour protéger les routes nécessitant une authentification
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, isAuthenticated, redirectPath = '/login' }) => {
  return isAuthenticated ? element : <Navigate to={redirectPath} replace />;
};

const AppRouter: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
        />

        {/* Routes privées */}
        <Route
          path="/home"
          element={<PrivateRoute element={<HomePage />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/books"
          element={<PrivateRoute element={<BookCollection />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/add-book"
          element={<PrivateRoute element={<AddBookPage />} isAuthenticated={isAuthenticated} />}
        />

        <Route
          path="/edit-book/:id"
          element={<PrivateRoute element={<EditBook />} isAuthenticated={isAuthenticated} />}
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
