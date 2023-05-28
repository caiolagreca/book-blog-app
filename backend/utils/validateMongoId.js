const mongoose = require("mongoose");

const validateMongoId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("ID is not valid our found");
};

module.exports = validateMongoId;
