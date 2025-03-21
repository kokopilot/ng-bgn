const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

// Use the router for handling API routes
app.use('/api/', apiRouter);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.sendStatus(404);
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
