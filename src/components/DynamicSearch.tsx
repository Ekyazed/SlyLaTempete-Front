import React, { useState } from 'react';
import './DynamicSearch.css';
import { searchCollection, deleteBook, toggleBookReadStatus } from '../api/books';
import { Book } from '../api/books';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { deleteBookSuccess, toggleBookReadUpdateStatus } from '../redux/slices/bookSlice';
import { setTotalBooks, setBooksRead } from '../redux/slices/statSlice';
import { useNavigate } from 'react-router-dom';

const DynamicSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { booksRead } = useSelector((state: RootState) => state.stat);
  const [searchType, setSearchType] = useState('Book');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]); // Ensure searchResults is always an array
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchCollection(searchType, searchInput);
      // Ensure results is an array
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error(`Failed to search for ${searchType}:`, error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookId: number) => {
    try {
      await deleteBook(bookId);
      dispatch(deleteBookSuccess(bookId));
      dispatch(setTotalBooks(searchResults.length - 1));
      const bookToDelete = searchResults.find(book => book.id === bookId);
      if (bookToDelete?.is_read) {
        dispatch(setBooksRead(booksRead - 1));
      }
      setSearchResults(searchResults.filter(book => book.id !== bookId));
    } catch (error: any) {
      console.error('Failed to delete book:', error);
    }
  };

  const handleMarkAsRead = async (book: Book) => {
    try {
      await toggleBookReadStatus(book.id);
      if (book.is_read) {
        dispatch(toggleBookReadUpdateStatus(book.id));
        dispatch(setBooksRead(booksRead - 1));
      } else {
        dispatch(toggleBookReadUpdateStatus(book.id));
        dispatch(setBooksRead(booksRead + 1));
      }
      setSearchResults(searchResults.map(b => b.id === book.id ? { ...b, is_read: !b.is_read } : b));
    } catch (error: any) {
      console.error('Failed to update book status:', error);
    }
  };

  const handleClear = () => {
    setSearchResults([]);
    setSearchInput('');
  };
  
  const handleEdit = (bookId: number) => {
    if (bookId) {
      navigate(`/edit-book/${bookId}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Search Your Collection</h2>
      <div className="flex gap-4 mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="Book">Book</option>
          <option value="Author">Author</option>
          <option value="Genre">Book Type</option>
        </select>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={`Search by ${searchType}`}
          className="p-2 border flex-grow rounded-md"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}`}
        >
          {isLoading ? (
            <div className="loading-dots flex items-center">
              <div className="dot bg-white w-2.5 h-2.5 rounded-full mr-1 animate-bounce"></div>
              <div className="dot bg-white w-2.5 h-2.5 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="dot bg-white w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            'Search'
          )}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
        >
          Clear
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        {searchResults.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Title</th>
                <th className="border-b p-2">Authors</th>
                <th className="border-b p-2">Genre</th>
                <th className="border-b p-2">Publication Date</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((book: Book) => (
                <tr key={book.id}>
                  <td className="border-b p-2">{book.title}</td>
                  <td className="border-b p-2">
                    {book.authors.map((author) => (
                      <div key={author.id}>{author.name}</div>
                    ))}
                  </td>
                  <td className="border-b p-2">{book.genre}</td>
                  <td className="border-b p-2">{book.publication_date}</td>
                  <td className="border-b p-2">
                    <button
                      onClick={() => handleMarkAsRead(book)}
                      className={`mr-2 px-2 py-1 rounded-md ${book.is_read ? 'bg-green-600' : 'bg-gray-600'} text-white hover:bg-opacity-80`}
                    >
                      {book.is_read ? 'Read' : 'Mark as Read'}
                    </button>
                    <button
                    onClick={() => handleEdit(book.id)}
                    className="mr-2 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-500"
                  >
                    Edit
                  </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
  
};

export default DynamicSearch;