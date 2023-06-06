const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const data = request.payload;

  const id = nanoid(8);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  let finished = false;

  if (data.pageCount == data.readPage) {
    finished = true;
  }

  const newBook = {
    id,
    ...data,
    finished,
    createdAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    if (!data.name) {
      console.log("masuk");
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    } else if (data.readPage > data.pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      Bookid: id,
    },
  });

  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const response = h.response({
    status: "success",
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });

  response.code(201);
  return response;
};

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const theBook = books.filter((book) => book.id === id)[0];

  if (theBook !== undefined) {
    return {
      status: "success",
      data: {
        theBook,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const body = request.payload;
  const updatedAt = new Date().toISOString;

  const index = books.findIndex((book) => book.id === id);

  const fail = (message) => {
    const response = h.response({
      status: "fail",
      message: message,
    });
    response.code(400);
    return response;
  };

  if (index !== -1) {
    if (body.name) {
      fail("Gagal memperbarui buku. Mohon isi nama buku");
    } else if (body.readPage > body.pageCount) {
      fail(
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      );
    }

    books[index] = {
      ...books[index],
      ...body,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
};
