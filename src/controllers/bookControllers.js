import { Book } from "../models/BookModel.js";

const getBooks = async (req, res, next) => {
  try {
    const userLogged = req.userLogged;
    const { page = 1, limit = 10, sort = "asc", filter } = req.validatedQuery;
    const query = { userId: userLogged.id };
    if (filter) {
      const [field, value] = filter.split(":");
      query[field] = value;
    }
    const sortOrder = sort === "desc" ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);
    const filterBooks = await Book.find(query, { userId: 0 })
      .sort({ title: sortOrder })
      .skip(skip)
      .limit(Number(limit));
    res.json({
      success: true,
      data: filterBooks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: await Book.countDocuments(query),
      },
      message: "Books fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundBook = await Book.findOne(
      { _id: id, userId: req.userLogged.id },
      { userId: 0 },
    );
    if (!foundBook) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, data: foundBook });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const body = req.body;
    const userLogged = req.userLogged;
    const newBook = await Book.create({
      title: body.title,
      price: body.price,
      genre: body.genre,
      pages: body.pages,
      read: body.read ?? false,
      userId: userLogged.id,
    });
    const { userId, ...publicDataBook } = newBook.toObject();
    res.json({
      success: true,
      data: publicDataBook,
      message: "Book created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, userId: req.userLogged.id },
      body,
      { new: true, projection: { userId: 0 } },
    );
    if (!updatedBook) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({
      success: true,
      data: updatedBook,
      message: "Book updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findOneAndDelete({
      _id: id,
      userId: req.userLogged.id,
    });
    if (!deletedBook) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    const { userId, ...publicDataBook } = deletedBook.toObject();
    res.json({
      success: true,
      data: publicDataBook,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "asc", filter } = req.validatedQuery;
    const query = {};
    if (filter) {
      const [field, value] = filter.split(":");
      query[field] = value;
    }
    const sortOrder = sort === "desc" ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);
    const filterBooks = await Book.find(query, { userId: 0 })
      .sort({ title: sortOrder })
      .skip(skip)
      .limit(Number(limit));
    res.json({
      success: true,
      data: filterBooks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: await Book.countDocuments(query),
      },
      message: "All books fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

const adminDeleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    const { userId, ...publicDataBook } = deletedBook.toObject();
    res.json({
      success: true,
      data: publicDataBook,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  adminDeleteBook,
};
