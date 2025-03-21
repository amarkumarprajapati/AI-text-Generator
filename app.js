const express = require("express");
const mongoose = require("mongoose");
const textRoutes = require("./src/routes/textRoutes");

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect("mongodb+srv://amardatabase:amardatabase@cluster0.gjuunff.mongodb.net/AIChat")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use("/api/text", textRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
