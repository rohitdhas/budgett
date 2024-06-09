require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api", expenseRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log(`Server is running on port ${PORT} ✅`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
