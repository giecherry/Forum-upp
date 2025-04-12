require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiDocsRoutes = require("./routes/apiDocs.js");

const app = express();
const port = 3000;
const MONGO_URL =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/";

app.use(cors()); // cors
app.use(express.json()); // parse json bodies in the request

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.warn(
        "Error connecting to MongoDB",
        err
      );
    });
});

app.use("/", apiDocsRoutes);
