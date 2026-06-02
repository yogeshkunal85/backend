const { getMenuItems } = require('../data/menuItems');

function getMenu(req, res) {
  res.status(200).json(getMenuItems());
}

module.exports = { getMenu };
