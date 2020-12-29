const mongoose = require('mongoose');
const slugify = require('slugify');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be that 100 characters '],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be that 500 characters '],
  },
  features: {
    // Array of strings
    type: [String],
    required: true,
    enum: [],
    default: [],
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    default: 1,
  },
});

// create item slug from the name
ItemSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Item', ItemSchema);
