const express = require("express");
const router = express.Router();
require("dotenv").config();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

router.get("/", (req, res) => {
  pool
    .query("SELECT * FROM orders;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.send(500));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  pool
    .query("SELECT * FROM orders WHERE id=$1;", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.send(404));
});

router.post("/", (req, res) => {
  const { price, date, user_id } = req.body;

  pool
    .query(
      "INSERT INTO orders(price,date,user_id) VALUES ($1,$2,$3) RETURNING*;",
      [price, date, user_id]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.send(404));
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { price, date, user_id } = req.body;

  pool
    .query(
      "UPDATE orders SET price=$1, date=$2, user_id=$3 WHERE id=$4 RETURNING*;",
      [price, date, user_id, id]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.send(404));
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  pool
    .query("DELETE FROM orders WHERE id=$1;", [id])
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.send(404));
});

module.exports = router;
