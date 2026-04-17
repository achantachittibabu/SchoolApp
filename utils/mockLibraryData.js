// Mock Library Books Data
export const mockBooksData = [
  {
    id: '1',
    bookNumber: 'BK001',
    bookName: 'Physics Vol 1',
    subject: 'Science',
    available: true,
    author: 'John Smith',
    isbn: '978-0-12345-001-0',
    publisher: 'Academic Press',
    year: 2022,
  },
  {
    id: '2',
    bookNumber: 'BK002',
    bookName: 'Chemistry Basics',
    subject: 'Science',
    available: false,
    author: 'Jane Doe',
    isbn: '978-0-12345-002-7',
    publisher: 'Science Publishers',
    year: 2021,
    borrowedBy: 'Raj Kumar',
    dueDate: '2026-04-24',
  },
  {
    id: '3',
    bookNumber: 'BK003',
    bookName: 'English Literature',
    subject: 'Language',
    available: true,
    author: 'Robert Brown',
    isbn: '978-0-12345-003-4',
    publisher: 'Literary Press',
    year: 2023,
  },
  {
    id: '4',
    bookNumber: 'BK004',
    bookName: 'Mathematics Advanced',
    subject: 'Mathematics',
    available: true,
    author: 'Emily Wilson',
    isbn: '978-0-12345-004-1',
    publisher: 'Math Academy',
    year: 2022,
  },
  {
    id: '5',
    bookNumber: 'BK005',
    bookName: 'History of World',
    subject: 'Social Studies',
    available: false,
    author: 'Michael Johnson',
    isbn: '978-0-12345-005-8',
    publisher: 'History Press',
    year: 2020,
    borrowedBy: 'Priya Singh',
    dueDate: '2026-04-22',
  },
  {
    id: '6',
    bookNumber: 'BK006',
    bookName: 'Biology Guide',
    subject: 'Science',
    available: true,
    author: 'Sarah Davis',
    isbn: '978-0-12345-006-5',
    publisher: 'Biology World',
    year: 2023,
  },
  {
    id: '7',
    bookNumber: 'BK007',
    bookName: 'Computer Science',
    subject: 'Technology',
    available: false,
    author: 'David Lee',
    isbn: '978-0-12345-007-2',
    publisher: 'Tech Publishers',
    year: 2024,
    borrowedBy: 'Aman Patel',
    dueDate: '2026-04-20',
  },
  {
    id: '8',
    bookNumber: 'BK008',
    bookName: 'Art & Design',
    subject: 'Arts',
    available: true,
    author: 'Lisa Anderson',
    isbn: '978-0-12345-008-9',
    publisher: 'Art House',
    year: 2023,
  },
  {
    id: '9',
    bookNumber: 'BK009',
    bookName: 'Modern Geography',
    subject: 'Social Studies',
    available: true,
    author: 'Christopher Taylor',
    isbn: '978-0-12345-009-6',
    publisher: 'Global Publications',
    year: 2022,
  },
  {
    id: '10',
    bookNumber: 'BK010',
    bookName: 'Environmental Science',
    subject: 'Science',
    available: false,
    author: 'Jennifer White',
    isbn: '978-0-12345-010-2',
    publisher: 'Nature Press',
    year: 2023,
    borrowedBy: 'Neha Sharma',
    dueDate: '2026-04-25',
  },
  {
    id: '11',
    bookNumber: 'BK011',
    bookName: 'World Classics Vol 1',
    subject: 'Literature',
    available: true,
    author: 'Multiple Authors',
    isbn: '978-0-12345-011-9',
    publisher: 'Classics Library',
    year: 2021,
  },
  {
    id: '12',
    bookNumber: 'BK012',
    bookName: 'Statistics & Probability',
    subject: 'Mathematics',
    available: true,
    author: 'Thomas Martin',
    isbn: '978-0-12345-012-6',
    publisher: 'Math Academy',
    year: 2023,
  },
  {
    id: '13',
    bookNumber: 'BK013',
    bookName: 'Organic Chemistry',
    subject: 'Science',
    available: false,
    author: 'Linda Harris',
    isbn: '978-0-12345-013-3',
    publisher: 'Chemistry Press',
    year: 2022,
    borrowedBy: 'Arjun Verma',
    dueDate: '2026-04-23',
  },
  {
    id: '14',
    bookNumber: 'BK014',
    bookName: 'Ancient Civilizations',
    subject: 'History',
    available: true,
    author: 'Richard Thompson',
    isbn: '978-0-12345-014-0',
    publisher: 'History Press',
    year: 2020,
  },
  {
    id: '15',
    bookNumber: 'BK015',
    bookName: 'Web Development Guide',
    subject: 'Technology',
    available: true,
    author: 'Alex Robinson',
    isbn: '978-0-12345-015-7',
    publisher: 'Tech Publishers',
    year: 2024,
  },
];

