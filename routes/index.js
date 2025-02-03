const express = require('express');
const router = express.Router();

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.send("If you can see this, the server is running.");
});

module.exports = router;
