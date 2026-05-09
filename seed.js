require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Food = require("./models/Food");
const Worker = require("./models/Worker");

const initialMenu = [
  {
    name: "Classic Pizza",
    price: 12.99,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    ingredients: "Tomato sauce, Mozzarella, Basil",
    details: "A classic Italian pizza with fresh ingredients."
  },
  {
    name: "Cheeseburger",
    price: 9.99,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    ingredients: "Beef patty, Cheese, Lettuce, Tomato, Bun",
    details: "Juicy beef burger with melted cheese and fresh veggies."
  },
  {
    name: "Chicken Biryani",
    price: 14.50,
    img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
    ingredients: "Chicken, Basmati Rice, Spices",
    details: "Traditional aromatic and spicy rice dish."
  },
  {
    name: "Banana Pancakes",
    price: 8.50,
    img: "https://images.unsplash.com/photo-1528207776546-384111d0bb89?w=800&q=80",
    ingredients: "Flour, Milk, Eggs, Banana, Syrup",
    details: "Fluffy pancakes topped with fresh bananas and maple syrup."
  },
  {
    name: "Grilled Kabab",
    price: 11.00,
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    ingredients: "Minced Meat, Spices, Onions",
    details: "Perfectly grilled and heavily spiced kababs."
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB. Clearing old foods...");
    await Food.deleteMany({});
    console.log("Inserting new foods...");
    await Food.insertMany(initialMenu);

    console.log("Ensuring manager account exists...");
    const managerEmail = "prajna2023034.rcciit@gmail.com";
    const managerExists = await Worker.findOne({ email: managerEmail });

    if (!managerExists) {
      const hashedPassword = await bcrypt.hash("prajna", 10);
      await Worker.create({
        name: "Prajna",
        email: managerEmail,
        password: hashedPassword,
        role: "manager",
        isApproved: true,
        phone: "0000000000"
      });
      console.log("✅ Manager account created successfully!");
    } else {
      // Force update password to hashed version just in case it was plain text
      const hashedPassword = await bcrypt.hash("prajna", 10);
      managerExists.password = hashedPassword;
      await managerExists.save();
      console.log("ℹ️ Manager account password verified/updated.");
    }

    console.log("Successfully seeded database!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to seed:", err);
    process.exit(1);
  });
