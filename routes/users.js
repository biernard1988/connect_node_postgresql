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
    .query("SELECT * FROM users;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.send(500));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  pool
    .query("SELECT * FROM users WHERE id=$1;", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.send(404));
});

router.post("/", (req, res) => {
  const { first_name, last_name, age, active } = req.body;

  pool
    .query(
      "INSERT INTO users(first_name,last_name,age,active) VALUES ($1,$2,$3,$4) RETURNING*;",
      [first_name, last_name, age, active]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.send(404));
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;

  pool
    .query(
      "UPDATE users SET first_name=$1, last_name=$2, age=$3, active=$4 WHERE id=$5 RETURNING*;",
      [first_name, last_name, age, active, id]
    )
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.send(404));
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  pool
    .query("DELETE FROM users WHERE id=$1;", [id])
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.send(404));
});

module.exports = router;
