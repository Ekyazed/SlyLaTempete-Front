import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, deleteBookSuccess } from '../redux/slices/bookSlice';
import { getLast10Books, deleteBook, toggleBookReadStatus, getBookByID } from '../api/books';
import { setBooksRead, setTotalBooks } from '../redux/slices/statSlice';
import { Book } from '../api/books';
import { useNavigate } from 'react-router-dom';

const BookCollection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { books, loading, error } = useSelector((state: RootState) => state.book);
  const {booksRead, totalBooks} = useSelector((state: RootState) => state.stat);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        dispatch(fetchBooksStart());
        const booksData: Book[] = await getLast10Books();
        dispatch(fetchBooksSuccess(booksData));
      } catch (error: any) {
        dispatch(fetchBooksFailure(error.message));
      }
    };
    fetchBooks();
  }, [dispatch]);

  const handleDelete = async (bookId: number) => {
    try {
      const deletingBook = await getBookByID(bookId)
      dispatch(setBooksRead(booksRead + (deletingBook.is_read ? -1 : 0)))
      dispatch(setTotalBooks(totalBooks -1))
      await deleteBook(bookId);
      dispatch(deleteBookSuccess(bookId));
    } catch (error: any) {
      dispatch(fetchBooksFailure(error.message));
    }
  };

  const handleReadStatusChange = async (book: Book) => {
    try {
      const updatedBook = { ...book, is_read: !book.is_read };
      await toggleBookReadStatus(book.id);
      dispatch(fetchBooksSuccess(books.map((b) => (b.id === book.id ? updatedBook : b))));
      dispatch(setBooksRead(booksRead + (updatedBook.is_read ? 1 : -1)));
    } catch (error: any) {
      dispatch(fetchBooksFailure(error.message));
    }
  };

  const handleEdit = (bookId: number) => {
    if (bookId) {
      navigate(`/edit-book/${bookId}`);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 relative">
      <h2 className="text-2xl font-bold mb-4 inline-block">Your Book Collection</h2>
      <button
        onClick={() => navigate('/add-book')}
        className="absolute top-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
      >
        Add Book
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : books.length > 0 ? (
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
            {books.map((book: Book) => (
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
                    onClick={() => handleReadStatusChange(book)}
                    className={`mr-2 px-2 py-1 rounded-md ${book.is_read ? 'bg-green-600' : 'bg-gray-600'} text-white hover:bg-opacity-80`}
                  >
                    {book.is_read ? 'Readed' : 'Mark as Read'}
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
        <div className="text-center p-4">
          <p>No books available.</p>
        </div>
      )}
      <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
        Show More
      </button>
    </div>
  );
};

export default BookCollection;