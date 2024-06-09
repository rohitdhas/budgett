const express = require("express");
const { Expense } = require("../models/Expense.schema");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "Hello World!" });
});

router.get("/expenses", async (req, res) => {
  try {
    const { category, subCategory, userId } = req.query;
    const query = { userId };

    if (category && category !== "all") {
      query.category = category;
    }

    if (subCategory && subCategory !== "all") {
      query.subCategory = subCategory;
    }

    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    res.json({ data: expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const createdExpense = await expense.save();
    res.status(201).json({ data: createdExpense });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/stats/monthly", async (req, res) => {
  try {
    const { userId } = req.query;
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const data = expenses.map((item) => ({
      category: item._id,
      total: item.total,
    }));

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
