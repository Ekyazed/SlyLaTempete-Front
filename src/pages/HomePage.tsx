import React from 'react';
import DashboardOverview from '../components/DashboardOverview';
import DynamicSearch from '../components/DynamicSearch';
import BookCollection from '../components/BookCollection';
import Navbar from '../components/navbar';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <Navbar />
      <DashboardOverview />
      <DynamicSearch />
      <BookCollection />
    </div>
  );
};

export default HomePage;