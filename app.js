const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;
const userRoute = require('./routes/user')

const app = express();

// connection
require("./connection/connection");

//middlewares
app.use(cors());
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"))

// routes
app.use('/api', userRoute);

//assign server
app.listen(port, () => {
  console.log(`server is running to the port ${port}`);
});
