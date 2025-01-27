import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { getStats } from '../api/books';
import { setBooksRead, setTotalAuthors, setTotalBooks } from '../redux/slices/statSlice';

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.user.name);
  const totalBooks = useSelector((state: RootState) => state.stat.totalBooks);
  const totalAuthors = useSelector((state: RootState) => state.stat.totalAuthors);
  const booksRead = useSelector((state: RootState) => state.stat.booksRead);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome Back {userName}!</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default DashboardOverview;
