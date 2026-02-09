const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 2001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATA STORE (In Memory) ---
let users = [];     // Stores { username, password }
let projects = [];  // Stores { title, author, html, css, js, date }

// --- AUTH ROUTES ---

// 1. Register
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    // Check if user exists
    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "Username already taken." });
    }

    users.push({ username, password });
    res.json({ success: true, message: "Account created!" });
});

// 2. Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, username: user.username });
    } else {
        res.json({ success: false, message: "Invalid credentials." });
    }
});

// --- PROJECT ROUTES ---

app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/publish', (req, res) => {
    const { title, author, html, css, js } = req.body;

    // Check for duplicate names
    if (projects.find(p => p.title === title)) {
        return res.json({ success: false, message: "A project with this name already exists." });
    }
    
    const newProject = {
        id: Date.now(),
        title,
        author,
        html,
        css,
        js,
        date: new Date().toLocaleDateString()
    };
    
    projects.push(newProject);
    res.json({ success: true, message: "Project Published!" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
