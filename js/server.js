const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Toutes les équipes
app.get('/teams', async (req, res) => {
  try {
    const teams = await fetch('https://statsapi.web.nhl.com/api/v1/teams').then(r => r.json());
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les équipes NHL' });
  }
});

// Roster d'une équipe
app.get('/roster/:teamId', async (req, res) => {
  try {
    const roster = await fetch(`https://statsapi.web.nhl.com/api/v1/teams/${req.params.teamId}/roster`).then(r => r.json());
    res.json(roster);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer le roster' });
  }
});

// Infos joueur
app.get('/player/:playerId', async (req, res) => {
  try {
    const player = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${req.params.playerId}`).then(r => r.json());
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer le joueur' });
  }
});

app.listen(3000, () => console.log('Proxy NHL API running on http://localhost:3000'));
