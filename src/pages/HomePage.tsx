import React from 'react';
import DashboardOverview from '../components/DashboardOverview';
import DynamicSearch from '../components/DynamicSearch';
import BookCollection from '../components/BookCollection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <DashboardOverview />
      <DynamicSearch />
      <BookCollection />
    </div>
  );
};

export default HomePage;