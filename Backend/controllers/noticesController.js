const { readJsonFile, writeJsonFile, buildQueryOptions, sortItems, applySearch, generateId } = require('../utils/fileStorage');
const { validateRequiredFields } = require('../middleware/validation');

const FILE_NAME = 'notices.json';

async function getAllNotices(req, res, next) {
  try {
    const { search, sort } = buildQueryOptions(req.query);
    const notices = await readJsonFile(FILE_NAME);
    const filtered = applySearch(notices, search);
    const sorted = sortItems(filtered, sort);
    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
}

async function createNotice(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['title', 'category', 'content']);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const notices = await readJsonFile(FILE_NAME);
    const notice = {
      id: generateId('notice'),
      ...req.body,
      important: Boolean(req.body.important),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notices.unshift(notice);
    await writeJsonFile(FILE_NAME, notices);
    res.status(201).json({ success: true, message: 'Notice created successfully', data: notice });
  } catch (error) {
    next(error);
  }
}

async function updateNotice(req, res, next) {
  try {
    const { id } = req.params;
    const notices = await readJsonFile(FILE_NAME);
    const index = notices.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    const updatedNotice = {
      ...notices[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    notices[index] = updatedNotice;
    await writeJsonFile(FILE_NAME, notices);
    res.status(200).json({ success: true, message: 'Notice updated successfully', data: updatedNotice });
  } catch (error) {
    next(error);
  }
}

async function deleteNotice(req, res, next) {
  try {
    const { id } = req.params;
    const notices = await readJsonFile(FILE_NAME);
    const filtered = notices.filter((item) => item.id !== id);

    if (filtered.length === notices.length) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    await writeJsonFile(FILE_NAME, filtered);
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
};
