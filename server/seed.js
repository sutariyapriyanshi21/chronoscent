const mongoose = require('mongoose');
const Watch = require('./models/Watch');
const Fragrance = require('./models/Fragerence');

const watchData = [
  { name: "Submariner Date", brand: "Rolex", model: "126610LN", price: 1050000, rating: 4.9, image: "/assests/Products/Watches/rolex-submariner.jpg", category: "Luxury", gender: "Men", watchType: "Diver", inStock: true },
  { name: "Lady-Datejust", brand: "Rolex", model: "279173", price: 825000, rating: 4.8, image: "/assests/Products/Watches/Lady-Datejust.jpg", category: "Luxury", gender: "Women", watchType: "Classic", inStock: true },
  { name: "Seamaster Diver 300M", brand: "Omega", model: "210.30.42.20.03.001", price: 525000, rating: 4.8, image: "/assests/Products/Watches/omega-seamaster.jpg", category: "Luxury", gender: "Men", watchType: "Diver", inStock: true },
  { name: "Panthère de Cartier", brand: "Cartier", model: "WSPN0012", price: 660000, rating: 4.8, image: "/assests/Products/Watches/Cartier Panthère de Cartier.jpg", category: "Luxury", gender: "Women", watchType: "Dress", inStock: true },
  { name: "Lovely Square", brand: "Tissot", model: "T058.109.11.031.00", price: 38500, rating: 4.7, image: "/assests/Products/Watches/Tissot Lovely Square.jpg", category: "Premium", gender: "Women", watchType: "Classic", inStock: true },
  { name: "Prospex Diver", brand: "Seiko", model: "SPB143", price: 105000, rating: 4.7, image: "/assests/Products/Watches/seiko-prospex.jpg", category: "Premium", gender: "Men", watchType: "Sport", inStock: true },
  { name: "Asymmetrical Vintage", brand: "Seiko", model: "Custom Vintage", price: 29500, rating: 4.5, image: "/assests/Products/Watches/Assymentrical seiko.jpg", category: "Standard", gender: "Unisex", watchType: "Classic", inStock: true },
  { name: "Baignoire", brand: "Cartier", model: "W8000008", price: 975000, rating: 4.9, image: "/assests/Products/Watches/Cartier Baignoire.jpg", category: "Luxury", gender: "Women", watchType: "Classic", inStock: true },
  { name: "Drive de Cartier", brand: "Cartier", model: "WSNM0004", price: 540000, rating: 4.8, image: "/assests/Products/Watches/Cartier Draive De Cartier.jpg", category: "Luxury", gender: "Men", watchType: "Classic", inStock: true },
  { name: "Constellation Pluma", brand: "Omega", model: "123.20.27.60.55.007", price: 440000, rating: 4.9, image: "/assests/Products/Watches/Omega Constellation Pluma.jpg", category: "Luxury", gender: "Women", watchType: "Classic", inStock: true },
  { name: "Oyster Perpetual Datejust", brand: "Rolex", model: "126234", price: 725000, rating: 4.9, image: "/assests/Products/Watches/Rolex Oyster Perpetual Datejust.jpg", category: "Luxury", gender: "Unisex", watchType: "Classic", inStock: true },
  { name: "Constellation", brand: "Omega", model: "131.10.39.20.01.001", price: 515000, rating: 4.8, image: "/assests/Products/Watches/The Omega Constellation.jpg", category: "Luxury", gender: "Men", watchType: "Classic", inStock: true },
  { name: "Classic Dream", brand: "Tissot", model: "T129.410.16.013.00", price: 21500, rating: 4.6, image: "/assests/Products/Watches/Tissot Classic Dream.jpg", category: "Standard", gender: "Men", watchType: "Classic", inStock: true },
  { name: "Classic", brand: "Seiko", model: "SUR371", price: 16500, rating: 4.5, image: "/assests/Products/Watches/seiko.jpg", category: "Standard", gender: "Unisex", watchType: "Classic", inStock: true },
  { name: "Vintage Must de Cartier", brand: "Cartier", model: "Vintage", price: 155000, rating: 4.7, image: "/assests/Products/Watches/vintage cartier.jpg", category: "Luxury", gender: "Unisex", watchType: "Classic", inStock: true }
];

