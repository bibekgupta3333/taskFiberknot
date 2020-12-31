const Item = require('./models/Item');

const Query = {
  item: (root, { id }) => Item.findById(id),
  items: async () => await Item.find(),
};

const Mutation = {
  createItem: async (root, { input }) => {
    return await Item.create({ ...input });
  },
  updateItem: async (root, { id, input }) => {
    return await Item.findByIdAndUpdate(
      id,
      { ...input },
      {
        new: true,
        runValidators: true,
      }
    );
  },
  deleteItem: async (root, { id }) => Item.findByIdAndRemove(id),
};
module.exports = { Query, Mutation };
