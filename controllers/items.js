const ErrorResponse = require('../utils/errorResponse');
const Item = require('../models/Item');
const asyncHandler = require('../middleware/async');

// @desc Get all Items
// @router Get /api/v1/items/
// @access Public
exports.getItems = asyncHandler(async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ['select', 'sort'];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);
  // Create Query String
  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte,$lt,$lte,$in)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // finding resource
  query = Item.find(JSON.parse(queryStr));
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sort Fields
  if (req.query.select) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  // Executing query
  const items = await query;
  res.status(200).json({
    success: true,
    count: items.length,
    body: items,
  });
});

// @desc Get  Item
// @router Get /api/v1/items/:id
// @access Public
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    body: item,
  });
});

// @desc Create new  item
// @router POST /api/v1/items/
// @access Public
exports.createItem = asyncHandler(async (req, res, next) => {
  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    body: item,
  });
});

// @desc Update Item
// @router PUT /api/v1/item/:id
// @access Public
exports.updateItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    body: item,
  });
});

// @desc Delete item
// @router DELETE /api/v1/items/:id
// @access Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    body: {},
  });
});
