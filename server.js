const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATA STORE (In Memory) ---
// Note: These reset if you restart the server. 
// For a real app, you'd use a database file.
let users = [];     
let projects = [];  

// --- AUTH ROUTES ---

// 1. Register
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    console.log(`[Register Attempt] User: ${username}`);

    if (!username || !password) {
        return res.json({ success: false, message: "Missing username or password." });
    }
    
    // Check if user exists
    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "Username already taken." });
    }

    users.push({ username, password });
    console.log(`[Success] User ${username} created.`);
    res.json({ success: true, message: "Account created!" });
});

// 2. Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`[Login Attempt] User: ${username}`);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log(`[Success] User ${username} logged in.`);
        res.json({ success: true, username: user.username });
    } else {
        console.log(`[Failed] Invalid credentials for ${username}`);
        res.json({ success: false, message: "Invalid username or password." });
    }
});

// --- PROJECT ROUTES ---

app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/publish', (req, res) => {
    const { title, author, html, css, js } = req.body;

    if (projects.find(p => p.title === title)) {
        return res.json({ success: false, message: "A project with this name already exists!" });
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
    console.log(`[Published] Project: ${title} by ${author}`);
    res.json({ success: true, message: "Project Published!" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("---------------------------------------");
});
