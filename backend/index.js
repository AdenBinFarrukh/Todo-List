// Import required modules
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const listRoute = require("./routes/list");

// Initialize the express app
const app = express();

// Connect to MongoDB
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
    // () => {
    //     console.log("Connected to MongoDB");
    // }
);
console.log("Connected to MongoDB");

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/list", listRoute);

// Set the server to listen on a specific port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