const fragranceData = [
  { name: "Chance", brand: "Chanel", model: "Eau de Parfum", price: 11500, rating: 4.8, image: "/assests/Products/Fregerances/Chanel Chance.jpg", category: "Luxury", gender: "Women", fragranceType: "Floral", inStock: true },
  { name: "Pour Monsieur", brand: "Chanel", model: "Eau de Toilette", price: 10200, rating: 4.7, image: "/assests/Products/Fregerances/Chanel Pour Monsieur.jpg", category: "Classic", gender: "Men", fragranceType: "Woody", inStock: true },
  { name: "Aventus", brand: "Creed", model: "Eau de Parfum", price: 31000, rating: 4.9, image: "/assests/Products/Fregerances/Creed Aventus.jpg", category: "Niche", gender: "Men", fragranceType: "Fresh", inStock: true },
  { name: "Queen of Silk", brand: "Creed", model: "Eau de Parfum", price: 34000, rating: 4.8, image: "/assests/Products/Fregerances/Creed Queen of Silk.jpg", category: "Niche", gender: "Women", fragranceType: "Oriental", inStock: true },
  { name: "Carmina", brand: "Creed", model: "Eau de Parfum", price: 36000, rating: 4.9, image: "/assests/Products/Fregerances/Creed-carmina.jpg", category: "Niche", gender: "Women", fragranceType: "Floral", inStock: true },
  { name: "Crystal Noir", brand: "Versace", model: "Eau de Parfum", price: 9500, rating: 4.6, image: "/assests/Products/Fregerances/Crystal Noir Luxury_unisex.jpg", category: "Designer", gender: "Unisex", fragranceType: "Oriental", inStock: true },
  { name: "Dior Homme", brand: "Dior", model: "Eau de Toilette", price: 9800, rating: 4.7, image: "/assests/Products/Fregerances/Dior Homme_unisex.jpg", category: "Designer", gender: "Unisex", fragranceType: "Woody", inStock: true },
  { name: "Sauvage", brand: "Dior", model: "Eau de Parfum", price: 12500, rating: 4.9, image: "/assests/Products/Fregerances/Dior Sauvage.jpg", category: "Designer", gender: "Men", fragranceType: "Fresh", inStock: true },
  { name: "Eau Fraiche", brand: "Versace", model: "Eau de Toilette", price: 7800, rating: 4.5, image: "/assests/Products/Fregerances/EAU Fraiche_varsache_men.jpg", category: "Designer", gender: "Men", fragranceType: "Fresh", inStock: true },
  { name: "Gabrielle", brand: "Chanel", model: "Eau de Parfum", price: 13500, rating: 4.8, image: "/assests/Products/Fregerances/Gebrielle Chanel.jpg", category: "Luxury", gender: "Women", fragranceType: "Floral", inStock: true },
  { name: "Gris Dior", brand: "Dior", model: "Eau de Parfum", price: 28000, rating: 4.9, image: "/assests/Products/Fregerances/Gris Dior_ Unisex Eau de Parfum.jpg", category: "Private Blend", gender: "Unisex", fragranceType: "Woody", inStock: true },
  { name: "Miss Dior", brand: "Dior", model: "Eau de Parfum", price: 11500, rating: 4.7, image: "/assests/Products/Fregerances/Miss Dior.jpg", category: "Designer", gender: "Women", fragranceType: "Floral", inStock: true },
  { name: "Santal Blush", brand: "Tom Ford", model: "Eau de Parfum", price: 25000, rating: 4.8, image: "/assests/Products/Fregerances/TomFord Santal Blush.jpg", category: "Private Blend", gender: "Unisex", fragranceType: "Woody", inStock: true },
  { name: "Lost Cherry", brand: "Tom Ford", model: "Eau de Parfum", price: 33500, rating: 4.9, image: "/assests/Products/Fregerances/TomFord_Lost Cherry.jpg", category: "Private Blend", gender: "Unisex", fragranceType: "Fruity", inStock: true },
  { name: "Bright Crystal", brand: "Versace", model: "Eau de Toilette", price: 8200, rating: 4.6, image: "/assests/Products/Fregerances/Versace-Bright Crystal.jpg", category: "Designer", gender: "Women", fragranceType: "Fruity", inStock: true },
  { name: "Eros Pour Femme", brand: "Versace", model: "Eau de Parfum", price: 10500, rating: 4.7, image: "/assests/Products/Fregerances/varsace Eros pour Femme.jpg", category: "Designer", gender: "Women", fragranceType: "Woody", inStock: true }
];

mongoose.connect('mongodb://127.0.0.1:27017/chronoscent')
    .then(async () => {
        console.log('Connected to MongoDB for Seeding...');

        // 1. Clear out any old data
        await Watch.deleteMany({});
        await Fragrance.deleteMany({});

        // 2. Insert the new data
        await Watch.insertMany(watchData);
        await Fragrance.insertMany(fragranceData);

        console.log('Data Successfully Seeded! Added 15 Watches and 16 Fragrances with realistic Indian luxury pricing.');
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
