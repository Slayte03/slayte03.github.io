// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// -------------------------
// Endpoint pour récupérer toutes les équipes
// -------------------------
app.get("/teams", async (req, res) => {
  try {
    // Exemple endpoint API LNH
    const response = await fetch("https://api-web.nhle.com/api/v1/teams"); 
    if (!response.ok) {
      console.error("Erreur NHL API:", response.status, response.statusText);
      return res.json([]);
    }

    const data = await response.json();
    // Selon la structure de l'API nhle.com, tu devras peut-être adapter
    // par ex. data.data.teams ou autre
    res.json(data?.teams || []);
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
    const response = await fetch(`https://api-web.nhle.com/api/v1/teams/${teamId}/roster`); 
    if (!response.ok) {
      console.error(`Erreur NHL Roster ${teamId}:`, response.status, response.statusText);
      return res.json({ roster: [] });
    }

    const data = await response.json();
    // Adapter en fonction du JSON retourné par nhle.com
    const roster = data?.roster || [];
    res.json({ roster });
  } catch (err) {
    console.error(`Erreur fetch roster ${teamId}:`, err);
    res.json({ roster: [] });
  }
});

// -------------------------
// Endpoint pour récupérer un joueur par ID
// -------------------------
app.get("/player/:playerId", async (req, res) => {
  const { playerId } = req.params;
  try {
    const response = await fetch(`https://api-web.nhle.com/api/v1/people/${playerId}`);
    if (!response.ok) {
      console.error(`Erreur NHL Player ${playerId}:`, response.status, response.statusText);
      return res.json({ people: [] });
    }

    const data = await response.json();
    const people = data?.people || [];
    res.json({ people });
  } catch (err) {
    console.error(`Erreur fetch player ${playerId}:`, err);
    res.json({ people: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy NHL API running on http://localhost:${PORT}`);
});


