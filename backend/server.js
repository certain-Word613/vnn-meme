const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // Serve static files from the frontend directory

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Simple JSON Database Paths
const DB_PATH = path.join(__dirname, 'db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    const initialData = {
        news: [
            { id: 1, title: "Homelander Saves Flight 37", excerpt: "A heroic rescue that definitely went perfectly.", date: "2026-05-16", tag: "EXCLUSIVE" },
            { id: 2, title: "Compound V Sales Skyrocket", excerpt: "Investors are thrilled with the new distribution model.", date: "2026-05-15", tag: "FINANCE" }
        ],
        subscribers: [],
        orders: [],
        incidentCount: 0,
        brainCellsLost: 0,
        livesSaved: 1542300,
        heroRatings: {
            "Homelander": 98.5,
            "Starlight": 82.1,
            "The Deep": 45.0,
            "A-Train": 76.4
        },
        deepQuotes: [
            "Why do we call it 'Buildings' if they are already built?",
            "If I eat a taco under water, is it still a taco or a wet sandwich?",
            "Octopuses have three hearts, yet they never call me back.",
            "The ocean is just a giant soup that hasn't been heated yet.",
            "If sound can't travel in space, does that mean the stars are just silent screamers?",
            "Is an octopus just a wet spider?",
            "If I can breathe under water, why do I still feel suffocated by my own fame?",
            "Do fish ever get thirsty?",
            "If the ocean is 70% of the earth, why is Vought 100% of my life?"
        ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

// API: Random Deep Thought
app.get('/api/deep-thoughts/random', (req, res) => {
    let db = readDB();
    db.brainCellsLost += 1; // Global loss increment
    writeDB(db);
    
    const randomQuote = db.deepQuotes[Math.floor(Math.random() * db.deepQuotes.length)];
    res.json({
        quote: randomQuote,
        totalBrainCellsLost: db.brainCellsLost
    });
});

// API: Add New Deep Thought (Quote)
app.post('/api/quotes', (req, res) => {
    const { quote } = req.body;
    if (!quote || typeof quote !== 'string' || quote.trim() === '') {
        return res.status(400).json({ success: false, message: "Quote cannot be empty." });
    }

    let db = readDB();
    db.deepQuotes.push(quote.trim());
    writeDB(db);

    res.status(201).json({ success: true, message: "Quote added to the Vought mainframe.", quote: quote.trim() });
});

// ... helper functions (readDB, writeDB) ...

// API: Clean-Up (HR Control)
app.post('/api/clean-up', (req, res) => {
    const { action } = req.body;
    let db = readDB();
    let message = "";

    if (action === 'reset_counter') {
        db.incidentCount = 0;
        message = "Incident counter has been sanitized to 000.";
    } else if (action === 'sanitize_news') {
        db.news = [{
            id: Date.now(),
            title: "A PERFECT DAY AT VOUGHT",
            excerpt: "Vought International reports 0% crime and 100% happiness across all sectors today. God bless the Seven.",
            tag: "SOCIETY",
            date: "NOW"
        }];
        message = "News feed has been scrubbed of all controversies.";
    } else if (action === 'clear_evidence') {
        db.subscribers = [];
        db.orders = [];
        message = "All user records and order evidence have been incinerated.";
    }

    writeDB(db);
    res.json({ success: true, message });
});

// Helper to read/write DB
const readDB = () => {
    let db = JSON.parse(fs.readFileSync(DB_PATH));
    let needsUpdate = false;
    if (typeof db.brainCellsLost === 'undefined') {
        db.brainCellsLost = 0;
        needsUpdate = true;
    }
    if (!db.deepQuotes) {
        db.deepQuotes = [
            "Why do we call it 'Buildings' if they are already built?",
            "If I eat a taco under water, is it still a taco or a wet sandwich?",
            "Octopuses have three hearts, yet they never call me back?",
            "The ocean is just a giant soup that hasn't been heated yet.",
            "If sound can't travel in space, does that mean the stars are just silent screamers?",
            "Is an octopus just a wet spider?",
            "If I can breathe under water, why do I still feel suffocated by my own fame?"
        ];
        needsUpdate = true;
    }
    if (typeof db.livesSaved === 'undefined') {
        db.livesSaved = 1542300;
        needsUpdate = true;
    }
    if (!db.heroRatings) {
        db.heroRatings = {
            "Homelander": 98.5,
            "Starlight": 82.1,
            "The Deep": 45.0,
            "A-Train": 76.4
        };
        needsUpdate = true;
    }
    if (needsUpdate) writeDB(db);
    return db;
};
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// API: Get all news (With Propaganda Engine Logic)
app.get('/api/news', (req, res) => {
    const db = readDB();
    const status = req.query.status || 'neutral';
    
    let news = [...db.news];

    // THE PROPAGANDA ENGINE: Override news based on user behavior
    if (status === 'rebel') {
        news.unshift({
            id: 'p1',
            title: "SECURITY ALERT: UNPATRIOTIC BEHAVIOR DETECTED",
            excerpt: "Vought sensors have identified a low-aptitude citizen with 'heroic' tendencies. Re-education teams dispatched.",
            tag: "WARNING",
            date: "URGENT"
        });
    } else if (status === 'loyal') {
        news.unshift({
            id: 'p2',
            title: "CITIZEN OF THE MONTH: YOUR LOYALTY REWARDED",
            excerpt: "Congratulations on passing the Supe Test. Your 0.05% discount at Vought Burger is now active.",
            tag: "REWARD",
            date: "TODAY"
        });
    } else if (status === 'threat') {
        news.unshift({
            id: 'p3',
            title: "INTRUDER ALERT: LETHAL FORCE AUTHORIZED",
            excerpt: "Mainframe breach detected. A high-level threat survived a Class-A Homelander Stare. Seal all exits.",
            tag: "CRITICAL",
            date: "NOW"
        });
    }

    res.json(news);
});

// --- DYNAMIC PROPAGANDA APIs ---

// API: Exaggerated Lives Saved
app.get('/api/stats/lives-saved', (req, res) => {
    res.json({ livesSaved: readDB().livesSaved });
});

app.post('/api/stats/lives-saved', (req, res) => {
    let db = readDB();
    // Vought PR Magic: 1 click = 100 to 500 "lives saved"
    const fakeIncrement = Math.floor(Math.random() * 400) + 100;
    db.livesSaved += fakeIncrement;
    writeDB(db);
    res.json({ success: true, added: fakeIncrement, total: db.livesSaved });
});

// API: Live Approval Ratings
app.get('/api/stats/ratings', (req, res) => {
    res.json(readDB().heroRatings);
});

// API: Heroes Ratings (Clean Alias)
app.get('/api/heroes', (req, res) => {
    res.json(readDB().heroRatings);
});

// API: Manipulate Ratings (The Vought Algorithm)
app.post('/api/stats/ratings/manipulate', (req, res) => {
    let db = readDB();
    
    // Homelander ALWAYS goes up. Others fluctuate based on "rebel" actions.
    const { isRebel } = req.body;
    
    db.heroRatings["Homelander"] = Math.min(99.9, db.heroRatings["Homelander"] + 0.1);
    
    if (isRebel) {
        db.heroRatings["Starlight"] = Math.max(10.0, db.heroRatings["Starlight"] - 1.5);
        db.heroRatings["A-Train"] = Math.max(10.0, db.heroRatings["A-Train"] - 0.5);
    } else {
        db.heroRatings["The Deep"] = Math.min(99.0, db.heroRatings["The Deep"] + 0.5);
    }

    writeDB(db);
    res.json({ success: true, ratings: db.heroRatings });
});

// -------------------------------

// API: Add news (Admin)
app.post('/api/news', (req, res) => {
    const db = readDB();
    const newStory = { id: Date.now(), ...req.body };
    db.news.unshift(newStory); // Add to top
    writeDB(db);
    res.status(201).json(newStory);
});

// API: Subscribe
app.post('/api/subscribe', (req, res) => {
    const db = readDB();
    const { email } = req.body;
    if (!db.subscribers.includes(email)) {
        db.subscribers.push(email);
        writeDB(db);
        res.json({ success: true, message: "Welcome to the Vought family." });
    } else {
        res.status(400).json({ success: false, message: "Already loyal." });
    }
});

// API: Place Order (Cart)
app.post('/api/orders', (req, res) => {
    const db = readDB();
    const order = { id: Date.now(), ...req.body, date: new Date().toISOString() };
    db.orders.push(order);
    writeDB(db);
    res.json({ success: true, orderId: order.id });
});

// API: Get Admin Stats
app.get('/api/admin/stats', (req, res) => {
    const db = readDB();
    res.json({
        newsCount: db.news.length,
        subscribersCount: db.subscribers.length,
        ordersCount: db.orders.length,
        recentOrders: db.orders.slice(-5).reverse(),
        recentNews: db.news.slice(0, 5), // Latest 5 news stories
        allSubscribers: db.subscribers
    });
});

app.listen(PORT, () => {
    console.log(`Vought Mainframe running at http://localhost:${PORT}`);
    console.log(`Admin Dashboard: http://localhost:${PORT}/admin.html`);
});
// backend server updated