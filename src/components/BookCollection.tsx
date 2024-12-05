import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  deleteBookSuccess,
  setPagination,
} from '../redux/slices/bookSlice';
import {
  getPaginatedBooks,
  deleteBook,
  toggleBookReadStatus,
  getBookByID,
} from '../api/books';
import { setBooksRead, setTotalBooks } from '../redux/slices/statSlice';
import { Book } from '../api/books';
import { useNavigate } from 'react-router-dom';

const BookCollection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { books, loading, error, page, pageSize, totalPages } = useSelector(
    (state: RootState) => state.book
  );
  const { booksRead, totalBooks } = useSelector((state: RootState) => state.stat);

  // Fetch books on component mount or when page or pageSize changes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        dispatch(fetchBooksStart());
        const response = await getPaginatedBooks(page, pageSize);
        dispatch(
          fetchBooksSuccess({
            books: response.books,
            total: response.pagination.total,
            page: response.pagination.page,
            pageSize: response.pagination.page_size,
            totalPages: response.pagination.total_pages,
          })
        );
      } catch (error: any) {
        dispatch(fetchBooksFailure(error.message));
      }
    };
    fetchBooks();
  }, [dispatch, page, pageSize]);

  // Handle book deletion
  const handleDelete = async (bookId: number) => {
    try {
      const deletingBook = await getBookByID(bookId);
      dispatch(setBooksRead(booksRead + (deletingBook.is_read ? -1 : 0)));
      dispatch(setTotalBooks(totalBooks - 1));
      await deleteBook(bookId);
      dispatch(deleteBookSuccess(bookId));
    } catch (error: any) {
      dispatch(fetchBooksFailure(error.message));
    }
  };

  // Handle toggling read status
  const handleReadStatusChange = async (book: Book) => {
    try {
      const updatedBook = { ...book, is_read: !book.is_read };
      await toggleBookReadStatus(book.id);
      dispatch(
        fetchBooksSuccess({
          books: books.map((b) => (b.id === book.id ? updatedBook : b)),
          total: totalBooks,
          page,
          pageSize,
          totalPages,
        })
      );
      dispatch(setBooksRead(booksRead + (updatedBook.is_read ? 1 : -1)));
    } catch (error: any) {
      dispatch(fetchBooksFailure(error.message));
    }
  };

  // Navigate to edit page
  const handleEdit = (bookId: number) => {
    if (bookId) {
      navigate(`/edit-book/${bookId}`);
    }
  };

  // Handle pagination
  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setPagination({ page: newPage, pageSize }));
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPagination({ page: 1, pageSize: newPageSize })); // Reset to the first page
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
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="pageSize" className="mr-2">Items per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : books.length > 0 ? (
        <>
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
                      className={`mr-2 px-2 py-1 rounded-md ${
                        book.is_read ? 'bg-green-600' : 'bg-gray-600'
                      } text-white hover:bg-opacity-80`}
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
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <p>No books available.</p>
        </div>
      )}
    </div>
  );
};

export default BookCollection;
