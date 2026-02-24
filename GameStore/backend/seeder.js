const mongoose = require('mongoose');
require('dotenv').config();
const Game = require('./models/Game');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gamevault')
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.log(err));

const games = [
    {
        title: "Ghost of Tsushima",
        imageUrl: "/images/ghost-of-tsushima.png",
        price: 59.99,
        category: "Action Adventure",
        rating: 4.8,
        description: "Uncover the hidden wonders of Tsushima in this open-world action adventure. Forge a new path and wage an unconventional war for the freedom of Tsushima.",
        platform: "PlayStation / PC",
        countInStock: 150,
        featured: true,
        trending: true
    },
    {
        title: "Mafia: The Old Country",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
        price: 69.99,
        category: "Action",
        rating: 4.5,
        description: "Uncover the origins of organized crime in a gripping mob story set in the brutal underworld of 1900s Sicily.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 200,
        featured: true,
        trending: false
    },
    {
        title: "Cricket 26",
        imageUrl: "/images/cricket-26.png",
        price: 49.99,
        category: "Sports",
        rating: 4.2,
        description: "The most authentic cricket simulation. Build your career, manage your team, and take them to World Cup glory.",
        platform: "PlayStation / Xbox",
        countInStock: 300,
        featured: false,
        trending: true
    },
    {
        title: "Hogwarts Legacy",
        imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=2000&auto=format&fit=crop",
        price: 59.99,
        category: "RPG",
        rating: 4.6,
        description: "Experience Hogwarts in the 1800s. Your character is a student who holds the key to an ancient secret that threatens to tear the wizarding world apart.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 80,
        featured: false,
        trending: true
    },
    {
        title: "Grand Theft Auto V",
        imageUrl: "/images/hero-gta5.png",
        price: 29.99,
        category: "Open World",
        rating: 4.9,
        description: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 500,
        featured: true,
        trending: true
    },
    {
        title: "The First Berserker: Khazan",
        imageUrl: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2619&auto=format&fit=crop",
        price: 69.99,
        category: "Action RPG",
        rating: 4.4,
        description: "A hardcore action RPG. Overcome the tragic fate that has befallen Khazan, the falsely accused hero.",
        platform: "PC / PlayStation",
        countInStock: 45,
        featured: false,
        trending: true
    },
    {
        title: "Black Myth: Wukong",
        imageUrl: "/images/black-myth-wukong.png",
        price: 69.99,
        category: "Action RPG",
        rating: 4.8,
        description: "Rooted in Chinese mythology and based on Journey to the West, one of the Four Great Classical Novels of Chinese literature.",
        platform: "PC / PlayStation",
        countInStock: 120,
        featured: true,
        trending: true
    },
    {
        title: "Marvel's Spider-Man 2",
        imageUrl: "/images/spider-man-2.png",
        price: 69.99,
        category: "Action Adventure",
        rating: 4.7,
        description: "Spider-Men Peter Parker and Miles Morales face the ultimate test of strength inside and outside the mask as they fight to save the city, each other and the ones they love.",
        platform: "PlayStation",
        countInStock: 150,
        featured: true,
        trending: true
    },
    {
        title: "God of War Ragnarök",
        imageUrl: "/images/god-of-war-ragnarok.png",
        price: 59.99,
        category: "Action Adventure",
        rating: 4.9,
        description: "Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.",
        platform: "PlayStation / PC",
        countInStock: 220,
        featured: true,
        trending: false
    },
    {
        title: "Cyberpunk 2077",
        imageUrl: "/images/cyberpunk-2077.png",
        price: 39.99,
        category: "RPG",
        rating: 4.3,
        description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 300,
        featured: true,
        trending: true
    },
    {
        title: "Dying Light 2 Stay Human",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
        price: 59.99,
        category: "Action Survival",
        rating: 4.1,
        description: "The virus won and civilization has fallen back to the Dark Ages. The City, one of the last human settlements, is on the brink of collapse.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 150,
        featured: false,
        trending: false
    },
    {
        title: "Elden Ring",
        imageUrl: "https://images.unsplash.com/photo-1604859062973-50ec8e7b99c8?q=80&w=2670&auto=format&fit=crop",
        price: 59.99,
        category: "Action RPG",
        rating: 4.9,
        description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 400,
        featured: true,
        trending: true
    },
    {
        title: "Mortal Kombat 1",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
        price: 69.99,
        category: "Fighting",
        rating: 4.3,
        description: "Discover a reborn Mortal Kombat Universe created by the Fire God Liu Kang. Mortal Kombat 1 ushers in a new era of the iconic franchise.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 110,
        featured: false,
        trending: true
    },
    {
        title: "WWE 2K25",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
        price: 69.99,
        category: "Sports",
        rating: 4.0,
        description: "Experience the ultimate wrestling simulation with updated rosters, new match types, and stunning graphics in WWE 2K25.",
        platform: "PlayStation / Xbox / PC",
        countInStock: 50,
        featured: false,
        trending: false
    },
    {
        title: "Resident Evil 4",
        imageUrl: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=2000&auto=format&fit=crop",
        price: 39.99,
        category: "Horror",
        rating: 4.8,
        description: "Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City.",
        platform: "PC / PlayStation / Xbox",
        countInStock: 250,
        featured: true,
        trending: false
    },
    {
        title: "Uncharted 4: A Thief's End",
        imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2000&auto=format&fit=crop",
        price: 19.99,
        category: "Action Adventure",
        rating: 4.9,
        description: "Several years after his last adventure, retired fortune hunter Nathan Drake is forced back into the world of thieves.",
        platform: "PlayStation / PC",
        countInStock: 300,
        featured: true,
        trending: false
    },
    {
        title: "Detroit: Become Human",
        imageUrl: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2000&auto=format&fit=crop",
        price: 29.99,
        category: "Narrative Adventure",
        rating: 4.6,
        description: "Detroit 2038. Technology has evolved to a point where human like androids are everywhere.",
        platform: "PlayStation / PC",
        countInStock: 90,
        featured: false,
        trending: false
    }
];

const seedDB = async () => {
    try {
        await Game.deleteMany({});
        await Game.insertMany(games);
        console.log(`Database seeded proudly with ${games.length} high-quality curated games!`);

        await User.deleteMany({ role: 'admin' });
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@playvault.gg',
            password: 'adminpassword',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user created: admin@playvault.gg / adminpassword');

        const Category = require('./models/Category');
        await Category.deleteMany({});
        await Category.insertMany([
            { name: 'Action Adventure' },
            { name: 'Action' },
            { name: 'Sports' },
            { name: 'RPG' },
            { name: 'Open World' },
            { name: 'Action RPG' },
            { name: 'Action Survival' },
            { name: 'Fighting' },
            { name: 'Horror' },
            { name: 'Narrative Adventure' }
        ]);
        console.log('Categories seeded!');

        process.exit();
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
