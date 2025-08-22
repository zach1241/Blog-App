const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // serve CSS + static files
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

// In-memory posts (reset on restart)
let posts = [];

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Create new post form (optional since we added form on home page)
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// Create post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    posts.push({ id: Date.now(), title, content });
    res.redirect('/');
});

// Edit post form
app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.render('edit', { post });
});

// Update post
app.put('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
    }
    res.redirect('/');
});

// Delete post
app.delete('/posts/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/');
});

// Render needs dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

