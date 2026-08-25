export const menuData = [
  {
    id: "m1",
    category: "Breakfast",
    name: "Classic sssssIdli Vada",
    description: "Soft fluffy idlis served with crispy vada, sambar and three varieties of chutneys.",
    price: 150,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&q=80&w=600",
    type: "veg",
    isFeatured: true
  },
  {
    id: "m2",
    category: "Breakfast",
    name: "Mysore Masala Dosa",
    description: "Crispy dosa layered with spicy red chutney and potato masala.",
    price: 180,
    image: "https://images.unsplash.com/photo-1626779836553-277157bc8105?auto=format&fit=crop&q=80&w=600",
    type: "veg",
    isFeatured: true
  },
  {
    id: "m3",
    category: "Veg Items",
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes simmered in a rich, creamy tomato and cashew gravy.",
    price: 320,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
    type: "veg",
    isFeatured: false
  },
  {
    id: "m4",
    category: "Non Veg Items",
    name: "Andhra Natukodi Pulusu",
    description: "Spicy country chicken curry made with authentic hand-ground spices.",
    price: 450,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600",
    type: "non-veg",
    isFeatured: true
  },
  {
    id: "m5",
    category: "Rice Items",
    name: "Hyderabadi Mutton Dum Biryani",
    description: "Premium basmati rice and tender mutton pieces cooked on dum with aromatic spices.",
    price: 480,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&q=80&w=600",
    type: "non-veg",
    isFeatured: true
  },
  {
    id: "m6",
    category: "Sweets",
    name: "Double ka Meetha",
    description: "Rich bread pudding sweet originating from Hyderabad, garnished with dried fruits.",
    price: 160,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=600",
    type: "veg",
    isFeatured: false
  }
];

export const getUniqueCategories = () => {
  const categories = [...new Set(menuData.map(item => item.category))];
  return categories;
};
