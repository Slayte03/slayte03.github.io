// -------------------------
// 0️⃣ Récupération des éléments HTML
// -------------------------
const datalist = document.getElementById("suggestions");
const divJeu = document.getElementById("jeu");
const btnCommencer = document.getElementById("commencer");
const selectNbJoueurs = document.getElementById("nbJoueurs");
const reponseInput = document.getElementById("reponse");
const indiceDiv = document.getElementById("indice");
const messageDiv = document.getElementById("message");
const progressionDiv = document.getElementById("progression");
const boutonValider = document.getElementById("boutonValider");
const boutonSkip = document.getElementById("boutonSkip");
const boutonHint = document.getElementById("boutonNextHint");
const boutonRejouer = document.getElementById("boutonRejouer");
const API_BASE = "https://nhl-api-backend.onrender.com";

// Variables du jeu
let joueursParEquipe = {};
let joueurs = [];
let joueurIndex = 0;
let indiceIndex = 0;
let essaisRestants = 5;
let score = 0;
let enAttenteDeSuivant = false;

function getFlagImg(country) {
  if (!country || country === "?") return "?";

  const map = {
    CAN: "ca",
    USA: "us",
    SWE: "se",
    FIN: "fi",
    CZE: "cz",
    RUS: "ru",
    SUI: "ch",
    GER: "de",
    FRA: "fr",
    DEN: "dk",
    NOR: "no"
  };

  const code = map[country] || country.toLowerCase();
  return `<img src="https://flagcdn.com/24x18/${code}.png" style="vertical-align:middle; margin-left:5px;">`;
}

const ROSTER_CACHE_KEY = "nhl-rosters-v3";
const ROSTER_CACHE_TTL = 60 * 60 * 1000;
let loading = false;

function loadCache() {
  try {
    const stored = JSON.parse(localStorage.getItem(ROSTER_CACHE_KEY) || "null");
    if (!stored || stored.expires <= Date.now() || !stored.complete) return false;
    const teams = Object.values(stored.teams || {});
    if (!teams.length || teams.some(players => !Array.isArray(players) || !players.length)) return false;
    joueursParEquipe = stored.teams;
    return true;
  } catch { return false; }
}

async function apiJSON(path) {
  // One automatic retry on 429, with a visible countdown. Longer cooldowns
  // return a message rather than leaving the game loading indefinitely.
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(`${API_BASE}${path}`, {
      signal: AbortSignal.timeout(90000)
    });
    const data = await response.json();
    if (response.ok) return data;
    if (response.status === 429) {
      const seconds = Math.max(1, Math.ceil(Number(data.retryAfter) || 60));
      if (attempt === 0 && seconds <= 60) {
        for (let remaining = seconds; remaining > 0; remaining--) {
          messageDiv.textContent = `NHL is busy. Retrying in ${remaining}s…`;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        continue;
      }
      throw new Error(`NHL is busy. Try again in ${seconds} seconds.`);
    }
    throw new Error(data.error || `Request failed (${response.status}).`);
  }
}

function getDraftHint(player) {
  return player.draftYear === null ? "Undrafted" : `Draft ${player.draftYear ?? "?"}`;
}

function buildHints(player) {
  return [
    `#${player.numero} ${player.team}`,
    player.position === "G"
      ? `Catches ${player.shootsCatches ?? "?"}`
      : `Shoots ${player.shootsCatches ?? "?"}`,
    `Position ${player.position ?? "?"}`,
    `Age ${player.age ?? "?"}`,
    `Nationality ${getFlagImg(player.nationality)}`,
    getDraftHint(player)
  ];
}

async function loadAllTeams() {
  const teams = await apiJSON("/teams");
  if (!Array.isArray(teams) || !teams.length) throw new Error("No NHL teams available.");
  const complete = {};
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const name = team.commonName || team.name;
    messageDiv.textContent = `Loading teams ${i + 1}/${teams.length}…`;
    const players = await apiJSON(`/roster/${encodeURIComponent(team.id)}`);
    if (!Array.isArray(players) || !players.length) {
      throw new Error(`Could not load ${name}. Please try again.`);
    }
    complete[team.id] = players.map(player => ({ ...player, team: name }));
  }
  // Publish and cache only after every team succeeds.
  joueursParEquipe = complete;
  try {
    localStorage.setItem(ROSTER_CACHE_KEY, JSON.stringify({
      complete: true, expires: Date.now() + ROSTER_CACHE_TTL, teams: complete
    }));
  } catch (error) { console.warn("Could not save roster cache", error); }
}