export const mockBookRequests = [
  {
    id: '1',
    bookNumber: 'BK001',
    bookName: 'Physics Vol 1',
    studentName: 'Vikram Singh',
    studentId: 'STU001',
    requestDate: '2026-04-16',
    requestedReturnDate: '2026-04-23',
    status: 'pending',
  },
  {
    id: '2',
    bookNumber: 'BK003',
    bookName: 'English Literature',
    studentName: 'Anjali Verma',
    studentId: 'STU002',
    requestDate: '2026-04-15',
    requestedReturnDate: '2026-04-22',
    status: 'approved',
  },
  {
    id: '3',
    bookNumber: 'BK001',
    bookName: 'Physics Vol 1',
    studentName: 'Rohan Chopra',
    studentId: 'STU003',
    requestDate: '2026-04-14',
    requestedReturnDate: '2026-04-21',
    status: 'approved',
  },
  {
    id: '4',
    bookNumber: 'BK006',
    bookName: 'Biology Guide',
    studentName: 'Pooja Desai',
    studentId: 'STU004',
    requestDate: '2026-04-13',
    requestedReturnDate: '2026-04-20',
    status: 'rejected',
    rejectionReason: 'Book reserved for another student',
  },
  {
    id: '5',
    bookNumber: 'BK001',
    bookName: 'Physics Vol 1',
    studentName: 'Priya Sharma',
    studentId: 'STU005',
    requestDate: '2026-04-12',
    requestedReturnDate: '2026-04-19',
    status: 'rejected',
    rejectionReason: 'Student has exceeded maximum book limit',
  },
  {
    id: '6',
    bookNumber: 'BK003',
    bookName: 'English Literature',
    studentName: 'Aman Patel',
    studentId: 'STU006',
    requestDate: '2026-04-11',
    requestedReturnDate: '2026-04-18',
    status: 'pending',
  },
];

// Mock My Book Requests (Student's submitted requests)
export const mockMyBookRequests = [
  {
    id: '1',
    bookNumber: 'BK012',
    bookName: 'Statistics & Probability',
    author: 'Thomas Martin',
    subject: 'Mathematics',
    requestDate: '2026-04-15',
    requestedReturnDate: '2026-04-22',
    status: 'pending', // pending, approved, rejected, withdrawn
    submittedComments: 'Need this book for my math assignment',
  },
  {
    id: '2',
    bookNumber: 'BK008',
    bookName: 'Art & Design',
    author: 'Lisa Anderson',
    subject: 'Arts',
    requestDate: '2026-04-10',
    requestedReturnDate: '2026-04-17',
    status: 'approved',
    submittedComments: 'For my art project',
  },
  {
    id: '3',
    bookNumber: 'BK014',
    bookName: 'Ancient Civilizations',
    author: 'Richard Thompson',
    subject: 'History',
    requestDate: '2026-04-12',
    requestedReturnDate: '2026-04-19',
    status: 'pending',
    submittedComments: 'Required for history class',
  },
];

// Function to get books by subject
export const getBooksBySubject = (subject) => {
  return mockBooksData.filter((book) => book.subject === subject);
};

// Function to get available books
export const getAvailableBooks = () => {
  return mockBooksData.filter((book) => book.available === true);
};

// Function to get unavailable books
export const getUnavailableBooks = () => {
  return mockBooksData.filter((book) => book.available === false);
};

// Function to get all unique subjects
export const getAllSubjects = () => {
  const subjects = [...new Set(mockBooksData.map((book) => book.subject))];
  return subjects.sort();
};

// Function to search books by name
export const searchBooks = (query) => {
  return mockBooksData.filter(
    (book) =>
      book.bookName.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.bookNumber.toLowerCase().includes(query.toLowerCase())
  );
};
