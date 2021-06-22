export const MENU_ITEMS = [
  {
    id: 'hot_drinks',
    title: 'Hot Drinks',
    items: [
      {
        id: 'coffee',
        short_name: 'Coffee',
        picture: '/menu/brewed_coffee.jpg',
        name: 'Coffee',
        price: 0.75,
        description:
          'A smooth, well-balanced coffee with rich flavors of chocolate and toasted nuts. Brewed fresh for you.',
      },
      {
        id: 'espresso',
        short_name: 'Espresso',
        picture: '/menu/espresso.jpg',
        name: 'Shot of Espresso',
        price: 2.5,
        description:
          'Our smooth signature Espresso with rich flavor and caramelly sweetness is at the heart of everything we do.',
      },
      {
        id: 'latte',
        short_name: 'Latte',
        picture: '/menu/latte.jpg',
        name: 'Latte',
        price: 3.25,
        description:
          'Rich espresso balanced with steamed milk and a light layer of foam. A perfect milk-forward warm-up.',
      },
      {
        id: 'cappuccino',
        short_name: 'Cappuccino',
        picture: '/menu/cappuccino.jpg',
        name: 'Cappuccino',
        price: 0.75,
        description:
          'Dark, rich espresso lies in wait under a smooth and stretched layer of thick milk foam. A alchemy of barist artistry and craft.',
      },
      {
        id: 'pour_over',
        short_name: 'Pour Over',
        picture: '/menu/pour_over.jpg',
        name: 'Pour Over',
        price: 3.0,
        description: 'The coffee you love, made with care and precision.',
      },
    ],
  },
  {
    id: 'cold_drinks',
    title: 'Cold Drinks',
    items: [
      {
        id: 'cold_brew',
        short_name: 'Cold Brew',
        picture: '/menu/cold_brew.jpg',
        name: 'Cold Brew',
        price: 2.75,
        description:
          "Slow-stepped in cool water for 20 hours, our cold brew coffee is the smoothest coffee you'll find.",
      },
      {
        id: 'iced_coffee',
        short_name: 'Iced Coffee',
        picture: '/menu/iced_coffee.jpg',
        name: 'Iced Coffee',
        price: 2.5,
        description:
          'Your favorite coffee, chilled and sweeteend over ice. A refreshing lift to any day.',
      },
    ],
  },
];

export default MENU_ITEMS;