const mongoose = require('mongoose');
const Watch = require('./models/Watch');
const Fragrance = require('./models/Fragerence');

const watchData = [
  { name: "Submariner Date", brand: "Rolex", price: 12500, image: "/assests/Products/Watches/rolex-submariner.jpg", gender: "Men", watchType: "Diver" },
  { name: "Lady-Datejust", brand: "Rolex", price: 980, image: "/assests/Products/Watches/Lady-Datejust.jpg", gender: "Women", watchType: "Classic" },
  { name: "Seamaster Diver 300M", brand: "Omega", price: 6200, image: "/assests/Products/Watches/omega-seamaster.jpg", gender: "Men", watchType: "Diver" },
  { name: "Panthère de Cartier", brand: "Cartier", price: 7800, image: "/assests/Products/Watches/Cartier Panthère de Cartier.jpg", gender: "Women", watchType: "Dress" },
  { name: "Lovely Square", brand: "Tissot", price: 450, image: "/assests/Products/Watches/Tissot Lovely Square.jpg", gender: "Women", watchType: "Classic" },
  { name: "Prospex Diver", brand: "Seiko", price: 1250, image: "/assests/Products/Watches/seiko-prospex.jpg", gender: "Men", watchType: "Sport" },
  { name: "Asymmetrical Vintage", brand: "Seiko", price: 350, image: "/assests/Products/Watches/Assymentrical seiko.jpg", gender: "Unisex", watchType: "Classic" },
  { name: "Baignoire", brand: "Cartier", price: 11500, image: "/assests/Products/Watches/Cartier Baignoire.jpg", gender: "Women", watchType: "Classic" },
  { name: "Drive de Cartier", brand: "Cartier", price: 6350, image: "/assests/Products/Watches/Cartier Draive De Cartier.jpg", gender: "Men", watchType: "Classic" },
  { name: "Constellation Pluma", brand: "Omega", price: 5200, image: "/assests/Products/Watches/Omega Constellation Pluma.jpg", gender: "Women", watchType: "Classic" },
  { name: "Oyster Perpetual Datejust", brand: "Rolex", price: 8550, image: "/assests/Products/Watches/Rolex Oyster Perpetual Datejust.jpg", gender: "Unisex", watchType: "Classic" },
  { name: "Constellation", brand: "Omega", price: 6050, image: "/assests/Products/Watches/The Omega Constellation.jpg", gender: "Men", watchType: "Classic" },
  { name: "Classic Dream", brand: "Tissot", price: 250, image: "/assests/Products/Watches/Tissot Classic Dream.jpg", gender: "Men", watchType: "Classic" },
  { name: "Classic", brand: "Seiko", price: 195, image: "/assests/Products/Watches/seiko.jpg", gender: "Unisex", watchType: "Classic" },
  { name: "Vintage Must de Cartier", brand: "Cartier", price: 1800, image: "/assests/Products/Watches/vintage cartier.jpg", gender: "Unisex", watchType: "Classic" }
];

const fragranceData = [
  { name: "Chance", brand: "Chanel", price: 135, image: "/assests/Products/Fregerances/Chanel Chance.jpg", gender: "Women", fragranceType: "Floral" },
  { name: "Pour Monsieur", brand: "Chanel", price: 120, image: "/assests/Products/Fregerances/Chanel Pour Monsieur.jpg", gender: "Men", fragranceType: "Woody" },
  { name: "Aventus", brand: "Creed", price: 365, image: "/assests/Products/Fregerances/Creed Aventus.jpg", gender: "Men", fragranceType: "Fresh" },
  { name: "Queen of Silk", brand: "Creed", price: 400, image: "/assests/Products/Fregerances/Creed Queen of Silk.jpg", gender: "Women", fragranceType: "Oriental" },
  { name: "Carmina", brand: "Creed", price: 425, image: "/assests/Products/Fregerances/Creed-carmina.jpg", gender: "Women", fragranceType: "Floral" },
  { name: "Crystal Noir", brand: "Versace", price: 110, image: "/assests/Products/Fregerances/Crystal Noir Luxury_unisex.jpg", gender: "Unisex", fragranceType: "Oriental" },
  { name: "Dior Homme", brand: "Dior", price: 115, image: "/assests/Products/Fregerances/Dior Homme_unisex.jpg", gender: "Unisex", fragranceType: "Woody" },
  { name: "Sauvage", brand: "Dior", price: 145, image: "/assests/Products/Fregerances/Dior Sauvage.jpg", gender: "Men", fragranceType: "Fresh" },
  { name: "Eau Fraiche", brand: "Versace", price: 90, image: "/assests/Products/Fregerances/EAU Fraiche_varsache_men.jpg", gender: "Men", fragranceType: "Fresh" },
  { name: "Gabrielle", brand: "Chanel", price: 160, image: "/assests/Products/Fregerances/Gebrielle Chanel.jpg", gender: "Women", fragranceType: "Floral" },
  { name: "Gris Dior", brand: "Dior", price: 330, image: "/assests/Products/Fregerances/Gris Dior_ Unisex Eau de Parfum.jpg", gender: "Unisex", fragranceType: "Woody" },
  { name: "Miss Dior", brand: "Dior", price: 135, image: "/assests/Products/Fregerances/Miss Dior.jpg", gender: "Women", fragranceType: "Floral" },
  { name: "Santal Blush", brand: "Tom Ford", price: 295, image: "/assests/Products/Fregerances/TomFord Santal Blush.jpg", gender: "Unisex", fragranceType: "Woody" },
  { name: "Lost Cherry", brand: "Tom Ford", price: 395, image: "/assests/Products/Fregerances/TomFord_Lost Cherry.jpg", gender: "Unisex", fragranceType: "Fruity" },
  { name: "Bright Crystal", brand: "Versace", price: 95, image: "/assests/Products/Fregerances/Versace-Bright Crystal.jpg", gender: "Women", fragranceType: "Fruity" },
  { name: "Eros Pour Femme", brand: "Versace", price: 120, image: "/assests/Products/Fregerances/varsace Eros pour Femme.jpg", gender: "Women", fragranceType: "Woody" }
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

        console.log('Data Successfully Seeded! Added 15 Watches and 16 Fragrances.');
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
