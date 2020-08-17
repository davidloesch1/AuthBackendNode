const express = require("express");
const passport = require("passport");
const router = express.Router();
const Map = require("../models/Map");
const bcrypt = require("bcryptjs");
const { route } = require(".");

router.post("/", async (req, res) => {
  const x = JSON.parse(JSON.stringify(req.body));
  const map = new Map({
    name: req.body.name,
    geometry: {
      corrdinates: req.body.coordinates,
    },
  });
  await map.save();
  res.send("map added")
});

module.exports = router;
