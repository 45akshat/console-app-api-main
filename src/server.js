// server.js

const app = require('./app');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(dbConfig.url, dbConfig.options)
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
