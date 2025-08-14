// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

const NHL_API_BASE = "https://api-web.nhle.com/api/v1";

// -------------------------
// Endpoint pour récupérer toutes les équipes
// -------------------------
app.get("/teams", async (req, res) => {
  try {
    const response = await fetch(`${NHL_API_BASE}/teams`);
    if (!response.ok) {
      console.error("Erreur NHL API:", response.status, response.statusText);
      return res.json([]); // retourne un tableau vide si l'API échoue
    }

    const data = await response.json();
    if (!data.teams || !Array.isArray(data.teams)) {
      console.warn("Format inattendu des données NHL:", data);
      return res.json([]);
    }

    res.json(data.teams);
  } catch (err) {
    console.error("Erreur fetch NHL Teams:", err);
    res.json([]);
  }
});

// -------------------------
// Endpoint pour récupérer le roster d'une équipe
// -------------------------
app.get("/roster/:teamId", async (req, res) => {
  const { teamId } = req.params;
  try {
    const response = await fetch(`${NHL_API_BASE}/teams/${teamId}?expand=team.roster`);
    if (!response.ok) {
      console.error(`Erreur NHL Roster ${teamId}:`, response.status, response.statusText);
      return res.json({ roster: [] });
    }

    const data = await response.json();
    const roster = data?.teams?.[0]?.roster?.roster;
    if (!Array.isArray(roster)) return res.json({ roster: [] });

    res.json({ roster });
  } catch (err) {
    console.error(`Erreur fetch roster ${teamId}:`, err);
    res.json({ roster: [] });
  }
});

// -------------------------
app.listen(PORT, () => {
  console.log(`Proxy NHL API running on http://localhost:${PORT}`);
});