// -------------------------
// 3️⃣ Fonctions utilitaires du jeu
// -------------------------
function getAllPlayers() {
  return Object.values(joueursParEquipe).flat().filter(player => {
    const number = String(player.numero ?? "").trim();
    return /^\d{1,2}$/.test(number) && Number(number) >= 1 && player.id;
  });
}

function revealPlayer(joueur) {
  const reveal = joueur.indices;

  indiceDiv.innerHTML = `
    <div>
      <strong>Answer:</strong>
      <span style="color:green;font-weight:bold;">
        ${joueur.nom}
      </span>
    </div>
    <div>
      ${reveal.join(" / ")}
    </div>
  `;
}

function melangerArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function remplirSuggestions() {
  const tousLesNoms = getAllPlayers()
    .map(j => j.nom)
    .filter((v, i, self) => self.indexOf(v) === i)
    .sort((a, b) => a.localeCompare(b));
  datalist.innerHTML = "";
  tousLesNoms.forEach(nom => {
    const option = document.createElement("option");
    option.value = nom;
    datalist.appendChild(option);
  });
}

async function initialiserJeu(nb) {
  const copie = getAllPlayers().map(player => ({ ...player }));
  melangerArray(copie);
  const selected = copie.slice(0, nb);
  if (!selected.length) throw new Error("No players with known jersey numbers available.");
  for (let i = 0; i < selected.length; i++) {
    messageDiv.textContent = `Loading draft details ${i + 1}/${selected.length}…`;
    const details = await apiJSON(`/player/${selected[i].id}`);
    if (details.id !== Number(selected[i].id) ||
        !(details.draftYear === null || Number.isInteger(details.draftYear))) {
      throw new Error("Invalid draft details. Please try again.");
    }
    selected[i].draftYear = details.draftYear;
    selected[i].indices = buildHints(selected[i]);
  }
  joueurs = selected;
  remplirSuggestions();
}

function afficherIndice() {
  const joueur = joueurs[joueurIndex];
  if (!joueur || indiceIndex === "reveal") return;

  indiceDiv.innerHTML = joueur.indices.join(" / ");

  // All hints are visible, so hide the Next Hint button.
  boutonHint.style.display = "none";

  progressionDiv.textContent =
    `Player ${joueurIndex + 1} / ${joueurs.length} — Score : ${score}`;

  messageDiv.textContent = ``;
  reponseInput.value = "";
  reponseInput.focus();
}

function passeAuJoueurSuivant() {
  joueurIndex++;
  indiceIndex = 0;
  essaisRestants = 5;

  indiceDiv.textContent = "";

  reponseInput.style.display = "inline-block";

  if (joueurIndex >= joueurs.length) {
    finDeJeu();
    return;
  }

  progressionDiv.textContent =
    `Player ${joueurIndex + 1} / ${joueurs.length} — Score : ${score}`;

  enAttenteDeSuivant = false;
  boutonValider.textContent = "Guess";
  boutonHint.style.display = "inline-block";
  boutonSkip.style.display = "inline-block";

  afficherIndice();

  // 🔥 SHOW INPUT BACK
  reponseInput.style.display = "inline-block";
}

function finDeJeu() {
  enAttenteDeSuivant = false;
  messageDiv.style.color = "";
  indiceDiv.textContent = "The Game is Over !";
  messageDiv.textContent = `Your Final Score Is ${score} Out of ${joueurs.length}. Thanks For Playing!`;
  reponseInput.style.display = "none";
  boutonValider.style.display = "none";
  progressionDiv.textContent = "";
  boutonSkip.style.display = "none";
  boutonHint.style.display = "none";
  boutonRejouer.style.display = "inline-block";
}

// -------------------------
// 4️⃣ Gestion des événements
// -------------------------
boutonSkip.addEventListener("click", () => {
  const joueur = joueurs[joueurIndex];
  if (!joueur) return;

  messageDiv.textContent = "";
  revealPlayer(joueur);
  indiceIndex = "reveal";


  reponseInput.style.display = "none";

  boutonValider.textContent = "Next";
  enAttenteDeSuivant = true;

  boutonHint.style.display = "none";
  boutonSkip.style.display = "none";
});

