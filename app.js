const express = require("express");

/* require("dotenv").config(); */

const users = require("./routes/users.js");
const orders = require("./routes/orders.js");

const app = express();

const port = 8000;

app.use(express.json());
app.use("/users", users);
app.use("/orders", orders);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
