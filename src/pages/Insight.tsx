import React, { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";
import { getPaginatedBooks } from "../api/books";
import "./insight.css";
import Navbar from "../components/navbar";

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale);

type Book = {
  id: number;
  title: string;
  authors: { id: number; name: string }[];
  genre: string;
  publication_date: string;
  is_read: boolean;
  type: string;
};

const InsightsPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await getPaginatedBooks(1, 99999999);
        setBooks(response.books);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Failed to fetch books");
      }
    };
    fetchBooks();
  }, []);

  const uniqueAuthors = Array.from(
    new Map(
      books.flatMap((book) => book.authors).map((author) => [author.id, author])
    ).values()
  );

  const filteredBooks = selectedAuthor
    ? books.filter((book) => book.authors.some((author) => author.id === selectedAuthor))
    : books;

  const sortedBooks = filteredBooks.sort((a, b) => {
    const dateA = new Date(a.publication_date.includes("/") ? a.publication_date : `${a.publication_date}/01/01`);
    const dateB = new Date(b.publication_date.includes("/") ? b.publication_date : `${b.publication_date}/01/01`);
    return dateA.getTime() - dateB.getTime();
  });

  const earliestDate = sortedBooks.reduce((min, book) => {
    const date = new Date(book.publication_date.includes("/") ? book.publication_date : `${book.publication_date}/01/01`);
    return date < min ? date : min;
  }, new Date());

  const lineChartData = {
    labels: sortedBooks.map((book) => {
      return new Date(
        book.publication_date.includes("/") ? book.publication_date : `${book.publication_date}/01/01`
      );
    }),
    datasets: [
      {
        label: "Books Over Time",
        data: sortedBooks.map((book, index) => ({
          x: new Date(
            book.publication_date.includes("/") ? book.publication_date : `${book.publication_date}/01/01`
          ),
          y: index + 1,
        })),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "year",
        },
        title: {
          display: true,
          text: "Publication Date",
        },
        min: earliestDate,
      },
      y: {
        title: {
          display: true,
          text: "Books",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const booksPerAuthor = uniqueAuthors.map((author) =>
    books.filter((book) => book.authors.some((a) => a.id === author.id)).length
  );

  const doughnutChartData = {
    labels: uniqueAuthors.map((author) => author.name),
    datasets: [
      {
        data: booksPerAuthor,
        backgroundColor: uniqueAuthors.map((author) =>
          selectedAuthor && selectedAuthor !== author.id ? "#D3D3D3" : ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"][author.id % 4]
        ),
        hoverBackgroundColor: uniqueAuthors.map((author) =>
          selectedAuthor && selectedAuthor !== author.id ? "#D3D3D3" : ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"][author.id % 4]
        ),
        cutout: "80%",
      },
    ],
  };

  const doughnutChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="book-loader-container">
        <div className="book-loader"></div>
        <div className="loader-text">Loading... Please wait.</div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6 space-y-6">
      <Navbar />
      <div className="section">
        <div className="grid grid-cols-3 gap-4">
          <div className="table">
            <h2 className="text-xl font-bold mb-4">Authors</h2>
            <div className="overflow-y-auto" style={{ maxHeight: "300px", minHeight: "300px" }}>
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-4 py-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueAuthors.map((author) => (
                    <tr key={author.id}>
                      <td
                        className={`border border-gray-200 px-4 py-2 cursor-pointer ${
                          selectedAuthor === author.id ? "bg-blue-100" : ""
                        }`}
                        onClick={() =>
                          setSelectedAuthor((prev) => (prev === author.id ? null : author.id))
                        }
                      >
                        {author.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table col-span-2">
            <h2 className="text-xl font-bold mb-4">Books</h2>
            <div className="overflow-y-auto" style={{ maxHeight: "300px", minHeight: "300px" }}>
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 w-3/5">Title</th>
                    <th className="border border-gray-200 px-4 py-2 w-2/5">Publication Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="border border-gray-200 px-4 py-2 w-3/5">{book.title}</td>
                      <td className="border border-gray-200 px-4 py-2 w-2/5">{book.publication_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="graph-section">
        <div className="graph-container">
          <h2 className="text-xl font-bold mb-4 text-center">Books by Author</h2>
          <div style={{ width: "300px", height: "300px" }} className="mx-auto">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>

        <div className="graph-container">
          <h2 className="text-xl font-bold mb-4 text-center">Author's Regularity Over Time</h2>
          <div style={{ width: "600px", height: "400px" }} className="mx-auto">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