boutonValider.addEventListener("click", () => {
  const joueur = joueurs[joueurIndex];
  if (!joueur) return;

  if (enAttenteDeSuivant) {
    passeAuJoueurSuivant();
    return;
  }

  const reponse = reponseInput.value.trim().toLowerCase();
  const bonneReponse = joueur.nom.toLowerCase();

  messageDiv.style.fontStyle = "normal";
  messageDiv.style.color = "";

  if (reponse === "") {
    messageDiv.textContent = "Enter a valid name";

    setTimeout(() => {
      if (messageDiv.textContent === "Enter a valid name") {
        messageDiv.textContent = "";
      }
    }, 1500);

    return;
  }

  if (reponse === bonneReponse) {
    score++;
    messageDiv.textContent = "Good Answer";
    messageDiv.style.color = "green";

    revealPlayer(joueur);
    indiceIndex = "reveal";

    reponseInput.style.display = "none";
    boutonValider.textContent = "Next";
    enAttenteDeSuivant = true;

    boutonHint.style.display = "none";
    boutonSkip.style.display = "none";
  } else {
    revealPlayer(joueur);
    indiceIndex = "reveal";

    messageDiv.textContent = "Wrong Answer!";
    messageDiv.style.color = "red";
    reponseInput.style.display = "none";

    boutonValider.textContent = "Next";
    enAttenteDeSuivant = true;

    boutonHint.style.display = "none";
    boutonSkip.style.display = "none";
  }
});

boutonRejouer.addEventListener("click", () => {
  joueurIndex = 0;
  indiceIndex = 0;
  essaisRestants = 5;
  score = 0;
  enAttenteDeSuivant = false;
  messageDiv.style.color = "";

  divJeu.style.display = "none";
  document.getElementById("choix").style.display = "block";

  // Réaffichage des éléments du jeu
  reponseInput.style.display = "inline-block";
  boutonValider.style.display = "inline-block";
  boutonSkip.style.display = "inline-block";
  boutonHint.style.display = "inline-block";
  boutonRejouer.style.display = "none";

  // Réinitialisation des messages et indices
  indiceDiv.textContent = "";
  messageDiv.textContent = "";
});

boutonHint.addEventListener("click", () => {
  if (essaisRestants <= 1) {
    messageDiv.textContent = "No hints left.";
    setTimeout(afficherIndice, 2000);
    return;
  }
  essaisRestants--;
  afficherIndice();
});

btnCommencer.addEventListener("click", async () => {
  if (loading) return;
  const nb = parseInt(selectNbJoueurs.value, 10);
  if (!Number.isInteger(nb) || nb <= 0) {
    alert("Please select a valid number of players.");
    return;
  }
  loading = true;
  btnCommencer.disabled = true;
  document.getElementById("choix").style.display = "none";
  divJeu.style.display = "block";
  for (const element of [reponseInput, boutonValider, boutonSkip, boutonHint, boutonRejouer]) {
    element.style.display = "none";
  }
  joueurs = [];
  joueurIndex = 0;
  indiceIndex = 0;
  score = 0;
  enAttenteDeSuivant = false;
  messageDiv.style.color = "";
  messageDiv.textContent = "Loading players…";
  indiceDiv.textContent = "";
  progressionDiv.textContent = "";
  try {
    if (!loadCache()) await loadAllTeams();
    await initialiserJeu(nb);
    boutonValider.textContent = "Guess";
    reponseInput.style.display = "inline-block";
    boutonValider.style.display = "inline-block";
    boutonSkip.style.display = "inline-block";
    afficherIndice();
  } catch (error) {
    console.error(error);
    joueurs = [];
    messageDiv.style.color = "red";
    messageDiv.textContent = error.name === "TimeoutError"
      ? "The server took too long. Please try again."
      : error.message;
    boutonRejouer.style.display = "inline-block";
  } finally {
    loading = false;
    btnCommencer.disabled = false;
  }
});

function clearNHLCache() {
  localStorage.removeItem(ROSTER_CACHE_KEY);
}

