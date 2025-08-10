<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Guess The NHL Player</title>
  <link rel="stylesheet" href="css/style.css" />
  <script src="js/game.js" defer></script>
</head>

<body>

  <h1>Guess The NHL Player</h1>

  <div id="choix">
    <label for="nbJoueurs">How many players do you want to guess?</label>
    <select id="nbJoueurs">
      <option value="10" selected>10</option>
      <option value="20">20</option>
      <option value="30">30</option>
      <option value="40">40</option>
      <option value="50">50</option>
    </select>
    <button id="commencer">Start Game</button>
  </div>

  <div id="jeu" style="display:none;">

    <!-- ✅ Indices affichés ici, un par un -->
    <div class="indice" id="indice">
      <!-- Chaque indice sera ajouté ici dans un <p> par JS -->
    </div>

    <input type="text" id="reponse" placeholder="Player's name here..." list="suggestions" autocomplete="off" />
    <datalist id="suggestions"></datalist>

    <button id="boutonNextHint" class="hint">Next Hint</button>

    <div id="boutons-actions">
      <button id="boutonSkip" class="skip">Skip</button>
      <button id="boutonValider">Guess</button>
    </div>

    <div class="message" id="message"></div>
    <div id="progression"></div>
    <button id="boutonRejouer" style="display:none;">Play Again</button>

  </div>

</body>

</html>
