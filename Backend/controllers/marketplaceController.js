const { readJsonFile, writeJsonFile, buildQueryOptions, sortItems, applySearch, generateId } = require('../utils/fileStorage');
const { validateRequiredFields, validatePhoneNumber } = require('../middleware/validation');

const FILE_NAME = 'marketplace.json';

async function getAllMarketplaceItems(req, res, next) {
  try {
    const { search, sort } = buildQueryOptions(req.query);
    const items = await readJsonFile(FILE_NAME);
    const filtered = applySearch(items, search);
    const sorted = sortItems(filtered, sort === 'price' ? 'price' : sort);
    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
}

async function createMarketplaceItem(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['name', 'price', 'category', 'description', 'contact']);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    if (!validatePhoneNumber(req.body.contact)) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: ['contact must be a valid phone number'] });
    }

    const items = await readJsonFile(FILE_NAME);
    const item = {
      id: generateId('market'),
      ...req.body,
      price: Number(req.body.price),
      image: req.body.image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop',
      seller: req.body.seller || 'CampusHub Student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.unshift(item);
    await writeJsonFile(FILE_NAME, items);
    res.status(201).json({ success: true, message: 'Marketplace item created successfully', data: item });
  } catch (error) {
    next(error);
  }
}

async function updateMarketplaceItem(req, res, next) {
  try {
    const { id } = req.params;
    const items = await readJsonFile(FILE_NAME);
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Marketplace item not found' });
    }

    const updatedItem = {
      ...items[index],
      ...req.body,
      price: Number(req.body.price || items[index].price),
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    await writeJsonFile(FILE_NAME, items);
    res.status(200).json({ success: true, message: 'Marketplace item updated successfully', data: updatedItem });
  } catch (error) {
    next(error);
  }
}

async function deleteMarketplaceItem(req, res, next) {
  try {
    const { id } = req.params;
    const items = await readJsonFile(FILE_NAME);
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) {
      return res.status(404).json({ success: false, message: 'Marketplace item not found' });
    }

    await writeJsonFile(FILE_NAME, filtered);
    res.status(200).json({ success: true, message: 'Marketplace item deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMarketplaceItems,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem
};
