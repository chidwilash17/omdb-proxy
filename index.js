const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const OMDB_API_KEY = "52709a6e"; // Replace with your actual OMDb API key

// Route 1: /movie?title=...&year=...&id=...
app.get("/movie", async (req, res) => {
  const { title, year, id } = req.query;

  if (!title && !id) {
    return res.status(400).json({ error: "Missing title or IMDb ID" });
  }

  let omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;
  if (id) {
    omdbUrl += `&i=${encodeURIComponent(id)}`;
  } else {
    omdbUrl += `&t=${encodeURIComponent(title)}`;
  }
  if (year) {
    omdbUrl += `&y=${encodeURIComponent(year)}`;
  }

  try {
    const response = await fetch(omdbUrl);
    const data = await response.json();
    console.log(`OMDb response for ${title || id}:`, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OMDb", details: err.message });
  }
});

// Route 2: OMDb-style /?t=...&y=...&i=...
app.get("/", async (req, res) => {
  const { t, s, y, i } = req.query;

  if (!t && !s && !i) {
    return res.status(400).json({ error: "Missing title, search query, or IMDb ID" });
  }

  let omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

  if (i) {
    omdbUrl += `&i=${encodeURIComponent(i)}`;
  } else if (t) {
    omdbUrl += `&t=${encodeURIComponent(t)}`;
  } else if (s) {
    omdbUrl += `&s=${encodeURIComponent(s)}&type=movie`;
  }

  if (y) {
    omdbUrl += `&y=${encodeURIComponent(y)}`;
  }

  try {
    const response = await fetch(omdbUrl);
    const data = await response.json();
    console.log(`OMDb response for ${t || s || i}:`, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OMDb", details: err.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OMDb proxy running on port ${PORT}`));
