const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

const NHL_API_BASE = "https://api-web.nhle.com/v1";

// 🔥 CACHE
const rosterCache = {};

// ------------------------------------
// TEAMS
// ------------------------------------
app.get("/teams", async (req, res) => {
  try {
    const response = await fetch(`${NHL_API_BASE}/standings/now`);
    const data = await response.json();

    const teams = (data.standings || [])
      .map(t => ({
        id: t.teamAbbrev?.default,
        name: t.teamName?.default,
        commonName: t.teamCommonName?.default
      }))
      .filter(t => t.id);

    res.json(teams);
  } catch (err) {
    console.error(err);
    res.json([]); // 🔥 jamais 500
  }
});

// ------------------------------------
// ROSTER (SAFE + CACHE)
// ------------------------------------
app.get("/roster/:teamAbbrev", async (req, res) => {
  const teamAbbrev = req.params.teamAbbrev?.toUpperCase();

  try {
    // 🔥 CACHE HIT
    if (rosterCache[teamAbbrev]) {
      return res.json(rosterCache[teamAbbrev]);
    }

    const response = await fetch(
      `${NHL_API_BASE}/roster/${teamAbbrev}/current`
    );

    if (!response.ok) {
      console.warn("Roster API fail:", teamAbbrev);
      rosterCache[teamAbbrev] = [];
      return res.json([]);
    }

    const data = await response.json();

    const roster =
      Array.isArray(data?.forwards) ||
      Array.isArray(data?.defensemen) ||
      Array.isArray(data?.goalies)
        ? [
            ...(data.forwards || []),
            ...(data.defensemen || []),
            ...(data.goalies || [])
          ]
        : [];

    const players = roster.map(p => ({
      id: p.id,
      nom: `${p.firstName?.default || ""} ${p.lastName?.default || ""}`.trim(),
      numero: p.sweaterNumber ?? "?",
      position: p.positionCode ?? "?",
      shootsCatches: p.shootsCatches ?? "?"
    }));

    // 🔥 STORE CACHE
    rosterCache[teamAbbrev] = players;

    return res.json(players);
  } catch (err) {
    console.error("ROSTER ERROR:", teamAbbrev, err);

    rosterCache[teamAbbrev] = [];
    return res.json([]); // 🔥 IMPORTANT
  }
});

app.listen(PORT, () => {
  console.log(`Serveur OK http://localhost:${PORT}`);
});



