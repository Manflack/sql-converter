const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();

// Settings
const PORT = process.env.PORT || 80;


// Middleware
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

// Routes
app.use( "/api/converter",require("./routes/converter"));


// Static files
app.use(express.static(path.join(__dirname, "public")));


// Starting server
app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
});