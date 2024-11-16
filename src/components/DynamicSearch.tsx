import React, { useEffect, useState, useRef } from 'react';
import './DynamicSearch.css';
import { searchCollection, deleteBook, toggleBookReadStatus } from '../api/books';
import { Book } from '../api/books';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { deleteBookSuccess, toggleBookReadUpdateStatus } from '../redux/slices/bookSlice';
import { setTotalBooks, setBooksRead } from '../redux/slices/statSlice';
import { useNavigate } from 'react-router-dom';
import { getAllAuthors } from '../api/authors';
import { fetchAuthorsFailure, fetchAuthorsStart, fetchAuthorsSuccess } from '../redux/slices/authorSlice';

const DynamicSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { booksRead } = useSelector((state: RootState) => state.stat);
  const { authors: authorState } = useSelector((state: RootState) => state.author);
  const [searchType, setSearchType] = useState('Book');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchType === 'Author') {
      if (authorState.length === 0) {
        const fetchAuthors = async () => {
          try {
            dispatch(fetchAuthorsStart());
            const authorsData = await getAllAuthors();
            dispatch(fetchAuthorsSuccess(authorsData));
          } catch (error: any) {
            dispatch(fetchAuthorsFailure(error.message));
          }
        };
        fetchAuthors();
      }
    }
  }, [searchType]);

  useEffect(() => {
    if (searchType === 'Author') {
      const filtered = authorState.filter((author) =>
        author.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredAuthors(filtered);
      setShowDropdown(filtered.length > 0 && searchInput !== '');
    } else {
      setFilteredAuthors([]);
      setShowDropdown(false);
    }
  }, [searchInput, authorState, searchType]);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchCollection(searchType, searchInput);
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
      dispatch(toggleBookReadUpdateStatus(book.id));
      const updatedCount = book.is_read ? booksRead - 1 : booksRead + 1;
      dispatch(setBooksRead(updatedCount));
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search when pressing Enter
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Search Your Collection</h2>
      <div className="relative mb-4">
        <div className="flex gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="Book">Book</option>
            <option value="Author">Author</option>
            <option value="Genre">Book Type</option>
          </select>
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowDropdown(true)} // Show dropdown on input focus
              onKeyDown={handleKeyDown} // Trigger search on Enter key press
              placeholder={`Search by ${searchType}`}
              className="p-2 border flex-grow rounded-md w-full"
            />
            {showDropdown && searchType === 'Author' && filteredAuthors.length > 0 && (
              <div ref={dropdownRef} className="absolute z-10 top-full mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredAuthors.map((author, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setSearchInput(author.name);
                      setShowDropdown(false); // Hide the dropdown when an author is selected
                    }}
                  >
                    {author.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
              {searchResults.map((book: any) => (
                <tr key={book.id}>
                  <td className="border-b p-2">{book.title}</td>
                  <td className="border-b p-2">
                    {book.authors.map((author: any) => (
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
