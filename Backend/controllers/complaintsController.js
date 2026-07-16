const { readJsonFile, writeJsonFile, buildQueryOptions, sortItems, applySearch, generateId } = require('../utils/fileStorage');
const { validateRequiredFields } = require('../middleware/validation');

const FILE_NAME = 'complaints.json';

async function getAllComplaints(req, res, next) {
  try {
    const { search, sort } = buildQueryOptions(req.query);
    const complaints = await readJsonFile(FILE_NAME);
    const filtered = applySearch(complaints, search);
    const sorted = sortItems(filtered, sort);
    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
}

async function createComplaint(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['title', 'category', 'description']);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const complaints = await readJsonFile(FILE_NAME);
    const complaint = {
      id: generateId('complaint'),
      ...req.body,
      status: 'pending',
      trackingId: `CH-COMP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    complaints.unshift(complaint);
    await writeJsonFile(FILE_NAME, complaints);
    res.status(201).json({ success: true, message: 'Complaint created successfully', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function updateComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const complaints = await readJsonFile(FILE_NAME);
    const index = complaints.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const updatedComplaint = {
      ...complaints[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    complaints[index] = updatedComplaint;
    await writeJsonFile(FILE_NAME, complaints);
    res.status(200).json({ success: true, message: 'Complaint updated successfully', data: updatedComplaint });
  } catch (error) {
    next(error);
  }
}

async function deleteComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const complaints = await readJsonFile(FILE_NAME);
    const filtered = complaints.filter((item) => item.id !== id);

    if (filtered.length === complaints.length) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    await writeJsonFile(FILE_NAME, filtered);
    res.status(200).json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
