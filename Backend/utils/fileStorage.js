const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function ensureDataFile(fileName) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, fileName);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
  return filePath;
}

async function readJsonFile(fileName) {
  const filePath = await ensureDataFile(fileName);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeJsonFile(fileName, data) {
  const filePath = await ensureDataFile(fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return filePath;
}

function buildQueryOptions(query = {}) {
  const options = { search: '', sort: 'newest', filter: {} };
  if (typeof query.search === 'string') {
    options.search = query.search.trim();
  }

  if (typeof query.sort === 'string') {
    options.sort = query.sort;
  }

  return options;
}

function sortItems(items, sort = 'newest') {
  const list = [...items];
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'alphabetical':
      return list.sort((a, b) => (a.title || a.name || a.subject || '').localeCompare(b.title || b.name || b.subject || ''));
    case 'price':
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    default:
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

function applySearch(items, search) {
  if (!search) return items;
  const term = search.toLowerCase();
  return items.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      return false;
    });
  });
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = {
  ensureDataFile,
  readJsonFile,
  writeJsonFile,
  buildQueryOptions,
  sortItems,
  applySearch,
  generateId
};
