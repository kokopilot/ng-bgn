const express = require('express');
const router = express.Router();

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/" });
});

module.exports = router;
