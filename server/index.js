const express = require("express");
const mongoose = require("mongoose"); //Db connection
const cors = require("cors"); //Cross origin resource sharing
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");
const PostModel = require("./model/Posts");

dotenv.config();
const app = express()
app.use(express.json());

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Connected to MongoDB"))
    .catch(err=> console.log("Failed to connect to MongoDB", err))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`)
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email };
                // console.log(email);
                console.log(user.name);
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No User found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});

// Middleware zum Überprüfen, ob der Benutzer authentifiziert ist
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json("Unauthorized");
    }
};

// Neuen Post erstellen
app.post("/posts", isAuthenticated, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.session.user.id; // User-ID aus der Session

        const newPost = new PostModel({
            user: userId,
            content,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Alle Posts abrufen
app.get("/posts", isAuthenticated, async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate("user", "name email") // Benutzerinformationen abrufen (z.B. Name und E-Mail)
            .populate("comments.user", "name email") // Kommentarautoren abrufen
            .exec();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like hinzufügen
app.post("/posts/:postId/like", isAuthenticated, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.session.user.id;

        const post = await PostModel.findById(postId);
        if (!post.likes.includes(userId)) {
            post.likes.push(userId); // User-ID zum Like-Array hinzufügen
        } else {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Kommentar hinzufügen
app.post("/posts/:postId/comment", isAuthenticated, async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        const userId = req.session.user.id;

        const post = await PostModel.findById(postId);
        post.comments.push({
            user: userId,
            comment: comment,
        });

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});