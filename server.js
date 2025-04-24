require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiDocsRoutes = require("./routes/apiDocs.js");
const authRoutes = require("./routes/auth.js");
const threadsRoutes = require("./routes/threads.js");
const commentsRoutes = require("./routes/comments.js");
const { router: usersRoutes } = require("./routes/users.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const app = express();
const port = 3000;
const MONGODB_URL =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/";

app.use(cors()); 
app.use(express.json()); 

app.use("/api", apiDocsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/threads", threadsRoutes);
app.use("/api/comments", authMiddleware, commentsRoutes);
app.use("/api/users", authMiddleware, usersRoutes);

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 45000,         
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

