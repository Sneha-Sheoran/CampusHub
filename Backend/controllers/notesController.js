const { readJsonFile, writeJsonFile, buildQueryOptions, sortItems, applySearch, generateId } = require('../utils/fileStorage');
const { validateRequiredFields } = require('../middleware/validation');

const FILE_NAME = 'notes.json';

async function getAllNotes(req, res, next) {
  try {
    const { search, sort } = buildQueryOptions(req.query);
    const notes = await readJsonFile(FILE_NAME);
    const filtered = applySearch(notes, search);
    const sorted = sortItems(filtered, sort);
    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
}

async function createNote(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['subject', 'code', 'department', 'description', 'author']);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const notes = await readJsonFile(FILE_NAME);
    const note = {
      id: generateId('note'),
      ...req.body,
      downloads: 0,
      bookmarkCount: 0,
      size: req.body.size || '1.0 MB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.unshift(note);
    await writeJsonFile(FILE_NAME, notes);
    res.status(201).json({ success: true, message: 'Note created successfully', data: note });
  } catch (error) {
    next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const { id } = req.params;
    const notes = await readJsonFile(FILE_NAME);
    const noteIndex = notes.findIndex((item) => item.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const updatedNote = {
      ...notes[noteIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    await writeJsonFile(FILE_NAME, notes);
    res.status(200).json({ success: true, message: 'Note updated successfully', data: updatedNote });
  } catch (error) {
    next(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;
    const notes = await readJsonFile(FILE_NAME);
    const filtered = notes.filter((item) => item.id !== id);

    if (filtered.length === notes.length) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    await writeJsonFile(FILE_NAME, filtered);
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
};
