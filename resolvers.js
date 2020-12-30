const Item = require('./models/Item');

const Query = {
  item: (root, { id }) => Item.findById(id),
  items: async () => await Item.find(),
};

module.exports = { Query };
