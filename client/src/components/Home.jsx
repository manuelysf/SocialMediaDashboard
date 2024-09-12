import { Grid2, Paper, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom'

export const Home = () => {
  const location = useLocation();
  const user = location.state?.user;
  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "black",
    borderRadius: "0.5rem",
  };

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Holen und aktualisieren der Posts
  useEffect(() => {
    const fetchPosts = () => {
      axios.get("http://localhost:3001/posts")
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    };

    fetchPosts();
    const intervalId = setInterval(fetchPosts, 5000); // alle 5 Sekunden aktualisieren

    return () => clearInterval(intervalId); // Aufräumen des Intervalls, wenn die Komponente demontiert wird
  }, []);

  // Neuen Post hinzufügen
  const handlePostSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/posts", { content: newPost })
      .then((response) => {
        setNewPost("");
        setPosts([response.data, ...posts]); // neuen Post hinzufügen
        console.log("Post hinzugefügt");
      })
      .catch((error) => {
        console.error("Error posting:", error);
      });
  };

  // Post liken
  const handleLike = (postId) => {
    axios.post(`http://localhost:3001/posts/${postId}/like`)
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: response.data.likes } : post
          )
        );
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  // UI Layout
  return (
    <Grid2 container spacing={2} style={{ padding: "20px" }}>
    {/* Rechte Spalte für neuen Post */}
    <Grid2 item xs={12} md={4}>
      <Paper elevation={3} style={{ padding: "1rem" }}>
        <Typography variant="h5" gutterBottom>Verfasse einen neuen Post</Typography>
        <form onSubmit={handlePostSubmit}>
          <TextField
            label="Was möchtest du posten?"
            multiline
            rows={4}
            fullWidth
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            variant="outlined"
            required
          />
          <Button type="submit" variant="contained" color="primary" style={btnStyle}>
            Posten
          </Button>
        </form>
      </Paper>
    </Grid2>

    {/* Linke Spalte für Posts */}
    <Grid2 item xs={12} md={8}>
      {posts.map((post) => (
        <Card key={post._id} style={{ marginBottom: "1rem" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{post.user.name}</Typography>
            <Typography variant="body1" gutterBottom>{post.content}</Typography>
            <Typography variant="body2" color="textSecondary">Likes: {post.likes.length}</Typography>
            <Button
              variant="outlined"
              onClick={() => handleLike(post._id)}
              style={{ marginTop: "10px" }}
            >
              Like
            </Button>
          </CardContent>
        </Card>
      ))}
    </Grid2>
  </Grid2>
  )
}
