const { readJsonFile, writeJsonFile, buildQueryOptions, sortItems, applySearch, generateId } = require('../utils/fileStorage');
const { validateRequiredFields } = require('../middleware/validation');

const FILE_NAME = 'events.json';

async function getAllEvents(req, res, next) {
  try {
    const { search, sort } = buildQueryOptions(req.query);
    const events = await readJsonFile(FILE_NAME);
    const filtered = applySearch(events, search);
    const sorted = sortItems(filtered, sort);
    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['title', 'category', 'description', 'date', 'location']);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const events = await readJsonFile(FILE_NAME);
    const event = {
      id: generateId('event'),
      ...req.body,
      featured: Boolean(req.body.featured),
      image: req.body.image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    events.unshift(event);
    await writeJsonFile(FILE_NAME, events);
    res.status(201).json({ success: true, message: 'Event created successfully', data: event });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const events = await readJsonFile(FILE_NAME);
    const index = events.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updatedEvent = {
      ...events[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    events[index] = updatedEvent;
    await writeJsonFile(FILE_NAME, events);
    res.status(200).json({ success: true, message: 'Event updated successfully', data: updatedEvent });
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const events = await readJsonFile(FILE_NAME);
    const filtered = events.filter((item) => item.id !== id);

    if (filtered.length === events.length) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await writeJsonFile(FILE_NAME, filtered);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
