const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();

// Settings
const PORT = process.env.PORT || 80;


// Middleware
app.use(morgan("dev"));
app.use(express.json());


// Routes
app.use( "/api/converter",require("./routes/converter"));


// Static files
app.use(express.static(path.join(__dirname, "public")));


// Starting server
app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
});