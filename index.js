const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const OMDB_API_KEY = "52709a6e"; // Replace with your key

app.get("/movie", async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: "Missing title" });

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OMDb", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));