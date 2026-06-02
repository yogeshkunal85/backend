const menuItems = [
  {
    id: 'burger-1',
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheddar, lettuce, and tomato',
    price: 9.99,
    imageUrl: 'https://example.com/images/cheeseburger.jpg',
    category: 'Burgers',
  },
  {
    id: 'burger-2',
    name: 'BBQ Bacon Burger',
    description: 'Smoky BBQ sauce with crispy bacon',
    price: 11.99,
    imageUrl: 'https://example.com/images/bbq-burger.jpg',
    category: 'Burgers',
  },
  {
    id: 'burger-3',
    name: 'Veggie Deluxe',
    description: 'Plant-based patty with avocado and sprouts',
    price: 10.49,
    imageUrl: 'https://example.com/images/veggie-burger.jpg',
    category: 'Burgers',
  },
  {
    id: 'pizza-1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce',
    price: 12.99,
    imageUrl: 'https://example.com/images/margherita.jpg',
    category: 'Pizza',
  },
  {
    id: 'pizza-2',
    name: 'Pepperoni Feast',
    description: 'Double pepperoni with extra cheese',
    price: 14.99,
    imageUrl: 'https://example.com/images/pepperoni.jpg',
    category: 'Pizza',
  },
  {
    id: 'pizza-3',
    name: 'Garden Veggie Pizza',
    description: 'Bell peppers, mushrooms, olives, and onions',
    price: 13.49,
    imageUrl: 'https://example.com/images/veggie-pizza.jpg',
    category: 'Pizza',
  },
];

function getMenuItems() {
  return menuItems;
}

function getMenuItemById(id) {
  return menuItems.find((item) => item.id === id);
}

module.exports = { menuItems, getMenuItems, getMenuItemById };
