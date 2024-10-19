'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Title is required' },
        notEmpty: { msg: 'Title cannot be empty' }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Author is required' },
        notEmpty: { msg: 'Author cannot be empty' }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  });
  return Book;
};
