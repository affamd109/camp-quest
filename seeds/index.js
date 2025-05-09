require('dotenv').config();

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

//Here the path includes 2 dots , cuz one is to get out from views and then other to go into models directory


// mongoose.connect('mongodb://127.0.0.1:27017/campquest');

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//whichArray means descriptors array and places array
const sample = (whichArray) => whichArray[Math.floor(Math.random() * whichArray.length)]

/* 
Before destructuring:
seedHelpers = {
    descriptors: ["Serene", "Rustic", "Majestic"],
    places: ["Canyon", "Meadows", "Springs"]
}

After destructuring:
places = ["Canyon", "Meadows", "Springs"]
descriptors = ["Serene", "Rustic", "Majestic"]

*/

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // author : '67eea9fc6dc5fdcf6f79e212',//For locqalhost
            author : '681e674e92768bac7874cb2d',//For locqalhost
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
                   {
                      url: 'https://res.cloudinary.com/dgixw9flq/image/upload/q_auto,f_auto/v1746605985/CampQuest/ny1u4ztkm4y1n3kfiqhy.jpg',
                      filename: 'CampQuest/gxzrbiurqbkaieghjhim'
                    },
                    {
                      url: 'https://res.cloudinary.com/dgixw9flq/image/upload/q_auto,f_auto/v1746606179/CampQuest/ysmnsidb8yqhlucie0rz.jpg',
                      filename: 'CampQuest/gl5hyedfg2hlugjgcnzo'
                    }
                  ]
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close(); /*This will make the server stop running
                                just after the seedDB function has been executed*/
})