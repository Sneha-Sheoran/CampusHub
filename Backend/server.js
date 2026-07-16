const express = require('express');
const cors = require('cors');
const { requestLogger } = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CampusHub API is running' });
});

const notesRouter = require('./routes/notes');
const lostItemsRouter = require('./routes/lostItems');
const marketplaceRouter = require('./routes/marketplace');
const complaintsRouter = require('./routes/complaints');
const eventsRouter = require('./routes/events');
const noticesRouter = require('./routes/notices');

app.use('/api/notes', notesRouter);
app.use('/api/lost-items', lostItemsRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/notices', noticesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CampusHub API listening on http://localhost:${PORT}`);
});

module.exports = app;
