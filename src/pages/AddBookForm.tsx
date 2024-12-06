import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { addBook } from '../api/books';
import { getAllAuthors } from '../api/authors';
import { fetchAuthorsStart, fetchAuthorsSuccess, fetchAuthorsFailure } from '../redux/slices/authorSlice';
import { useNavigate } from 'react-router-dom';

const AddBookPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authors: authorState } = useSelector((state: RootState) => state.author);
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [continueBook, setContinueBook] = useState<boolean>(false);

  useEffect(() => {
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
  }, [authorState, dispatch]);

  const formik = useFormik({
    initialValues: {
      title: '',
      volume: '',
      genre: '',
      publication_date: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      volume: Yup.string(),
      genre: Yup.string().required('Genre is required'),
      publication_date: Yup.string().required('Publication Date is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const authorsArray = authors.map((name) => ({ id: 0, name }));
        const concatenatedTitle = values.volume ? `${values.title} ${values.volume}` : values.title;
        await addBook({ ...values, title: concatenatedTitle, authors: authorsArray, is_read: false });

        if (!continueBook) {
          resetForm();
          setAuthors([]);
          navigate('/home');
        } else {
          // Keep form values except publication_date
          resetForm({ values: { ...values, volume: '', publication_date: '' } });
        }
      } catch (error) {
        console.error('Failed to add book:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorInput(e.target.value);
    const input = e.target.value.toLowerCase();
    if (input.length > 0) {
      const filteredSuggestions = authorState
        .map((author) => author.name)
        .filter((name) => name.toLowerCase().includes(input));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAuthorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && authorInput.trim() !== '') {
      e.preventDefault();
      setAuthors([...authors, authorInput.trim()]);
      setAuthorInput('');
      setSuggestions([]);
    }
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add a New Book</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="flex items-center">
              <input
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
              <input
                id="volume"
                name="volume"
                type="text"
                placeholder="Vol."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.volume}
                className="mt-1 ml-2 p-3 w-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
            </div>
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
              Authors
            </label>
            <input
              id="authors"
              name="authors"
              type="text"
              value={authorInput}
              onChange={handleAuthorInputChange}
              onKeyDown={handleAuthorKeyDown}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded-md mt-2 bg-white">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setAuthors([...authors, suggestion]);
                      setAuthorInput('');
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap mt-2">
              {authors.map((author, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
                  <span>{author}</span>
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="ml-2 text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <input
              id="genre"
              name="genre"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.genre}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {formik.touched.genre && formik.errors.genre ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.genre}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700">
              Publication Date
            </label>
            <input
              id="publication_date"
              name="publication_date"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.publication_date}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {formik.touched.publication_date && formik.errors.publication_date ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.publication_date}</div>
            ) : null}
          </div>

          <div className="mb-6 flex items-center">
            <input
              id="continueBook"
              name="continueBook"
              type="checkbox"
              checked={continueBook}
              onChange={(e) => setContinueBook(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="continueBook" className="ml-2 block text-sm text-gray-800">
              Continue on this book
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
