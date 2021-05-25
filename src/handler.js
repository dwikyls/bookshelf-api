const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year = null,
        author = null, 
        summary = null, 
        publisher = null, 
        pageCount, 
        readPage, 
        reading = null,
    } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);

        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);

        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    const newBook = {
        id, 
        name,
        year,
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        finished,
        reading,
        insertedAt, 
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);

        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });

    response.code(500);

    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name = null, reading = null, finished = null } = request.query;

    let booksCopy = [...books];

    if (name !== null) {
        booksCopy = booksCopy.filter((book) => book.name.toLowerCase() === name.toLowerCase());
    }

    if (finished !== null) {
        booksCopy = booksCopy.filter((book) => book.finished === !!+finished);
    }

    if (reading !== null) {
        booksCopy = booksCopy.filter((book) => book.reading === !!+reading);
    }

    const newBooks = booksCopy.map(function (book) {
        return {
            id: book.id, 
            name: book.name, 
            publisher: book.publisher,
        };
    });

    const response = h.response({
        status: 'success',
        data: {
            books: newBooks,
        },
    });

    response.code(200);
    
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book: {
                    ...book,
                },
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);

    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
 
  const {
    name,
    year = null,
    author = null, 
    summary = null, 
    publisher = null, 
    pageCount, 
    readPage, 
    reading = null,
  } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });

        response.code(400);

        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);

        return response;
    }
  
  const updatedAt = new Date().toISOString();
 
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
    books[index].name = name;
    books[index].year = year;
    books[index].author = author;
    books[index].summary = summary;
    books[index].publisher = publisher;
    books[index].pageCount = pageCount;
    books[index].readPage = readPage;
    books[index].reading = reading;
    books[index].updatedAt = updatedAt;

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const index = books.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });

        response.code(200);
        
        return response;
    }
   
   const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);

    return response;
};
   
module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
