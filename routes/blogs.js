const express = require("express");
const router = express.Router();
const { blogsDB } = require("../mongo");

router.get("/hello-blogs", (req, res) => {
  res.json({ message: "Hello from express" });
});

router.get("/all-blogs", async function (req, res) {
  try {
    const collection = await blogsDB().collection("blogs50");
    const posts = await collection.find({}).toArray();
    res.json({ message: posts });
  } catch (e) {
    res.status(500).send("Error fetching posts.");
  }
});

module.exports = router;
