require("dotenv").config();
const express = require("express");
const cors = require("cors");
const textRoutes = require("./src/routes/textRoutes");

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use("/api/text", textRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
