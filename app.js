const express = require('express');
const path = require('path');
const { Book } = require('./models');
const { sequelize } = require('./models');

// Initialize the Express app
const app = express();

// Set up Pug as the view engine
app.set('view engine', 'pug');

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Sync and connect to the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Home Route
app.get('/', (req, res) => {
  res.redirect('/books');
});

// Books Route - List of books
app.get('/books', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('index', { books });
  } catch (error) {
    next(error);
  }
});

// New Book Route - Show create new book form
app.get('/books/new', (req, res) => {
  res.render('new-book');
});

// Create Book Route - Add new book to the database
app.post('/books/new', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.render('new-book', { errors: error.errors });
    } else {
      next(error);
    }
  }
});

// Book Detail Route - Show book detail form for updating
app.get('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { book });
    } else {
      const error = new Error('Book not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

// Update Book Route - Update book in the database
app.post('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      const error = new Error('Book not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.render('update-book', { book, errors: error.errors });
    } else {
      next(error);
    }
  }
});

// Delete Book Route - Delete a book from the database
app.post('/books/:id/delete', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      const error = new Error('Book not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

// 404 Error Handler (Page Not Found)
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  res.status(404).render('page-not-found', { error });
});

// Global Error Handler (500 Server Error)
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Server Error';
  console.error(err.status, err.message);
  res.status(err.status).render('error', { err });
});

// Start the server
app.listen(3001, () => {
  console.log('The server is running on http://localhost:3001');
});
