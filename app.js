const express = require("express");
const textRoutes = require("./src/routes/textRoutes");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());


app.use("/api/text", textRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
