require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiDocsRoutes = require("./routes/apiDocs.js");
const authRoutes = require("./routes/auth.js");
const threadsRoutes = require("./routes/threads.js");
const commentsRoutes = require("./routes/comments.js");
const usersRoutes = require("./routes/users.js");
const authMiddleware = require("./middlewares/authMiddleware.js");

const app = express();
const port = 3000;
const MONGO_URL =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/";

app.use(cors()); 
app.use(express.json()); 

app.use("/api", apiDocsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/threads", authMiddleware, threadsRoutes);
app.use("/api/comments", authMiddleware, commentsRoutes);
app.use("/api/users", authMiddleware, usersRoutes);

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
