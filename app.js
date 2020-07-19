const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

// Register the middleware that helps extraxt req data
//app.use(bodyParser.urlencoded({ extended: false })); //Only used for data sent through <form></form>. It uses
app.use(bodyParser.json()); // aplication/json

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// Register middleware to extract file from request body
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Register middleware to serve images folder statically
app.use("/images", express.static(path.join(__dirname, "images")));

// Register middleware that setHeaders to avoid Cross-Origin Resource Sharing(CORS) errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Register Routes Middlewares
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// Register middle for general error handling
app.use((error, req, res, next) => {
  console.log(error);
  status = error.statusCode || 500;
  message = error.message; // Error thrown. But must be accessed with 'message' is a built functionality
  data = error.data; //
  res.status(status).json({ message: message, data: data });
});

//Connect to database
mongoose
  .connect(
    "mongodb+srv://deprof37:Oluwatobiloba080!@£$@cluster0-4kzlk.mongodb.net/blog?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    //Register middleware to listen on defined port
    const server = app.listen(1991);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
