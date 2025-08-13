const datalist = document.getElementById("suggestions");
const divJeu = document.getElementById("jeu");
const btnCommencer = document.getElementById("commencer");
const selectNbJoueurs = document.getElementById("nbJoueurs");

let joueurs = [];
let joueurIndex = 0;
let indiceIndex = 0;
let essaisRestants = 4;
let score = 0;
let enAttenteDeSuivant = false;

const boutonSkip = document.getElementById("boutonSkip");
const indiceDiv = document.getElementById("indice");
const reponseInput = document.getElementById("reponse");
const boutonValider = document.getElementById("boutonValider");
const messageDiv = document.getElementById("message");
const progressionDiv = document.getElementById("progression");
const boutonRejouer = document.getElementById("boutonRejouer");
const boutonHint = document.getElementById("boutonNextHint");

function remplirSuggestions() {
    const tousLesNoms = getAllPlayers()
        .map(j => j.nom)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a.localeCompare(b));
    datalist.innerHTML = "";
    tousLesNoms.forEach(nom => {
        const option = document.createElement("option");
        option.value = nom;
        datalist.appendChild(option);
    });
}

function melangerArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getAllPlayers() {
    let tousLesJoueurs = [];
    for (const equipe in joueursParEquipe) {
        tousLesJoueurs = tousLesJoueurs.concat(joueursParEquipe[equipe]);
    }
    return tousLesJoueurs;
}

function initialiserJeu(nb) {
    const copie = JSON.parse(JSON.stringify(getAllPlayers()));
    melangerArray(copie);
    joueurs = copie.slice(0, nb);
    remplirSuggestions();
}

function afficherIndice() {
    const joueur = joueurs[joueurIndex];

    if (indiceIndex < joueur.indices.length) {
        const indicesActuels = joueur.indices.slice(0, indiceIndex + 1).join(" / ");
        indiceDiv.textContent = `Hint ${indiceIndex + 1} : ${indicesActuels}`;
        indiceIndex++;
    }

    progressionDiv.textContent = `Player ${joueurIndex + 1} / ${joueurs.length} — Score : ${score}`;
    messageDiv.textContent = `Guesses Left : ${essaisRestants}`;
    reponseInput.value = "";
    reponseInput.focus();
}

function passeAuJoueurSuivant() {
    joueurIndex++;
    indiceIndex = 0;
    essaisRestants = 4;
    indiceDiv.textContent = "";

    if (joueurIndex >= joueurs.length) {
        finDeJeu();
        return;
    }

    progressionDiv.textContent = `Player ${joueurIndex + 1} / ${joueurs.length} — Score : ${score}`;
    enAttenteDeSuivant = false;
    boutonValider.textContent = "Guess";
    boutonHint.style.display = "inline-block";
    boutonSkip.style.display = "inline-block";

    afficherIndice();
}

function finDeJeu() {
    indiceDiv.textContent = "The Game is Over !";
    messageDiv.textContent = `Your Final Score Is ${score} Out of ${joueurs.length}. Thanks For Playing!`;
    reponseInput.style.display = "none";
    boutonValider.style.display = "none";
    progressionDiv.textContent = "";
    boutonSkip.style.display = "none";
    boutonHint.style.display = "none";
    boutonRejouer.style.display = "inline-block";
}

boutonSkip.addEventListener("click", () => {
    const joueur = joueurs[joueurIndex];
    boutonValider.textContent = "Next";
    boutonValider.style.marginTop = "4px";
    enAttenteDeSuivant = true;
    boutonHint.style.display = "none";
    boutonSkip.style.display = "none";
    messageDiv.innerHTML = `Skipped! The correct answer was <span style="color: green;">${joueur.nom}</span>.`;
});

boutonValider.addEventListener("click", () => {
    if (enAttenteDeSuivant) {
        passeAuJoueurSuivant();
        boutonValider.textContent = "Guess";
        enAttenteDeSuivant = false;
        return;
    }

    const joueur = joueurs[joueurIndex];
    const reponse = reponseInput.value.trim().toLowerCase();
    const bonneReponse = joueur.nom.toLowerCase();

    if (reponse === "") {
        messageDiv.textContent = "Enter a valid name";
        messageDiv.style.fontStyle = "Italic";
        setTimeout(() => {
            messageDiv.textContent = `Guesses Left: ${essaisRestants}`;
            messageDiv.style.fontStyle = "Normal";
        }, 2000);
        return;
    }

    if (reponse === bonneReponse) {
        score++;
        messageDiv.innerHTML = `Nice Work! It was <span style="color: green;">${joueur.nom}</span> ! 🎉`;
        boutonValider.textContent = "Next";
        boutonValider.style.marginTop = "4px";
        enAttenteDeSuivant = true;
        boutonHint.style.display = "none";
        boutonSkip.style.display = "none";
    } else {
        essaisRestants--;
        if (essaisRestants === 0) {
            messageDiv.innerHTML = `Oops, The Answer Was <span style="color: green;">${joueur.nom}</span>.`;
            boutonValider.textContent = "Next";
            boutonValider.style.marginTop = "4px";
            enAttenteDeSuivant = true;
            boutonHint.style.display = "none";
            boutonSkip.style.display = "none";
        } else {
            messageDiv.textContent = `Wrong Player. Guesses Left: ${essaisRestants}. New Hint.`;
            setTimeout(afficherIndice, 2000);
        }
    }
});

boutonRejouer.addEventListener("click", () => {
    joueurIndex = 0;
    indiceIndex = 0;
    essaisRestants = 4;
    score = 0;
    divJeu.style.display = "none";
    document.getElementById("choix").style.display = "block";
    reponseInput.style.display = "inline-block";
    boutonValider.style.display = "inline-block";
    boutonSkip.style.display = "inline-block";
    boutonHint.style.display = "inline-block";
    boutonRejouer.style.display = "none";
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

btnCommencer.addEventListener("click", () => {
    const nbJoueurs = parseInt(selectNbJoueurs.value, 10);
    if (isNaN(nbJoueurs) || nbJoueurs <= 0) {
        alert("Please select a valid number of players.");
        return;
    }
    document.getElementById("choix").style.display = "none";
    divJeu.style.display = "block";
    boutonHint.style.display = "inline-block";

    joueurIndex = 0;
    indiceIndex = 0;
    essaisRestants = 4;
    score = 0;
    initialiserJeu(nbJoueurs);
    afficherIndice();
});

