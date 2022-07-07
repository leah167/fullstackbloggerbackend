const express = require("express");
const router = express.Router();
const { blogsDB } = require("../mongo");

router.get("/hello-blogs", (req, res, next) => {
  res.json({ message: "Hello from express" });
});

router.get("/all-blogs", async function (req, res, next) {
  try {
    const collection = await blogsDB().collection("blogs50");
    const blogs50 = await collection.find({}).toArray();
    res.json(blogs50);
  } catch (e) {
    res.status(500).send("Error fetching posts.");
  }
});

module.exports = router;
