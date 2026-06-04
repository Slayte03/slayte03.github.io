// server.js

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

const NHL_API_BASE = "https://api-web.nhle.com/v1";

// ------------------------------------
// Toutes les équipes NHL
// ------------------------------------
app.get("/teams", async (req, res) => {
  try {
    const response = await fetch(`${NHL_API_BASE}/standings/now`);

    if (!response.ok) {
      throw new Error(`Erreur NHL API: ${response.status}`);
    }

    const data = await response.json();

    const teams = data.standings.map(team => ({
      id: team.teamAbbrev.default,
      name: team.teamName.default,
      commonName: team.teamCommonName.default,
      place: team.placeName.default,
      logo: team.teamLogo
    }));

    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Impossible de récupérer les équipes"
    });
  }
});

// ------------------------------------
// Roster d'une équipe
// Exemple:
// /roster/MTL
// /roster/BOS
// /roster/STL
// ------------------------------------
app.get("/roster/:teamAbbrev", async (req, res) => {
  try {
    const { teamAbbrev } = req.params;

    const response = await fetch(
      `https://api-web.nhle.com/v1/roster/${teamAbbrev.toUpperCase()}/current`
    );

    if (!response.ok) {
      throw new Error(`Erreur NHL API: ${response.status}`);
    }

    const data = await response.json();

    const roster = [
      ...(data.forwards || []),
      ...(data.defensemen || []),
      ...(data.goalies || [])
    ];

    const joueurs = roster.map(player => ({
      id: player.id,
      nom: `${player.firstName?.default || ""} ${player.lastName?.default || ""}`.trim(),
      numero: player.sweaterNumber,
      position: player.positionCode,
      shootsCatches: player.shootsCatches
    }));

    res.json(joueurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Impossible de récupérer le roster"
    });
  }
});

// ------------------------------------
// Informations détaillées d'un joueur
// Exemple:
// /player/8478402
// ------------------------------------
app.get("/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    const response = await fetch(
      `${NHL_API_BASE}/player/${playerId}/landing`
    );

    if (!response.ok) {
      throw new Error(`Erreur NHL API: ${response.status}`);
    }

    const player = await response.json();

    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Impossible de récupérer le joueur"
    });
  }
});

// ------------------------------------
// Classement NHL
// ------------------------------------
app.get("/standings", async (req, res) => {
  try {
    const response = await fetch(
      `${NHL_API_BASE}/standings/now`
    );

    const standings = await response.json();

    res.json(standings);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Impossible de récupérer le classement"
    });
  }
});

// ------------------------------------
// Horaire NHL
// Exemple:
// /schedule/2026-06-03
// ------------------------------------
app.get("/schedule/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const response = await fetch(
      `${NHL_API_BASE}/schedule/${date}`
    );

    const schedule = await response.json();

    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Impossible de récupérer l'horaire"
    });
  }
});

// ------------------------------------
app.listen(PORT, () => {
  console.log(`Serveur démarré : http://localhost:${PORT}`);
});




