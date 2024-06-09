const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    spentOn: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: "throw" }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = { Expense };
