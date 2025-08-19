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

// Variables du jeu
let joueursParEquipe = {};
let joueurs = [];
let joueurIndex = 0;
let indiceIndex = 0;
let essaisRestants = 4;
let score = 0;
let enAttenteDeSuivant = false;

// ---------------------------------------------------------
// 1️⃣ Équipes locales pour fallback ou rapidité
// ---------------------------------------------------------
const localTeams = {
    "Anaheim Ducks": [
            //Attaquants
            { nom: "Ryan Strome", indices: ["#16 Anaheim Ducks", "Shoots Right", "(C)", "Draft 2011"] },
            { nom: "Alex Killorn", indices: ["#17 Anaheim Ducks", "Shoots Left", "(RW)", "Draft 2007"] },
            { nom: "Troy Terry", indices: ["#19 Anaheim Ducks", "Shoots Right", "(RW)", "Draft 2015"] },
            { nom: "Chris Kreider", indices: ["#20 Anaheim Ducks", "Shoots Left", "(LW)", "Draft 2009"] },
            { nom: "Mason McTavish", indices: ["#23 Anaheim Ducks", "Shoots Left", "(C)", "Draft 2021"] },
            { nom: "Ryan Poehling", indices: ["#25 Anaheim Ducks", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Jansen Harkins", indices: ["#38 Anaheim Ducks", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Ross Johnston", indices: ["#44 Anaheim Ducks", "Shoots Left", "(LW)", "Undrafted"] },
            { nom: "Cutter Gauthier", indices: ["#61 Anaheim Ducks", "Shoots Left", "(LW)", "Draft 2022"] },
            { nom: "Mikael Granlund", indices: ["#64 Anaheim Ducks", "Shoots Left", "(C)", "Draft 2010"] },
            { nom: "Frank Vatrano", indices: ["#77 Anaheim Ducks", "Shoots Left", "(LW)", "Undrafted"] },
            { nom: "Leo Carlsson", indices: ["#91 Anaheim Ducks", "Shoots Left", "(C)", "Draft 2023"] },
            //{ nom: "Sam Colangelo", indices: ["# Anaheim Ducks", "Shoots Right", "(RW)", "Draft 2020"] },

            //Défenseurs
            { nom: "Jackson LaCombe", indices: ["#2 Anaheim Ducks", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Radko Gudas", indices: ["#7 Anaheim Ducks", "Shoots Right", "(RD)", "Draft 2010"] },
            { nom: "Drew Helleson", indices: ["#14 Anaheim Ducks", "Shoots Right", "(RD)", "Draft 2019"] },
            { nom: "Olen Zellweger", indices: ["#51 Anaheim Ducks", "Shoots Left", "(LD)", "Draft 2021"] },
            { nom: "Jacob Trouba", indices: ["#65 Anaheim Ducks", "Shoots Right", "(RD)", "Draft 2012"] },
            { nom: "Tristan Luneau", indices: ["#67 Anaheim Ducks", "Shoots Right", "(RD)", "Draft 2022"] },
            { nom: "Pavel Mintyukov", indices: ["#98 Anaheim Ducks", "Shoots Left", "(LD)", "Draft 2022"] },

            //Gardiens
            { nom: "Lukas Dostal", indices: ["#1 Anaheim Ducks", "Catches Left", "(G)", "Draft 2018"] },
            { nom: "Ville Husso", indices: ["#33 Anaheim Ducks", "Catches Left", "(G)", "Draft 2014"] },
            { nom: "Petr Mrazek", indices: ["#34 Anaheim Ducks", "Catches Left", "(G)", "Draft 2010"] },
        ],

        "Calgary Flames": [
            //Attaquants
            { nom: "Jonathan Huberdeau", indices: ["#10 Calgary Flames", "Shoots Left", "(LW)", "Draft 2011"] },
            { nom: "Nazem Kadri", indices: ["#91 Calgary Flames", "Shoots Left", "(C)", "Draft 2009"] },
            { nom: "Yegor Sharangovich", indices: ["#17 Calgary Flames", "Shoots Left", "(C)", "Draft 2018"] },
            { nom: "Joel Farabee", indices: ["#86 Calgary Flames", "Shoots Left", "(LW)", "Draft 2018"] },
            { nom: "Mikael Backlund", indices: ["#11 Calgary Flames", "Shoots Left", "(C)", "Draft 2007"] },
            { nom: "Blake Coleman", indices: ["#20 Calgary Flames", "Shoots Left", "(LW)", "Draft 2011"] },
            { nom: "Matt Coronato", indices: ["#27 Calgary Flames", "Shoots Right", "(RW)", "Draft 2021"] },
            { nom: "Morgan Frost", indices: ["#16 Calgary Flames", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Adam Klapka", indices: ["#43 Calgary Flames", "Shoots Right", "(RW)", "Draft Undrafted"] },
            { nom: "Connor Zary", indices: ["#47 Calgary Flames", "Shoots Left", "(C)", "Draft 2020"] },
            { nom: "Ryan Lomberg", indices: ["#70 Calgary Flames", "Shoots Left", "(LW)", "Draft Undrafted"] },
            { nom: "Martin Pospisil", indices: ["#76 Calgary Flames", "Shoots Left", "(C)", "Draft 2018"] },
            { nom: "Justin Kirkland", indices: ["#58 Calgary Flames", "Shoots Left", "(C)", "Draft 2014"] },
            { nom: "Dryden Hunt", indices: ["#15 Calgary Flames", "Shoots Left", "(LW)", "Draft Undrafted"] },

            //Défenseurs
            { nom: "Rasmus Andersson", indices: ["#4 Calgary Flames", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "Kevin Bahl", indices: ["#7 Calgary Flames", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Jake Bean", indices: ["#24 Calgary Flames", "Shoots Left", "(LD)", "Draft 2016"] },
            { nom: "Joel Hanley", indices: ["#44 Calgary Flames", "Shoots Left", "(LD)", "Draft Undrafted"] },
            { nom: "MacKenzie Weegar", indices: ["#52 Calgary Flames", "Shoots Right", "(LD)", "Draft 2013"] },
            { nom: "Daniil Miromanov", indices: ["#62 Calgary Flames", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Brayden Pachal", indices: ["#94 Calgary Flames", "Shoots Right", "(RD)", "Draft Undrafted"] },

            //Gardiens
            { nom: "Dustin Wolf", indices: ["#32 Calgary Flames", "Catches Left", "(G)", "Draft 2019"] },
            { nom: "Devin Cooley", indices: ["#1 Calgary Flames", "Catches Left", "(G)", "Draft Undrafted"] }

        ],


        "Edmonton Oilers": [
            // Attaquants
            { nom: "Leon Draisaitl", indices: ["#29 Edmonton Oilers", "Shoots Left", "(C)", "Draft 2014"] },
            { nom: "Connor McDavid", indices: ["#97 Edmonton Oilers", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Zach Hyman", indices: ["#18 Edmonton Oilers", "Shoots Right", "(RW)", "Draft 2010"] },
            { nom: "Ryan Nugent-Hopkins", indices: ["#93 Edmonton Oilers", "Shoots Left", "(C)", "Draft 2011"] },
            { nom: "Trent Frederic", indices: ["#10 Edmonton Oilers", "Shoots Left", "(LW)", "Draft 2016"] },
            { nom: "Andrew Mangiapane", indices: ["#88 Edmonton Oilers", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Adam Henrique", indices: ["#19 Edmonton Oilers", "Shoots Left", "(C)", "Draft 2008"] },
            { nom: "Mattias Janmark", indices: ["#13 Edmonton Oilers", "Shoots Left", "(C)", "Draft 2013"] },
            { nom: "Kasperi Kapanen", indices: ["#42 Edmonton Oilers", "Shoots Right", "(RW)", "Draft 2014"] },
            { nom: "Vasily Podkolzin", indices: ["#92 Edmonton Oilers", "Shoots Left", "(LW)", "Draft 2019"] },
            { nom: "Isaac Howard", indices: ["#53 Edmonton Oilers", "Shoots Left", "(LW)", "Draft 2022"] },
            { nom: "Matthew Savoie", indices: ["#22 Edmonton Oilers", "Shoots Right", "(C)", "Draft 2022"] },
            { nom: "Curtis Lazar", indices: ["#20 Edmonton Oilers", "Shoots Right", "(C)", "Draft 2013"] },

            // Défenseurs
            { nom: "Evan Bouchard", indices: ["#2 Edmonton Oilers", "Shoots Right", "(RD)", "Draft 2018"] },
            { nom: "Darnell Nurse", indices: ["#25 Edmonton Oilers", "Shoots Left", "(LD)", "Draft 2013"] },
            { nom: "Mattias Ekholm", indices: ["#14 Edmonton Oilers", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "Jake Walman", indices: ["#96 Edmonton Oilers", "Shoots Left", "(LD)", "Draft 2014"] },
            { nom: "Brett Kulak", indices: ["#27 Edmonton Oilers", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Ty Emberson", indices: ["#49 Edmonton Oilers", "Shoots Right", "(RD)", "Draft 2018"] },
            { nom: "Troy Stecher", indices: ["#51 Edmonton Oilers", "Shoots Right", "(RD)", "Undrafted"] },

            // Gardiens
            { nom: "Stuart Skinner", indices: ["#74 Edmonton Oilers", "Catches Left", "(G)", "Draft 2017"] },
            { nom: "Calvin Pickard", indices: ["#30 Edmonton Oilers", "Catches Left", "(G)", "Draft 2010"] }
        ],

        "Los Angeles Kings": [
            //Attaquants
            { nom: "Kevin Fiala", indices: ["#22 Los Angeles Kings", "Shoots Left", "(LW)", "Draft 2014"] },
            { nom: "Anze Kopitar", indices: ["#11 Los Angeles Kings", "Shoots Left", "(C)", "Draft 2005"] },
            { nom: "Quinton Byfield", indices: ["#55 Los Angeles Kings", "Shoots Left", "(C)", "Draft 2020"] },
            { nom: "Phillip Danault", indices: ["#24 Los Angeles Kings", "Shoots Left", "(C)", "Draft 2011"] },
            { nom: "Adrian Kempe", indices: ["#9 Los Angeles Kings", "Shoots Left", "(LW,RW)", "Draft 2014"] },
            { nom: "Andrei Kuzmenko", indices: ["#96 Los Angeles Kings", "Shoots Right", "(LW)", "Draft Undrafted"] },
            { nom: "Trevor Moore", indices: ["#12 Los Angeles Kings", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Warren Foegele", indices: ["#37 Los Angeles Kings", "Shoots Left", "(LW,C)", "Draft 2014"] },
            { nom: "Joel Armia", indices: ["#40 Los Angeles Kings", "Shoots Right", "(RW)", "Draft 2011"] },
            { nom: "Corey Perry", indices: ["#10 Los Angeles Kings", "Shoots Right", "(RW,LW)", "Draft 2003"] },
            { nom: "Samuel Helenius", indices: ["#79 Los Angeles Kings", "Shoots Left", "(C)", "Draft 2021"] },
            { nom: "Alex Turcotte", indices: ["#15 Los Angeles Kings", "Shoots Left", "(LW,RW)", "Draft 2019"] },
            { nom: "Alex Laferriere", indices: ["#14 Los Angeles Kings", "Shoots Right", "(RW)", "Draft 2020"] },

            //Défenseurs
            { nom: "Drew Doughty", indices: ["#8 Los Angeles Kings", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "Cody Ceci", indices: ["#5 Los Angeles Kings", "Shoots Right", "(RD)", "Draft 2012"] },
            { nom: "Mikey Anderson", indices: ["#44 Los Angeles Kings", "Shoots Left", "(LD)", "Draft 2017"] },
            { nom: "Brian Dumoulin", indices: ["#2 Los Angeles Kings", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "Joel Edmundson", indices: ["#6 Los Angeles Kings", "Shoots Left", "(LD)", "Draft 2011"] },
            { nom: "Kyle Burroughs", indices: ["#7 Los Angeles Kings", "Shoots Right", "(RD)", "Draft 2013"] },
            { nom: "Brandt Clarke", indices: ["#92 Los Angeles Kings", "Shoots Right", "(RD)", "Draft 2021"] },
            { nom: "Jacob Moverare", indices: ["#43 Los Angeles Kings", "Shoots Left", "(LD)", "Draft 2016"] },

            //Gardiens
            { nom: "Darcy Kuemper", indices: ["#35 Los Angeles Kings", "Catches Left", "(G)", "Draft 2009"] },
            { nom: "Anton Forsberg", indices: ["#31 Los Angeles Kings", "Catches Left", "(G)", "Draft 2011"] }
        ],


        "San Jose Sharks": [
            // Attaquants
            { nom: "Tyler Toffoli", indices: ["#73 San Jose Sharks", "Shoots Right", "(RW)", "Draft 2010"] },
            { nom: "Alexander Wennberg", indices: ["#21 San Jose Sharks", "Shoots Left", "(C)", "Draft 2013"] },
            { nom: "Barclay Goodrow", indices: ["#23 San Jose Sharks", "Shoots Left", "(C)", "Draft Undrafted"] },
            { nom: "Jeff Skinner", indices: ["#53 San Jose Sharks", "Shoots Left", "(LW)", "Draft 2010"] },
            { nom: "Adam Gaudette", indices: ["#81 San Jose Sharks", "Shoots Right", "(RW)", "Draft 2015"] },
            { nom: "Carl Grundström", indices: ["#91 San Jose Sharks", "Shoots Left", "(LW)", "Draft 2016"] },
            { nom: "Ryan Reaves", indices: ["#75 San Jose Sharks", "Shoots Right", "(RW)", "Draft 2005"] },
            { nom: "Philipp Kurashev", indices: ["#96 San Jose Sharks", "Shoots Left", "(C)", "Draft 2018"] },
            { nom: "Macklin Celebrini", indices: ["#71 San Jose Sharks", "Shoots Left", "(C)", "Draft 2024"] },
            { nom: "Will Smith", indices: ["#2 San Jose Sharks", "Shoots Right", "(RW)", "Draft 2023"] },
            { nom: "William Eklund", indices: ["#72 San Jose Sharks", "Shoots Left", "(LW)", "Draft 2021"] },
            { nom: "Ty Dellandrea", indices: ["#10 San Jose Sharks", "Shoots Right", "(C)", "Draft 2018"] },
            { nom: "Collin Graf", indices: ["#51 San Jose Sharks", "Shoots Right", "(RW, C)", "Draft Undrafted"] },

            // Défenseurs
            { nom: "Dmitry Orlov", indices: ["#9 San Jose Sharks", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "Nick Leddy", indices: ["#4 San Jose Sharks", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "John Klingberg", indices: ["#3 San Jose Sharks", "Shoots Right", "(RD)", "Draft 2010"] },
            { nom: "Mario Ferraro", indices: ["#38 San Jose Sharks", "Shoots Left", "(LD)", "Draft 2017"] },
            { nom: "Timothy Liljegren", indices: ["#37 San Jose Sharks", "Shoots Right", "(RD)", "Draft 2017"] },
            { nom: "Vincent Desharnais", indices: ["#5 San Jose Sharks", "Shoots Right", "(RD)", "Draft 2016"] },
            { nom: "Shakir Mukhamadullin", indices: ["#85 San Jose Sharks", "Shoots Left", "(D)", "Draft 2020"] },
            { nom: "Jack Thompson", indices: ["#28 San Jose Sharks", "Shoots Right", "(RD)", "Draft 2020"] },

            // Gardiens
            { nom: "Alex Nedeljkovic", indices: ["#33 San Jose Sharks", "Catches Left", "(G)", "Draft 2014"] },
            { nom: "Yaroslav Askarov", indices: ["#30 San Jose Sharks", "Catches Right", "(G)", "Draft 2020"] }
        ],

        "Seattle Kraken": [
            // Attaquants
            { nom: "Matthew Beniers", indices: ["#10 Seattle Kraken", "Shoots Left", "(C)", "Draft 2021"] },
            { nom: "Chandler Stephenson", indices: ["#9 Seattle Kraken", "Shoots Left", "(C,LW)", "Draft 2012"] },
            { nom: "Jaden Schwartz", indices: ["#17 Seattle Kraken", "Shoots Left", "(LW)", "Draft 2010"] },
            { nom: "Jared McCann", indices: ["#19 Seattle Kraken", "Shoots Left", "(LW,C)", "Draft 2014"] },
            { nom: "Jordan Eberle", indices: ["#7 Seattle Kraken", "Shoots Right", "(RW)", "Draft 2008"] },
            { nom: "Kaapo Kakko", indices: ["#84 Seattle Kraken", "Shoots Left", "(RW)", "Draft 2019"] },
            { nom: "Eeli Tolvanen", indices: ["#20 Seattle Kraken", "Shoots Left", "(LW,RW)", "Draft 2017"] },
            { nom: "Tye Kartye", indices: ["#12 Seattle Kraken", "Shoots Left", "(LW,C)", "Draft Undrafted"] },
            { nom: "Jani Nyman", indices: ["#38 Seattle Kraken", "Shoots Left", "(RW)", "Draft 2022"] },
            { nom: "Shane Wright", indices: ["#51 Seattle Kraken", "Shoots Right", "(C)", "Draft 2022"] },
            { nom: "John Hayden", indices: ["#15 Seattle Kraken", "Shoots Right", "(C,RW)", "Draft 2013"] },
            { nom: "Mitchell Stephens", indices: ["#67 Seattle Kraken", "Shoots Right", "(C)", "Draft 2015"] },

            // Défenseurs
            { nom: "Vince Dunn", indices: ["#29 Seattle Kraken", "Shoots Left", "(D)", "Draft 2015"] },
            { nom: "Brandon Montour", indices: ["#62 Seattle Kraken", "Shoots Right", "(D)", "Draft 2014"] },
            { nom: "Adam Larsson", indices: ["#6 Seattle Kraken", "Shoots Right", "(D)", "Draft 2011"] },
            { nom: "Jamie Oleksiak", indices: ["#24 Seattle Kraken", "Shoots Left", "(D)", "Draft 2011"] },
            { nom: "Josh Mahura", indices: ["#28 Seattle Kraken", "Shoots Left", "(D)", "Draft 2016"] },
            { nom: "Ryker Evans", indices: ["#41 Seattle Kraken", "Shoots Left", "(D)", "Draft 2021"] },

            // Gardiens
            { nom: "Philipp Grubauer", indices: ["#31 Seattle Kraken", "Catches Left", "(G)", "Draft 2010"] },
            { nom: "Joey Daccord", indices: ["#35 Seattle Kraken", "Catches Left", "(G)", "Draft 2015"] }
        ],


        "Vancouver Canucks": [
            // Attaquants
            { nom: "Elias Pettersson", indices: ["#40 Vancouver Canucks", "Shoots Left", "(C,LW)", "Draft 2017"] },
            { nom: "Brock Boeser", indices: ["#6 Vancouver Canucks", "Shoots Right", "(RW)", "Draft 2015"] },
            { nom: "Jake DeBrusk", indices: ["#74 Vancouver Canucks", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Evander Kane", indices: ["#91 Vancouver Canucks", "Shoots Left", "(LW,RW)", "Draft 2009"] },
            { nom: "Conor Garland", indices: ["#8 Vancouver Canucks", "Shoots Right", "(RW,LW)", "Draft 2015"] },
            { nom: "Filip Chytil", indices: ["#72 Vancouver Canucks", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Nils Hoglander", indices: ["#21 Vancouver Canucks", "Shoots Left", "(LW,RW)", "Draft 2019"] },
            { nom: "Teddy Blueger", indices: ["#53 Vancouver Canucks", "Shoots Left", "(C)", "Draft 2012"] },
            { nom: "Kiefer Sherwood", indices: ["#44 Vancouver Canucks", "Shoots Left", "(RW)", "Draft Undrafted"] },
            { nom: "Nils Aman", indices: ["#88 Vancouver Canucks", "Shoots Left", "(C,LW)", "Draft 2020"] },
            { nom: "Linus Karlsson", indices: ["#94 Vancouver Canucks", "Shoots Right", "(RW,C)", "Draft 2018"] },
            { nom: "Aatu Raty", indices: ["#54 Vancouver Canucks", "Shoots Left", "(C)", "Draft 2021"] },
            { nom: "Drew O'Connor", indices: ["#18 Vancouver Canucks", "Shoots Left", "(LW, RW)", "Draft Undrafted"] },

            // Défenseurs
            { nom: "Quinn Hughes", indices: ["#43 Vancouver Canucks", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Filip Hronek", indices: ["#17 Vancouver Canucks", "Shoots Right", "(RD)", "Draft 2016"] },
            { nom: "Marcus Pettersson", indices: ["#29 Vancouver Canucks", "Shoots Left", "(LD)", "Draft 2014"] },
            { nom: "Tyler Myers", indices: ["#57 Vancouver Canucks", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "Derek Forbort", indices: ["#27 Vancouver Canucks", "Shoots Left", "(LD)", "Draft 2010"] },
            { nom: "Elias Pettersson", indices: ["#25 Vancouver Canucks", "Shoots Left", "(LD,RD)", "Draft 2022"] },

            // Gardiens
            { nom: "Thatcher Demko", indices: ["#35 Vancouver Canucks", "Catches Left", "(G)", "Draft 2014"] },
            { nom: "Kevin Lankinen", indices: ["#32 Vancouver Canucks", "Catches Left", "(G)", "Draft Undrafted"] }
        ],


        "Vegas Golden Knights": [
            // Attaquants
            { nom: "Mitchell Marner", indices: ["#93 Vegas Golden Knights", "Shoots Right", "(RW)", "Draft 2015"] },
            { nom: "Jack Eichel", indices: ["#9 Vegas Golden Knights", "Shoots Right", "(C)", "Draft 2015"] },
            { nom: "Mark Stone", indices: ["#61 Vegas Golden Knights", "Shoots Right", "(RW)", "Draft 2010"] },
            { nom: "Tomas Hertl", indices: ["#48 Vegas Golden Knights", "Shoots Left", "(C,LW)", "Draft 2012"] },
            { nom: "William Karlsson", indices: ["#71 Vegas Golden Knights", "Shoots Left", "(C)", "Draft 2011"] },
            { nom: "Ivan Barbashev", indices: ["#49 Vegas Golden Knights", "Shoots Left", "(C,W)", "Draft 2014"] },
            { nom: "Keegan Kolesar", indices: ["#55 Vegas Golden Knights", "Shoots Right", "(RW)", "Draft 2015"] },
            { nom: "Brett Howden", indices: ["#21 Vegas Golden Knights", "Shoots Left", "(C,LW)", "Draft 2016"] },
            { nom: "Reilly Smith", indices: ["#19 Vegas Golden Knights", "Shoots Left", "(RW,LW)", "Draft 2009"] },
            { nom: "Brandon Saad", indices: ["#20 Vegas Golden Knights", "Shoots Left", "(LW,RW)", "Draft 2011"] },
            { nom: "Pavel Dorofeyev", indices: ["#34 Vegas Golden Knights", "Shoots Left", "(LW,RW)", "Draft 2019"] },
            { nom: "Colton Sissons", indices: ["#18 Vegas Golden Knights", "Shoots Right", "(C,RW)", "Draft 2012"] },
            { nom: "Cole Schwindt", indices: ["#22 Vegas Golden Knights", "Shoots Right", "(RW,C)", "Draft 2019"] },
            { nom: "Alexander Holtz", indices: ["#26 Vegas Golden Knights", "Shoots Right", "(RW)", "Draft 2020"] },

            // Défenseurs
            //{ nom: "Alex Pietrangelo", indices: ["#7 Vegas Golden Knights", "Shoots Right", "(D)", "Draft 2008"] },
            { nom: "Shea Theodore", indices: ["#27 Vegas Golden Knights", "Shoots Left", "(D)", "Draft 2013"] },
            { nom: "Noah Hanifin", indices: ["#5 Vegas Golden Knights", "Shoots Left", "(D)", "Draft 2015"] },
            { nom: "Brayden McNabb", indices: ["#3 Vegas Golden Knights", "Shoots Left", "(D)", "Draft 2009"] },
            { nom: "Zach Whitecloud", indices: ["#2 Vegas Golden Knights", "Shoots Right", "(D)", "Draft Undrafted"] },
            { nom: "Ben Hutton", indices: ["#58 Vegas Golden Knights", "Shoots Left", "(D)", "Draft 2012"] },
            { nom: "Kaedan Korczak", indices: ["#53 Vegas Golden Knights", "Shoots Right", "(D)", "Draft 2019"] },

            // Gardiens
            { nom: "Adin Hill", indices: ["#30 Vegas Golden Knights", "Catches Left", "(G)", "Draft 2015"] },
            { nom: "Akira Schmid", indices: ["#40 Vegas Golden Knights", "Catches Left", "(G)", "Draft 2018"] }
        ],

        "Chicago Blackhawks": [
            // Attaquants
            //{ nom: "André Burakovsky", indices: ["#95 Chicago Blackhawks", "Shoots Left", "(LW,RW)", "Draft 2013"] },
            { nom: "Tyler Bertuzzi", indices: ["#59 Chicago Blackhawks", "Shoots Left", "(LW,RW)", "Draft 2013"] },
            { nom: "Teuvo Teräväinen", indices: ["#86 Chicago Blackhawks", "Shoots Left", "(LW)", "Draft 2012"] },
            { nom: "Nick Foligno", indices: ["#17 Chicago Blackhawks", "Shoots Left", "(LW,RW)", "Draft 2006"] },
            { nom: "Jason Dickinson", indices: ["#16 Chicago Blackhawks", "Shoots Left", "(C,LW)", "Draft 2013"] },
            { nom: "Ilya Mikheyev", indices: ["#95 Chicago Blackhawks", "Shoots Left", "(RW,LW)", "Draft Undrafted"] },
            { nom: "Ryan Donato", indices: ["#8 Chicago Blackhawks", "Shoots Left", "(C,W)", "Draft 2014"] },
            { nom: "Sam Lafferty", indices: ["#24 Chicago Blackhawks", "Shoots Right", "(RW,C)", "Draft 2014"] },
            { nom: "Lukas Reichel", indices: ["#73 Chicago Blackhawks", "Shoots Left", "(LW,RW)", "Draft 2020"] },
            { nom: "Frank Nazar", indices: ["#91 Chicago Blackhawks", "Shoots Right", "(C,RW)", "Draft 2022"] },
            { nom: "Connor Bedard", indices: ["#98 Chicago Blackhawks", "Shoots Right", "(C)", "Draft 2023"] },
            { nom: "Dominic Toninato", indices: ["#25 Chicago Blackhawks", "Shoots Left", "(C)", "Draft 2012"] },

            // Défenseurs
            { nom: "Alex Vlasic", indices: ["#72 Chicago Blackhawks", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Connor Murphy", indices: ["#5 Chicago Blackhawks", "Shoots Right", "(RD)", "Draft 2011"] },
            { nom: "Artyom Levshunov", indices: ["#55 Chicago Blackhawks", "Shoots Right", "(RD)", "Draft 2024"] },
            { nom: "Sam Rinzel", indices: ["#6 Chicago Blackhawks", "Shoots Right", "(RD)", "Draft 2022"] },
            { nom: "Kevin Korchinski", indices: ["#14 Chicago Blackhawks", "Shoots Left", "(LD)", "Draft 2022"] },
            { nom: "Louis Crevier", indices: ["#46 Chicago Blackhawks", "Shoots Right", "(D)", "Draft 2020"] },
            { nom: "Nolan Allan", indices: ["#42 Chicago Blackhawks", "Shoots Left", "(D)", "Draft 2021"] },
            { nom: "Wyatt Kaiser", indices: ["#44 Chicago Blackhawks", "Shoots Left", "(LD)", "Draft 2020"] },

            // Gardiens
            { nom: "Spencer Knight", indices: ["#30 Chicago Blackhawks", "Catches Left", "(G)", "Draft 2019"] },
            { nom: "Laurent Brossoit", indices: ["#39 Chicago Blackhawks", "Catches Left", "(G)", "Draft 2011"] },
            { nom: "Arvid Soderblom", indices: ["#40 Chicago Blackhawks", "Catches Left", "(G)", "Draft Undrafted"] }
        ],

        "Colorado Avalanche": [
            // Attaquants
            { nom: "Nathan MacKinnon", indices: ["#29 Colorado Avalanche", "Shoots Right", "(C)", "Draft 2013"] },
            { nom: "Brock Nelson", indices: ["#11 Colorado Avalanche", "Shoots Left", "(C)", "Draft 2010"] },
            { nom: "Gabriel Landeskog", indices: ["#92 Colorado Avalanche", "Shoots Left", "(LW,RW)", "Draft 2011"] },
            { nom: "Martin Necas", indices: ["#88 Colorado Avalanche", "Shoots Right", "(C,RW)", "Draft 2017"] },
            { nom: "Valeri Nichushkin", indices: ["#13 Colorado Avalanche", "Shoots Left", "(RW)", "Draft 2013"] },
            { nom: "Artturi Lehkonen", indices: ["#62 Colorado Avalanche", "Shoots Left", "(LW)", "Draft 2013"] },
            { nom: "Ross Colton", indices: ["#20 Colorado Avalanche", "Shoots Left", "(C)", "Draft 2016"] },
            { nom: "Logan O'Connor", indices: ["#25 Colorado Avalanche", "Shoots Right", "(RW)", "Draft Undrafted"] },
            { nom: "Jack Drury", indices: ["#18 Colorado Avalanche", "Shoots Left", "(C)", "Draft 2018"] },
            { nom: "Ivan Ivan", indices: ["#82 Colorado Avalanche", "Shoots Left", "(C)", "Draft Undrafted"] },
            { nom: "Parker Kelly", indices: ["#17 Colorado Avalanche", "Shoots Left", "(LW,C)", "Draft Undrafted"] },
            { nom: "Nikita Prishchepov", indices: ["#85 Colorado Avalanche", "Shoots Left", "(C,LW)", "Draft 2024"] },
            { nom: "Tye Felhaber", indices: ["#48 Colorado Avalanche", "Shoots Left", "(LW,C)", "Draft Undrafted"] },
            { nom: "Danil Gushchin", indices: ["#75 Colorado Avalanche", "Shoots Left", "(LW,RW)", "Draft 2020"] },

            // Défenseurs
            { nom: "Cale Makar", indices: ["#8 Colorado Avalanche", "Shoots Right", "(D)", "Draft 2017"] },
            { nom: "Devon Toews", indices: ["#7 Colorado Avalanche", "Shoots Left", "(D)", "Draft 2014"] },
            { nom: "Samuel Girard", indices: ["#49 Colorado Avalanche", "Shoots Left", "(D)", "Draft 2016"] },
            { nom: "Josh Manson", indices: ["#42 Colorado Avalanche", "Shoots Right", "(D)", "Draft 2011"] },
            { nom: "Sam Malinski", indices: ["#70 Colorado Avalanche", "Shoots Right", "(D)", "Draft Undrafted"] },
            { nom: "Keaton Middleton", indices: ["#67 Colorado Avalanche", "Shoots Left", "(D)", "Draft 2016"] },
            { nom: "Brent Burns", indices: ["#84 Colorado Avalanche", "Shoots Right", "(RD)", "Draft 2003"] },

            // Gardiens
            { nom: "MacKenzie Blackwood", indices: ["#39 Colorado Avalanche", "Catches Left", "(G)", "Draft 2015"] },
            { nom: "Scott Wedgewood", indices: ["#41 Colorado Avalanche", "Catches Left", "(G)", "Draft 2010"] }
        ],

        "Dallas Stars": [
            // Attaquants
            { nom: "Mikko Rantanen", indices: ["#96 Dallas Stars", "Shoots Left", "(RW,C)", "Draft 2015"] },
            { nom: "Jamie Benn", indices: ["#14 Dallas Stars", "Shoots Left", "(LW,C)", "Draft 2007"] },
            { nom: "Roope Hintz", indices: ["#24 Dallas Stars", "Shoots Left", "(C,LW)", "Draft 2015"] },
            { nom: "Wyatt Johnston", indices: ["#53 Dallas Stars", "Shoots Right", "(C,RW)", "Draft 2021"] },
            { nom: "Jason Robertson", indices: ["#21 Dallas Stars", "Shoots Left", "(LW,RW)", "Draft 2017"] },
            { nom: "Tyler Seguin", indices: ["#91 Dallas Stars", "Shoots Right", "(C,RW)", "Draft 2010"] },
            { nom: "Matt Duchene", indices: ["#95 Dallas Stars", "Shoots Left", "(C,RW)", "Draft 2009"] },
            { nom: "Sam Steel", indices: ["#18 Dallas Stars", "Shoots Left", "(C,LW)", "Draft 2016"] },
            { nom: "Radek Faksa", indices: ["#12 Dallas Stars", "Shoots Left", "(C,LW)", "Draft 2012"] },
            { nom: "Mavrik Bourque", indices: ["#22 Dallas Stars", "Shoots Right", "(C,RW)", "Draft 2020"] },
            { nom: "Oskar Bäck", indices: ["#10 Dallas Stars", "Shoots Left", "(C,LW)", "Draft 2018"] },
            { nom: "Colin Blackwell", indices: ["#15 Dallas Stars", "Shoots Right", "(C,W)", "Draft 2011"] },
            { nom: "Antonio Stranges", indices: ["#71 Dallas Stars", "Shoots Left", "(LW, C)", "Draft 2020"] },

            // Défenseurs
            { nom: "Miro Heiskanen", indices: ["#4 Dallas Stars", "Shoots Left", "(D)", "Draft 2017"] },
            { nom: "Esa Lindell", indices: ["#23 Dallas Stars", "Shoots Left", "(D)", "Draft 2012"] },
            { nom: "Thomas Harley", indices: ["#55 Dallas Stars", "Shoots Left", "(D)", "Draft 2019"] },
            { nom: "Nils Lundkvist", indices: ["#5 Dallas Stars", "Shoots Right", "(D)", "Draft 2018"] },
            { nom: "Ilya Lyubushkin", indices: ["#46 Dallas Stars", "Shoots Right", "(D)", "Draft Undrafted"] },
            { nom: "Lian Bichsel", indices: ["#6 Dallas Stars", "Shoots Left", "(D)", "Draft 2022"] },
            { nom: "Alexander Petrovic", indices: ["#28 Dallas Stars", "Shoots Right", "(D)", "Draft 2010"] },

            // Gardiens
            { nom: "Jake Oettinger", indices: ["#29 Dallas Stars", "Catches Left", "(G)", "Draft 2017"] },
            { nom: "Casey DeSmith", indices: ["#1 Dallas Stars", "Catches Left", "(G)", "Draft Undrafted"] }
        ],

        "Minnesota Wild": [
            // Attaquants
            { nom: "Kirill Kaprizov", indices: ["#97 Minnesota Wild", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Matt Boldy", indices: ["#12 Minnesota Wild", "Shoots Left", "(LW,RW)", "Draft 2019"] },
            { nom: "Joel Eriksson Ek", indices: ["#14 Minnesota Wild", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Vladimir Tarasenko", indices: ["#91 Minnesota Wild", "Shoots Left", "(RW)", "Draft 2010"] },
            { nom: "Mats Zuccarello", indices: ["#36 Minnesota Wild", "Shoots Left", "(RW,LW)", "Draft Undrafted"] },
            { nom: "Marcus Foligno", indices: ["#17 Minnesota Wild", "Shoots Left", "(LW,RW)", "Draft 2009"] },
            { nom: "Ryan Hartman", indices: ["#38 Minnesota Wild", "Shoots Right", "(RW,C)", "Draft 2013"] },
            { nom: "Yakov Trenin", indices: ["#13 Minnesota Wild", "Shoots Left", "(C,LW)", "Draft 2015"] },
            { nom: "Nico Sturm", indices: ["#78 Minnesota Wild", "Shoots Left", "(C,LW)", "Draft Undrafted"] },
            { nom: "Danila Yurov", indices: ["#22 Minnesota Wild", "Shoots Left", "(RW,C)", "Draft 2022"] },
            { nom: "Liam Öhgren", indices: ["#28 Minnesota Wild", "Shoots Left", "(LW)", "Draft 2022"] },
            { nom: "Marcus Johansson", indices: ["#90 Minnesota Wild", "Shoots Left", "(C,LW)", "Draft 2009"] },
            { nom: "Nicolas Aube-Kubel", indices: ["#96 Minnesota Wild", "Shoots Right", "(RW,C)", "Draft 2014"] },
            { nom: "Marco Rossi", indices: ["#23 Minnesota Wild", "Shoots Left", "(C)", "Draft 2020"] },

            // Défenseurs
            { nom: "Brock Faber", indices: ["#7 Minnesota Wild", "Shoots Right", "(RD)", "Draft 2020"] },
            { nom: "Jared Spurgeon", indices: ["#46 Minnesota Wild", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "Jonas Brodin", indices: ["#25 Minnesota Wild", "Shoots Left", "(LD)", "Draft 2011"] },
            { nom: "Jacob Middleton", indices: ["#5 Minnesota Wild", "Shoots Left", "(LD)", "Draft 2014"] },
            { nom: "Zeev Buium", indices: ["#8 Minnesota Wild", "Shoots Left", "(LD)", "Draft 2024"] },
            { nom: "Zach Bogosian", indices: ["#24 Minnesota Wild", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "David Jiricek", indices: ["#55 Minnesota Wild", "Shoots Right", "(D)", "Draft 2022"] },

            // Gardiens
            { nom: "Filip Gustavsson", indices: ["#32 Minnesota Wild", "Catches Left", "(G)", "Draft 2016"] },
            { nom: "Jesper Wallstedt", indices: ["#30 Minnesota Wild", "Catches Left", "(G)", "Draft 2021"] }
        ],

        "Nashville Predators": [
            // Attaquants
            { nom: "Filip Forsberg", indices: ["#9 Nashville Predators", "Shoots Right", "(W,C)", "Draft 2012"] },
            { nom: "Steven Stamkos", indices: ["#91 Nashville Predators", "Shoots Right", "(C,W)", "Draft 2008"] },
            { nom: "Jonathan Marchessault", indices: ["#81 Nashville Predators", "Shoots Right", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Ryan O'Reilly", indices: ["#90 Nashville Predators", "Shoots Left", "(C)", "Draft 2009"] },
            { nom: "Michael Bunting", indices: ["#58 Nashville Predators", "Shoots Left", "(LW,RW)", "Draft 2014"] },
            { nom: "Erik Haula", indices: ["#56 Nashville Predators", "Shoots Left", "(LW,C)", "Draft 2009"] },
            { nom: "Cole Smith", indices: ["#36 Nashville Predators", "Shoots Left", "(LW)", "Draft Undrafted"] },
            { nom: "Michael McCarron", indices: ["#47 Nashville Predators", "Shoots Right", "(RW,C)", "Draft 2013"] },
            { nom: "Matthew Wood", indices: ["#71 Nashville Predators", "Shoots Right", "(LW,C)", "Draft 2023"] },
            { nom: "Zachary L'Heureux", indices: ["#68 Nashville Predators", "Shoots Left", "(LW,C)", "Draft 2021"] },
            { nom: "Fyodor Svechkov", indices: ["#40 Nashville Predators", "Shoots Left", "(C,LW)", "Draft 2021"] },
            { nom: "Luke Evangelista", indices: ["#77 Nashville Predators", "Shoots Right", "(RW)", "Draft 2020"] },
            { nom: "Ozzy Wiesblatt", indices: ["#97 Nashville Predators", "Shoots Right", "(W, C)", "Draft 2020"] },

            // Défenseurs
            { nom: "Roman Josi", indices: ["#59 Nashville Predators", "Shoots Left", "(LD)", "Draft 2008"] },
            { nom: "Brady Skjei", indices: ["#76 Nashville Predators", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Nicolas Hague", indices: ["#41 Nashville Predators", "Shoots Right", "(LD)", "Draft 2017"] },
            { nom: "Nick Perbix", indices: ["#48 Nashville Predators", "Shoots Right", "(RD)", "Draft 2017"] },
            { nom: "Justin Barron", indices: ["#20 Nashville Predators", "Shoots Right", "(RD)", "Draft 2020"] },
            { nom: "Andreas Englund", indices: ["#8 Nashville Predators", "Shoots Left", "(D)", "Draft 2014"] },
            { nom: "Nick Blankenburg", indices: ["#37 Nashville Predators", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Jordan Oesterle", indices: ["#82 Nashville Predators", "Shoots Left", "(D)", "Draft Undrafted"] },

            // Gardiens
            { nom: "Juuse Saros", indices: ["#74 Nashville Predators", "Catches Left", "(G)", "Draft 2013"] },
            { nom: "Justus Annunen", indices: ["#29 Nashville Predators", "Catches Left", "(G)", "Draft 2018"] }
        ],


        "St. Louis Blues": [
            // Attaquants
            { nom: "Jordan Kyrou", indices: ["#25 St. Louis Blues", "Shoots Right", "(RW)", "Draft 2016"] },
            { nom: "Robert Thomas", indices: ["#18 St. Louis Blues", "Shoots Right", "(C)", "Draft 2017"] },
            { nom: "Pavel Buchnevich", indices: ["#89 St. Louis Blues", "Shoots Left", "(LW,C)", "Draft 2013"] },
            { nom: "Brayden Schenn", indices: ["#10 St. Louis Blues", "Shoots Left", "(C,LW)", "Draft 2009"] },
            { nom: "Pius Suter", indices: ["#24 St. Louis Blues", "Shoots Left", "(C)", "Draft Undrafted"] },
            { nom: "Jake Neighbours", indices: ["#63 St. Louis Blues", "Shoots Left", "(LW,RW)", "Draft 2020"] },
            { nom: "Mathieu Joseph", indices: ["#71 St. Louis Blues", "Shoots Left", "(LW,RW)", "Draft 2015"] },
            { nom: "Dylan Holloway", indices: ["#81 St. Louis Blues", "Shoots Left", "(LW,C)", "Draft 2020"] },
            { nom: "Alexandre Texier", indices: ["#9 St. Louis Blues", "Shoots Left", "(C,LW)", "Draft 2017"] },
            { nom: "Nick Bjugstad", indices: ["#7 St. Louis Blues", "Shoots Right", "(C,RW)", "Draft 2010"] },
            { nom: "Alexei Toropchenko", indices: ["#13 St. Louis Blues", "Shoots Left", "(LW,RW)", "Draft 2017"] },
            { nom: "Oskar Sundqvist", indices: ["#70 St. Louis Blues", "Shoots Right", "(C,RW)", "Draft 2012"] },
            { nom: "Jimmy Snuggerud", indices: ["#21 St. Louis Blues", "Shoots Right", "(RW,LW)", "Draft 2022"] },
            { nom: "Nathan Walker", indices: ["#26 St. Louis Blues", "Shoots Left", "(LW,RW)", "Draft 2014"] },

            // Défenseurs
            { nom: "Justin Faulk", indices: ["#72 St. Louis Blues", "Shoots Right", "(RD)", "Draft 2010"] },
            { nom: "Colton Parayko", indices: ["#55 St. Louis Blues", "Shoots Right", "(RD)", "Draft 2012"] },
            { nom: "Philip Broberg", indices: ["#6 St. Louis Blues", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Cam Fowler", indices: ["#17 St. Louis Blues", "Shoots Left", "(LD)", "Draft 2010"] },
            { nom: "Tyler Tucker", indices: ["#75 St. Louis Blues", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Logan Mailloux", indices: ["#94 St. Louis Blues", "Shoots Right", "(RD)", "Draft 2021"] },
            { nom: "Matthew Kessel", indices: ["#51 St. Louis Blues", "Shoots Right", "(D)", "Draft 2020"] },

            // Gardiens
            { nom: "Jordan Binnington", indices: ["#50 St. Louis Blues", "Catches Left", "(G)", "Draft 2011"] },
            { nom: "Joel Hofer", indices: ["#30 St. Louis Blues", "Catches Left", "(G)", "Draft 2018"] }
        ],


        "Utah Mammoth": [
            // Attaquants
            { nom: "J.J Peterka", indices: ["#77 Utah Mammoth", "Shoots Left", "(LW)", "Draft 2020"] },
            { nom: "Clayton Keller", indices: ["#9 Utah Mammoth", "Shoots Left", "(RW,LW)", "Draft 2016"] },
            { nom: "Dylan Guenther", indices: ["#11 Utah Mammoth", "Shoots Right", "(RW,LW)", "Draft 2021"] },
            { nom: "Nick Schmaltz", indices: ["#8 Utah Mammoth", "Shoots Right", "(C,LW)", "Draft 2014"] },
            { nom: "Lawson Crouse", indices: ["#67 Utah Mammoth", "Shoots Left", "(LW,RW)", "Draft 2015"] },
            { nom: "Jack McBain", indices: ["#22 Utah Mammoth", "Shoots Left", "(C,LW)", "Draft 2018"] },
            { nom: "Alexander Kerfoot", indices: ["#15 Utah Mammoth", "Shoots Left", "(LW,C)", "Draft 2012"] },
            { nom: "Barrett Hayton", indices: ["#27 Utah Mammoth", "Shoots Left", "(C,LW)", "Draft 2018"] },
            { nom: "Brandon Tanev", indices: ["#13 Utah Mammoth", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Kevin Stenlund", indices: ["#82 Utah Mammoth", "Shoots Right", "(C)", "Draft 2015"] },
            { nom: "Liam O'Brien", indices: ["#38 Utah Mammoth", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Logan Cooley", indices: ["#92 Utah Mammoth", "Shoots Left", "(C,LW)", "Draft 2022"] },
            { nom: "Michael Carcone", indices: ["#53 Utah Mammoth", "Shoots Left", "(W,C)", "Draft Undrafted"] },

            // Défenseurs
            { nom: "Mikhail Sergachev", indices: ["#98 Utah Mammoth", "Shoots Left", "(LD)", "Draft 2016"] },
            { nom: "Sean Durzi", indices: ["#50 Utah Mammoth", "Shoots Right", "(RD)", "Draft 2018"] },
            { nom: "John Marino", indices: ["#6 Utah Mammoth", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "Olli Maatta", indices: ["#2 Utah Mammoth", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Nate Schmidt", indices: ["#88 Utah Mammoth", "Shoots Left", "(LD,RD)", "Draft Undrafted"] },
            { nom: "Ian Cole", indices: ["#28 Utah Mammoth", "Shoots Left", "(LD)", "Draft 2007"] },
            { nom: "Juuso Valimaki", indices: ["#4 Utah Mammoth", "Shoots Left", "(LD)", "Draft 2017"] },

            // Gardiens
            { nom: "Karel Vejmelka", indices: ["#70 Utah Mammoth", "Catches Right", "(G)", "Draft 2015"] },
            { nom: "Connor Ingram", indices: ["#39 Utah Mammoth", "Catches Left", "(G)", "Draft 2016"] },
            { nom: "Vitek Vanecek", indices: ["#40 Utah Mammoth", "Catches Left", "(G)", "Draft 2014"] }
        ],


        "Winnipeg Jets": [
            // Attaquants
            { nom: "Mark Scheifele", indices: ["#55 Winnipeg Jets", "Shoots Right", "(C)", "Draft 2011"] },
            { nom: "Gabriel Vilardi", indices: ["#13 Winnipeg Jets", "Shoots Right", "(RW,C)", "Draft 2017"] },
            { nom: "Kyle Connor", indices: ["#81 Winnipeg Jets", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Nino Niederreiter", indices: ["#62 Winnipeg Jets", "Shoots Left", "(LW)", "Draft 2010"] },
            { nom: "Alex Iafallo", indices: ["#9 Winnipeg Jets", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Gustav Nyquist", indices: ["#14 Winnipeg Jets", "Shoots Left", "(RW,LW)", "Draft 2008"] },
            { nom: "Adam Lowry", indices: ["#17 Winnipeg Jets", "Shoots Left", "(C)", "Draft 2011"] },
            { nom: "Cole Perfetti", indices: ["#91 Winnipeg Jets", "Shoots Left", "(RW,LW)", "Draft 2020"] },
            { nom: "Vladislav Namestnikov", indices: ["#7 Winnipeg Jets", "Shoots Left", "(C,LW)", "Draft 2011"] },
            { nom: "Jonathan Toews", indices: ["#19 Winnipeg Jets", "Shoots Left", "(C)", "Draft 2006"] },
            { nom: "Morgan Barron", indices: ["#36 Winnipeg Jets", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Tanner Pearson", indices: ["#70 Winnipeg Jets", "Shoots Left", "(LW)", "Draft 2012"] },
            { nom: "Cole Koepke", indices: ["#45 Winnipeg Jets", "Shoots Left", "(LW,RW)", "Draft 2018"] },
            //{ nom: "Ville Heinola", indices: ["#34 Winnipeg Jets", "Shoots Left", "(D)", "Draft 2018"] },
            { nom: "David Gustafsson", indices: ["#41 Winnipeg Jets", "Shoots Left", "(C,LW)", "Draft 2018"] },
            //{ nom: "Rasmus Kupari", indices: ["#15 Winnipeg Jets", "Shoots Right", "(C,RW)", "Draft 2018"] },

            // Défenseurs
            { nom: "Neal Pionk", indices: ["#4 Winnipeg Jets", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Josh Morrissey", indices: ["#44 Winnipeg Jets", "Shoots Left", "(LD)", "Draft 2013"] },
            { nom: "Dylan Samberg", indices: ["#54 Winnipeg Jets", "Shoots Left", "(LD)", "Draft 2017"] },
            { nom: "Dylan Demelo", indices: ["#2 Winnipeg Jets", "Shoots Right", "(RD)", "Draft 2011"] },
            { nom: "Luke Schenn", indices: ["#5 Winnipeg Jets", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "Colin Miller", indices: ["#6 Winnipeg Jets", "Shoots Right", "(RD)", "Draft 2012"] },
            { nom: "Logan Stanley", indices: ["#64 Winnipeg Jets", "Shoots Left", "(LD)", "Draft 2016"] },
            { nom: "Haydn Fleury", indices: ["#24 Winnipeg Jets", "Shoots Left", "(LD,RD)", "Draft 2014"] },

            // Gardiens
            { nom: "Connor Hellebuyck", indices: ["#37 Winnipeg Jets", "Catches Left", "(G)", "Draft 2012"] },
            { nom: "Eric Comrie", indices: ["#1 Winnipeg Jets", "Catches Left", "(G)", "Draft 2013"] }
        ],


        "Carolina Hurricanes": [
            // Attaquants
            { nom: "Sebastian Aho", indices: ["#20 Carolina Hurricanes", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Nikolaj Ehlers", indices: ["#27 Carolina Hurricanes", "Shoots Left", "(LW)", "Draft 2014"] },
            { nom: "Andrei Svechnikov", indices: ["#37 Carolina Hurricanes", "Shoots Left", "(LW,RW)", "Draft 2018"] },
            { nom: "Seth Jarvis", indices: ["#24 Carolina Hurricanes", "Shoots Right", "(RW,LW)", "Draft 2020"] },
            { nom: "Jesperi Kotkaniemi", indices: ["#82 Carolina Hurricanes", "Shoots Left", "(C,LW)", "Draft 2018"] },
            { nom: "Taylor Hall", indices: ["#71 Carolina Hurricanes", "Shoots Left", "(LW)", "Draft 2010"] },
            { nom: "Jordan Martinook", indices: ["#48 Carolina Hurricanes", "Shoots Left", "(LW)", "Draft 2012"] },
            { nom: "Jordan Staal", indices: ["#11 Carolina Hurricanes", "Shoots Left", "(C)", "Draft 2006"] },
            { nom: "William Carrier", indices: ["#28 Carolina Hurricanes", "Shoots Left", "(LW,RW)", "Draft 2013"] },
            { nom: "Eric Robinson", indices: ["#50 Carolina Hurricanes", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Jackson Blake", indices: ["#53 Carolina Hurricanes", "Shoots Right", "(RW)", "Draft 2021"] },
            { nom: "Logan Stankoven", indices: ["#22 Carolina Hurricanes", "Shoots Right", "(C,RW)", "Draft 2021"] },
            { nom: "Mark Jankowski", indices: ["#77 Carolina Hurricanes", "Shoots Left", "(C)", "Draft 2012"] },
            // Défenseurs
            { nom: "K'Andre Miller", indices: ["#19 Carolina Hurricanes", "Shoots Left", "(D)", "Draft 2018"] },
            { nom: "Jaccob Slavin", indices: ["#74 Carolina Hurricanes", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Sean Walker", indices: ["#26 Carolina Hurricanes", "Shoots Right", "(RD,LD)", "Draft Undrafted"] },
            { nom: "Shayne Gostisbehere", indices: ["#4 Carolina Hurricanes", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Jalen Chatfield", indices: ["#5 Carolina Hurricanes", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Alexander Nikishin", indices: ["#21 Carolina Hurricanes", "Shoots Left", "(LD)", "Draft 2020"] },
            // Gardiens
            { nom: "Frederik Andersen", indices: ["#31 Carolina Hurricanes", "Catches Left", "(G)", "Draft 2012"] },
            { nom: "Pyotr Kochetkov", indices: ["#52 Carolina Hurricanes", "Catches Left", "(G)", "Draft 2019"] }
        ],


        "Columbus Blue Jackets": [
            // Attaquants
            { nom: "Sean Monahan", indices: ["#23 Columbus Blue Jackets", "Shoots Left", "(C)", "Draft 2013"] },
            { nom: "Charlie Coyle", indices: ["#3 Columbus Blue Jackets", "Shoots Right", "(C,RW)", "Draft 2010"] },
            { nom: "Dmitri Voronkov", indices: ["#10 Columbus Blue Jackets", "Shoots Left", "(C,LW)", "Draft 2019"] },
            { nom: "Kirill Marchenko", indices: ["#86 Columbus Blue Jackets", "Shoots Right", "(RW,LW)", "Draft 2018"] },
            { nom: "Boone Jenner", indices: ["#38 Columbus Blue Jackets", "Shoots Left", "(C,LW)", "Draft 2011"] },
            { nom: "Mathieu Olivier", indices: ["#24 Columbus Blue Jackets", "Shoots Right", "(RW,LW)", "Draft Undrafted"] },
            { nom: "Miles Wood", indices: ["#17 Columbus Blue Jackets", "Shoots Left", "(LW)", "Draft 2013"] },
            { nom: "Cole Sillinger", indices: ["#4 Columbus Blue Jackets", "Shoots Left", "(C,LW)", "Draft 2021"] },
            { nom: "Yegor Chinakhov", indices: ["#59 Columbus Blue Jackets", "Shoots Left", "(LW)", "Draft 2020"] },
            { nom: "Kent Johnson", indices: ["#91 Columbus Blue Jackets", "Shoots Left", "(LW,RW)", "Draft 2021"] },
            { nom: "Isac Lundeström", indices: ["#21 Columbus Blue Jackets", "Shoots Left", "(C,LW)", "Draft 2018"] },
            { nom: "Adam Fantilli", indices: ["#11 Columbus Blue Jackets", "Shoots Left", "(C)", "Draft 2023"] },
            { nom: "Zach Aston-Reese", indices: ["#27 Columbus Blue Jackets", "Shoots Left", "(LW)", "Draft Undrafted"] },
            { nom: "Mikael Pyyhtia", indices: ["#82 Columbus Blue Jackets", "Shoots Left", "(LW,RW)", "Draft 2020"] },

            // Défenseurs
            { nom: "Zach Werenski", indices: ["#8 Columbus Blue Jackets", "Shoots Left", "(LD)", "Draft 2015"] },
            { nom: "Ivan Provorov", indices: ["#9 Columbus Blue Jackets", "Shoots Left", "(LD,RD)", "Draft 2015"] },
            { nom: "Damon Severson", indices: ["#78 Columbus Blue Jackets", "Shoots Right", "(LD,RD)", "Draft 2012"] },
            { nom: "Dante Fabbro", indices: ["#15 Columbus Blue Jackets", "Shoots Right", "(RD)", "Draft 2016"] },
            { nom: "Erik Gudbranson", indices: ["#44 Columbus Blue Jackets", "Shoots Right", "(RD)", "Draft 2010"] },
            { nom: "Jake Christiansen", indices: ["#2 Columbus Blue Jackets", "Shoots Left", "(LD)", "Draft Undrafted"] },
            { nom: "Denton Mateychuk", indices: ["#5 Columbus Blue Jackets", "Shoots Left", "(LD)", "Draft 2022"] },

            // Gardiens
            { nom: "Elvis Merzlikins", indices: ["#90 Columbus Blue Jackets", "Catches Left", "(G)", "Draft 2014"] },
            { nom: "Jet Greaves", indices: ["#73 Columbus Blue Jackets", "Catches Left", "(G)", "Draft Undrafted"] }
        ],


        "New Jersey Devils": [
            // Attaquants
            { nom: "Timo Meier", indices: ["#28 New Jersey Devils", "Shoots Left", "(RW,LW)", "Draft 2015"] },
            { nom: "Jack Hughes", indices: ["#86 New Jersey Devils", "Shoots Left", "(C)", "Draft 2019"] },
            { nom: "Jesper Bratt", indices: ["#63 New Jersey Devils", "Shoots Left", "(LW,RW)", "Draft 2016"] },
            { nom: "Nico Hischier", indices: ["#13 New Jersey Devils", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Ondrej Palat", indices: ["#18 New Jersey Devils", "Shoots Left", "(LW,RW)", "Draft 2011"] },
            { nom: "Dawson Mercer", indices: ["#91 New Jersey Devils", "Shoots Right", "(C,RW)", "Draft 2020"] },
            { nom: "Stefan Noesen", indices: ["#11 New Jersey Devils", "Shoots Right", "(RW,LW)", "Draft 2011"] },
            { nom: "Cody Glass", indices: ["#12 New Jersey Devils", "Shoots Right", "(C,RW)", "Draft 2017"] },
            { nom: "Kurtis MacDermid", indices: ["#23 New Jersey Devils", "Shoots Left", "(LW)", "Draft Undrafted"] },
            { nom: "Evgenii Dadonov", indices: ["#10 New Jersey Devils", "Shoots Left", "(RW,LW)", "Draft 2007"] },
            { nom: "Juho Lammikko", indices: ["#83 New Jersey Devils", "Shoots Left", "(C,LW)", "Draft 2014"] },
            { nom: "Paul Cotter", indices: ["#47 New Jersey Devils", "Shoots Left", "(LW)", "Draft 2018"] },

            // Défenseurs
            { nom: "Dougie Hamilton", indices: ["#7 New Jersey Devils", "Shoots Right", "(RD)", "Draft 2011"] },
            { nom: "Brett Pesce", indices: ["#22 New Jersey Devils", "Shoots Right", "(LD)", "Draft 2013"] },
            { nom: "Brenden Dillon", indices: ["#5 New Jersey Devils", "Shoots Left", "(LD)", "Draft Undrafted"] },
            { nom: "Johnathan Kovacevic", indices: ["#8 New Jersey Devils", "Shoots Right", "(RD)", "Draft 2017"] },
            { nom: "Jonas Siegenthaler", indices: ["#71 New Jersey Devils", "Shoots Left", "(LD)", "Draft 2015"] },
            { nom: "Seamus Casey", indices: ["#24 New Jersey Devils", "Shoots Right", "(RD)", "Draft 2022"] },
            { nom: "Simon Nemec", indices: ["#17 New Jersey Devils", "Shoots Right", "(RD)", "Draft 2022"] },
            { nom: "Luke Hughes", indices: ["#43 New Jersey Devils", "Shoots Left", "(LD)", "Draft 2021"] },

            // Gardiens
            { nom: "Jacob Markstrom", indices: ["#25 New Jersey Devils", "Catches Left", "(G)", "Draft 2008"] },
            { nom: "Jake Allen", indices: ["#34 New Jersey Devils", "Catches Left", "(G)", "Draft 2008"] }
        ],

        "New York Islanders": [
            // Attaquants
            { nom: "Mathew Barzal", indices: ["#13 New York Islanders", "Shoots Right", "(C,RW)", "Draft 2015"] },
            { nom: "Bo Horvat", indices: ["#14 New York Islanders", "Shoots Left", "(C)", "Draft 2013"] },
            { nom: "Anders Lee", indices: ["#27 New York Islanders", "Shoots Left", "(LW)", "Draft 2009"] },
            { nom: "Jean-Gabriel Pageau", indices: ["#44 New York Islanders", "Shoots Right", "(C)", "Draft 2011"] },
            { nom: "Kyle Palmieri", indices: ["#21 New York Islanders", "Shoots Right", "(RW)", "Draft 2009"] },
            { nom: "Simon Holmstrom", indices: ["#10 New York Islanders", "Shoots Left", "(RW,LW)", "Draft 2019"] },
            { nom: "Anthony Duclair", indices: ["#11 New York Islanders", "Shoots Left", "(LW)", "Draft 2013"] },
            { nom: "Pierre Engvall", indices: ["#18 New York Islanders", "Shoots Left", "(LW,RW)", "Draft 2014"] },
            { nom: "Casey Cizikas", indices: ["#53 New York Islanders", "Shoots Left", "(C)", "Draft 2009"] },
            { nom: "Maxim Tsyplakov", indices: ["#7 New York Islanders", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Emil Heineman", indices: ["#51 New York Islanders", "Shoots Left", "(LW,RW)", "Draft 2020"] },
            { nom: "Marc Gatcomb", indices: ["#16 New York Islanders", "Shoots Right", "(C,RW)", "Draft Undrafted"] },
            { nom: "Kyle MacLean", indices: ["#32 New York Islanders", "Shoots Left", "(C,LW)", "Draft Undrafted"] },

            // Défenseurs
            { nom: "Alexander Romanov", indices: ["#28 New York Islanders", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Ryan Pulock", indices: ["#6 New York Islanders", "Shoots Right", "(RD)", "Draft 2013"] },
            { nom: "Adam Pelech", indices: ["#3 New York Islanders", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Scott Mayfield", indices: ["#24 New York Islanders", "Shoots Right", "(RD)", "Draft 2011"] },
            { nom: "Tony DeAngelo", indices: ["#4 New York Islanders", "Shoots Right", "(RD)", "Draft 2014"] },
            { nom: "Adam Boqvist", indices: ["#34 New York Islanders", "Shoots Right", "(RD)", "Draft 2018"] },

            // Gardiens
            { nom: "Ilya Sorokin", indices: ["#30 New York Islanders", "Catches Left", "(G)", "Draft 2014"] },
            { nom: "Semyon Varlamov", indices: ["#40 New York Islanders", "Catches Left", "(G)", "Draft 2006"] }
        ],

        "New York Rangers": [
            // Attaquants
            { nom: "Artemi Panarin", indices: ["#10 New York Rangers", "Shoots Right", "(LW)", "Draft Undrafted"] },
            { nom: "Mika Zibanejad", indices: ["#93 New York Rangers", "Shoots Right", "(C)", "Draft 2011"] },
            { nom: "J.T. Miller", indices: ["#8 New York Rangers", "Shoots Left", "(C,W)", "Draft 2011"] },
            { nom: "Alexis Lafreniere", indices: ["#13 New York Rangers", "Shoots Left", "(RW,LW)", "Draft 2020"] },
            { nom: "Vincent Trocheck", indices: ["#16 New York Rangers", "Shoots Right", "(C)", "Draft 2011"] },
            { nom: "Will Cuylle", indices: ["#50 New York Rangers", "Shoots Left", "(LW)", "Draft 2020"] },
            { nom: "Taylor Raddysh", indices: ["#14 New York Rangers", "Shoots Right", "(RW)", "Draft 2016"] },
            { nom: "Juuso Parssinen", indices: ["#71 New York Rangers", "Shoots Left", "(C,LW)", "Draft 2019"] },
            { nom: "Sam Carrick", indices: ["#39 New York Rangers", "Shoots Right", "(C,RW)", "Draft 2010"] },
            { nom: "Adam Edstrom", indices: ["#84 New York Rangers", "Shoots Left", "(C,W)", "Draft 2019"] },
            { nom: "Matt Rempe", indices: ["#73 New York Rangers", "Shoots Right", "(RW,C)", "Draft 2020"] },
            { nom: "Jonny Brodzinski", indices: ["#22 New York Rangers", "Shoots Right", "(C,RW)", "Draft 2013"] },

            // Défenseurs
            { nom: "Adam Fox", indices: ["#23 New York Rangers", "Shoots Right", "(LD)", "Draft 2016"] },
            { nom: "Vladislav Gavrikov", indices: ["#44 New York Rangers", "Shoots Left", "(LD)", "Draft 2015"] },
            { nom: "William Borgen", indices: ["#17 New York Rangers", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "Carson Soucy", indices: ["#24 New York Rangers", "Shoots Left", "(LD)", "Draft 2013"] },
            { nom: "Braden Schneider", indices: ["#4 New York Rangers", "Shoots Right", "(RD)", "Draft 2020"] },
            { nom: "Urho Vaakanainen", indices: ["#18 New York Rangers", "Shoots Left", "(LD)", "Draft 2017"] },
            { nom: "Matthew Robertson", indices: ["#29 New York Rangers", "Shoots Left", "(LD)", "Draft 2019"] },

            // Gardiens
            { nom: "Igor Shesterkin", indices: ["#31 New York Rangers", "Catches Left", "(G)", "Draft 2014"] },
            { nom: "Jonathan Quick", indices: ["#32 New York Rangers", "Catches Left", "(G)", "Draft 2005"] }
        ],



        "Philadelphia Flyers": [
            // Attaquants
            { nom: "Travis Konecny", indices: ["#11 Philadelphia Flyers", "Shoots Right", "(RW,LW)", "Draft 2015"] },
            { nom: "Sean Couturier", indices: ["#14 Philadelphia Flyers", "Shoots Left", "(C)", "Draft 2011"] },
            { nom: "Owen Tippett", indices: ["#74 Philadelphia Flyers", "Shoots Right", "(RW,LW)", "Draft 2017"] },
            { nom: "Trevor Zegras", indices: ["#46 Philadelphia Flyers", "Shoots Left", "(LW,C)", "Draft 2019"] },
            { nom: "Christian Dvorak", indices: ["#28 Philadelphia Flyers", "Shoots Left", "(LW,C)", "Draft 2014"] },
            { nom: "Noah Cates", indices: ["#27 Philadelphia Flyers", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Tyson Foerster", indices: ["#71 Philadelphia Flyers", "Shoots Right", "(RW,LW)", "Draft 2020"] },
            { nom: "Garnet Hathaway", indices: ["#19 Philadelphia Flyers", "Shoots Right", "(RW,LW)", "Draft Undrafted"] },
            { nom: "Nicolas Deslauriers", indices: ["#44 Philadelphia Flyers", "Shoots Left", "(LW)", "Draft 2009"] },
            { nom: "Bobby Brink", indices: ["#10 Philadelphia Flyers", "Shoots Right", "(RW)", "Draft 2019"] },
            { nom: "Alex Bump", indices: ["#20 Philadelphia Flyers", "Shoots Left", "(C,LW)", "Draft 2022"] },
            { nom: "Matvei Michkov", indices: ["#39 Philadelphia Flyers", "Shoots Left", "(LW,RW)", "Draft 2023"] },
            { nom: "Rodrigo Abols", indices: ["#18 Philadelphia Flyers", "Shoots Left", "(C,LW)", "Draft 2016"] },

            // Défenseurs
            //{ nom: "Ryan Ellis", indices: ["#94 Philadelphia Flyers", "Shoots Right", "(D)", "Draft 2009"] },
            { nom: "Travis Sanheim", indices: ["#6 Philadelphia Flyers", "Shoots Left", "(LD,RD)", "Draft 2014"] },
            { nom: "Cam York", indices: ["#8 Philadelphia Flyers", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Rasmus Ristolainen", indices: ["#55 Philadelphia Flyers", "Shoots Right", "(D)", "Draft 2013"] },
            { nom: "Nick Seeler", indices: ["#24 Philadelphia Flyers", "Shoots Left", "(LD)", "Draft 2011"] },
            { nom: "Jamie Drysdale", indices: ["#9 Philadelphia Flyers", "Shoots Right", "(RD)", "Draft 2020"] },
            { nom: "Yegor Zamula", indices: ["#5 Philadelphia Flyers", "Shoots Left", "(LD)", "Draft Undrafted"] },

            // Gardiens
            { nom: "Dan Vladar", indices: ["#80 Philadelphia Flyers", "Catches Left", "(G)", "Draft 2015"] },
            { nom: "Ivan Fedotov", indices: ["#82 Philadelphia Flyers", "Catches Left", "(G)", "Draft 2015"] },
            { nom: "Samuel Ersson", indices: ["#33 Philadelphia Flyers", "Catches Left", "(G)", "Draft 2018"] }
        ],


        "Pittsburgh Penguins": [
            // Attaquants
            { nom: "Sidney Crosby", indices: ["#87 Pittsburgh Penguins", "Shoots Left", "(C)", "Draft 2005"] },
            { nom: "Evgeni Malkin", indices: ["#71 Pittsburgh Penguins", "Shoots Left", "(C)", "Draft 2004"] },
            { nom: "Bryan Rust", indices: ["#17 Pittsburgh Penguins", "Shoots Right", "(RW,LW)", "Draft 2010"] },
            { nom: "Rickard Rakell", indices: ["#67 Pittsburgh Penguins", "Shoots Right", "(W,C)", "Draft 2011"] },
            { nom: "Kevin Hayes", indices: ["#13 Pittsburgh Penguins", "Shoots Left", "(C,LW)", "Draft 2010"] },
            { nom: "Thomas Novak", indices: ["#18 Pittsburgh Penguins", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Anthony Mantha", indices: ["#39 Pittsburgh Penguins", "Shoots Left", "(RW,LW)", "Draft 2013"] },
            { nom: "Danton Heinen", indices: ["#43 Pittsburgh Penguins", "Shoots Left", "(LW,C)", "Draft 2014"] },
            { nom: "Noel Acciari", indices: ["#55 Pittsburgh Penguins", "Shoots Right", "(C,W)", "Draft Undrafted"] },
            { nom: "Blake Lizotte", indices: ["#46 Pittsburgh Penguins", "Shoots Left", "(C,LW)", "Draft Undrafted"] },
            { nom: "Philip Tomasino", indices: ["#53 Pittsburgh Penguins", "Shoots Right", "(C,W)", "Draft 2019"] },
            { nom: "Connor Dewar", indices: ["#19 Pittsburgh Penguins", "Shoots Left", "(C,LW)", "Draft 2018"] },

            // Défenseurs
            { nom: "Erik Karlsson", indices: ["#65 Pittsburgh Penguins", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "Kris Letang", indices: ["#58 Pittsburgh Penguins", "Shoots Right", "(RD)", "Draft 2005"] },
            { nom: "Ryan Graves", indices: ["#27 Pittsburgh Penguins", "Shoots Left", "(LD)", "Draft 2013"] },
            { nom: "Matt Dumba", indices: ["#24 Pittsburgh Penguins", "Shoots Right", "(D)", "Draft 2012"] },
            { nom: "Connor Clifton", indices: ["#4 Pittsburgh Penguins", "Shoots Right", "(RD)", "Draft 2013"] },
            { nom: "Ryan Shea", indices: ["#5 Pittsburgh Penguins", "Shoots Left", "(LD)", "Draft 2015"] },
            { nom: "Alexander Alexeyev", indices: ["#27 Pittsburgh Penguins", "Shoots Left", "(D)", "Draft 2018"] },

            // Gardiens
            { nom: "Tristan Jarry", indices: ["#35 Pittsburgh Penguins", "Catches Left", "(G)", "Draft 2013"] }
        ],


        "Washington Capitals": [
            // Attaquants
            { nom: "Alex Ovechkin", indices: ["#8 Washington Capitals", "Shoots Right", "(LW)", "Draft 2004"] },
            { nom: "Pierre-Luc Dubois", indices: ["#80 Washington Capitals", "Shoots Left", "(C,LW)", "Draft 2016"] },
            { nom: "Tom Wilson", indices: ["#43 Washington Capitals", "Shoots Right", "(RW)", "Draft 2012"] },
            { nom: "Dylan Strome", indices: ["#17 Washington Capitals", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Aliaksei Protas", indices: ["#21 Washington Capitals", "Shoots Left", "(LW,RW)", "Draft 2019"] },
            { nom: "Nic Dowd", indices: ["#26 Washington Capitals", "Shoots Right", "(C)", "Draft 2009"] },
            { nom: "Anthony Beauvillier", indices: ["#72 Washington Capitals", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Connor McMichael", indices: ["#24 Washington Capitals", "Shoots Left", "(C)", "Draft 2019"] },
            { nom: "Sonny Milano", indices: ["#15 Washington Capitals", "Shoots Left", "(LW)", "Draft 2014"] },
            { nom: "Brandon Duhaime", indices: ["#22 Washington Capitals", "Shoots Left", "(RW,LW)", "Draft 2016"] },
            { nom: "Ryan Leonard", indices: ["#9 Washington Capitals", "Shoots Right", "(RW,C)", "Draft 2023"] },
            { nom: "Hendrix Lapierre", indices: ["#29 Washington Capitals", "Shoots Left", "(C)", "Draft 2020"] },
            { nom: "Justin Sourdif", indices: ["#34 Washington Capitals", "Shoots Right", "(RW,C)", "Draft 2020"] },

            // Défenseurs
            { nom: "Jakob Chychrun", indices: ["#6 Washington Capitals", "Shoots Left", "(LD)", "Draft 2016"] },
            { nom: "John Carlson", indices: ["#74 Washington Capitals", "Shoots Right", "(RD)", "Draft 2008"] },
            { nom: "Matt Roy", indices: ["#3 Washington Capitals", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "Rasmus Sandin", indices: ["#38 Washington Capitals", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Trevor van Riemsdyk", indices: ["#57 Washington Capitals", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Martin Fehervary", indices: ["#42 Washington Capitals", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Declan Chisholm", indices: ["#47 Washington Capitals", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Dylan McIlrath", indices: ["#52 Washington Capitals", "Shoots Right", "(RD)", "Draft 2010"] },

            // Gardiens
            { nom: "Logan Thompson", indices: ["#48 Washington Capitals", "Catches Right", "(G)", "Draft Undrafted"] },
            { nom: "Charlie Lindgren", indices: ["#79 Washington Capitals", "Catches Right", "(G)", "Draft Undrafted"] }
        ],

        "Boston Bruins": [
            // Attaquants
            { nom: "David Pastrnak", indices: ["#88 Boston Bruins", "Shoots Right", "(RW,LW)", "Draft 2014"] },
            { nom: "Elias Lindholm", indices: ["#28 Boston Bruins", "Shoots Right", "(C,RW)", "Draft 2013"] },
            { nom: "Casey Mittelstadt", indices: ["#11 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2017"] },
            { nom: "Morgan Geekie", indices: ["#39 Boston Bruins", "Shoots Right", "(C,RW)", "Draft 2017"] },
            { nom: "Pavel Zacha", indices: ["#18 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2015"] },
            { nom: "Viktor Arvidsson", indices: ["#71 Boston Bruins", "Shoots Right", "(LW,RW)", "Draft 2014"] },
            { nom: "Tanner Jeannot", indices: ["#84 Boston Bruins", "Shoots Left", "(LW,RW)", "Draft Undrafted"] },
            { nom: "Sean Kuraly", indices: ["#52 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2011"] },
            { nom: "Mark Kastelic", indices: ["#47 Boston Bruins", "Shoots Right", "(C,RW)", "Draft 2019"] },
            { nom: "Michael Eyssimont", indices: ["#81 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2016"] },
            { nom: "Marat Khusnutdinov", indices: ["#92 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2020"] },
            { nom: "John Beecher", indices: ["#19 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2019"] },
            { nom: "Matthew Poitras", indices: ["#51 Boston Bruins", "Shoots Right", "(C,RW)", "Draft 2022"] },
            { nom: "Fraser Minten", indices: ["#93 Boston Bruins", "Shoots Left", "(C,LW)", "Draft 2022"] },

            // Défenseurs
            { nom: "Charlie McAvoy", indices: ["#73 Boston Bruins", "Shoots Right", "(RD)", "Draft 2016"] },
            { nom: "Hampus Lindholm", indices: ["#27 Boston Bruins", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Nikita Zadorov", indices: ["#91 Boston Bruins", "Shoots Left", "(LD)", "Draft 2013"] },
            { nom: "Mason Lohrei", indices: ["#6 Boston Bruins", "Shoots Left", "(LD)", "Draft 2020"] },
            { nom: "Henri Jokiharju", indices: ["#20 Boston Bruins", "Shoots Right", "(RD)", "Draft 2017"] },
            { nom: "Andrew Peeke", indices: ["#26 Boston Bruins", "Shoots Right", "(RD)", "Draft 2016"] },
            { nom: "Jordan Harris", indices: ["#43 Boston Bruins", "Shoots Left", "(LD)", "Draft 2018"] },

            // Gardiens
            { nom: "Jeremy Swayman", indices: ["#1 Boston Bruins", "Catches Left", "(G)", "Draft 2017"] },
            { nom: "Joonas Korpisalo", indices: ["#70 Boston Bruins", "Catches Left", "(G)", "Draft 2012"] }
        ],

        "Buffalo Sabres": [
            // Attaquants
            { nom: "Joshua Norris", indices: ["#13 Buffalo Sabres", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Tage Thompson", indices: ["#72 Buffalo Sabres", "Shoots Right", "(C, RW)", "Draft 2016"] },
            { nom: "Ryan McLeod", indices: ["#71 Buffalo Sabres", "Shoots Left", "(C, LW)", "Draft 2018"] },
            { nom: "Jason Zucker", indices: ["#17 Buffalo Sabres", "Shoots Left", "(LW)", "Draft 2010"] },
            { nom: "Alex Tuch", indices: ["#89 Buffalo Sabres", "Shoots Right", "(RW)", "Draft 2014"] },
            { nom: "Jordan Greenway", indices: ["#12 Buffalo Sabres", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Jack Quinn", indices: ["#22 Buffalo Sabres", "Shoots Right", "(RW, LW)", "Draft 2020"] },
            { nom: "Peyton Krebs", indices: ["#19 Buffalo Sabres", "Shoots Left", "(C, LW)", "Draft 2019"] },
            { nom: "Beck Malenstyn", indices: ["#29 Buffalo Sabres", "Shoots Left", "(LW)", "Draft 2016"] },
            { nom: "Zach Benson", indices: ["#9 Buffalo Sabres", "Shoots Left", "(LW, RW)", "Draft 2023"] },
            { nom: "Jiri Kulich", indices: ["#20 Buffalo Sabres", "Shoots Left", "(C, LW)", "Draft 2022"] },

            // Défenseurs
            { nom: "Rasmus Dahlin", indices: ["#26 Buffalo Sabres", "Shoots Left", "(LD)", "Draft 2018"] },
            { nom: "Owen Power", indices: ["#25 Buffalo Sabres", "Shoots Left", "(LD)", "Draft 2021"] },
            { nom: "Bowen Byram", indices: ["#4 Buffalo Sabres", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Mattias Samuelsson", indices: ["#23 Buffalo Sabres", "Shoots Left", "(LD,RD)", "Draft 2018"] },
            { nom: "Jacob Bryson", indices: ["#78 Buffalo Sabres", "Shoots Left", "(LD)", "Draft 2017"] },

            // Gardiens
            { nom: "Ukko‑Pekka Luukkonen", indices: ["#1 Buffalo Sabres", "Catches Left", "(G)", "Draft 2017"] },
            { nom: "Alex Lyon", indices: ["#34 Buffalo Sabres", "Catches Left", "(G)", "Draft Undrafted"] },
            //{ nom: "Devon Levi", indices: ["#27 Buffalo Sabres", "Catches Left", "(G)", "Draft 2010"] }
        ],


        "Detroit Red Wings": [
            // Attaquants
            { nom: "Dylan Larkin", indices: ["#71 Detroit Red Wings", "Shoots Left", "(C)", "Draft 2014"] },
            { nom: "Lucas Raymond", indices: ["#23 Detroit Red Wings", "Shoots Right", "(RW)", "Draft 2020"] },
            { nom: "Alex DeBrincat", indices: ["#93 Detroit Red Wings", "Shoots Right", "(LW, RW)", "Draft 2016"] },
            { nom: "Andrew Copp", indices: ["#18 Detroit Red Wings", "Shoots Left", "(C, LW)", "Draft 2013"] },
            { nom: "J.T. Compher", indices: ["#37 Detroit Red Wings", "Shoots Right", "(C, W)", "Draft 2013"] },
            { nom: "Michael Rasmussen", indices: ["#27 Detroit Red Wings", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Patrick Kane", indices: ["#88 Detroit Red Wings", "Shoots Left", "(RW)", "Draft 2007"] },
            { nom: "Jonatan Berggren", indices: ["#48 Detroit Red Wings", "Shoots Left", "(RW, LW)", "Draft 2018"] },
            { nom: "Elmer Soderblom", indices: ["#85 Detroit Red Wings", "Shoots Left", "(LW, RW)", "Draft 2019"] },
            //{ nom: "Mason Appleton", indices: ["# Detroit Red Wings", "Shoots Right", "(RW)", "Draft 2015"] },
            { nom: "James van Riemsdyk", indices: ["#21 Detroit Red Wings", "Shoots Left", "(LW)", "Draft 2007"] },
            //{ nom: "Carter Mazur", indices: ["# Detroit Red Wings", "Shoots Right", "(LW)", "Draft 2021"] },
            { nom: "Marco Kasper", indices: ["#92 Detroit Red Wings", "Shoots Left", "(C)", "Draft 2022"] },
            { nom: "Austin Watson", indices: ["#24 Detroit Red Wings", "Shoots Right", "(RW, LW)", "Draft 2010"] },

            // Défenseurs
            { nom: "Moritz Seider", indices: ["#53 Detroit Red Wings", "Shoots Right", "(RD)", "Draft 2019"] },
            { nom: "Ben Chiarot", indices: ["#8 Detroit Red Wings", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "Justin Holl", indices: ["#3 Detroit Red Wings", "Shoots Right", "(RD)", "Draft 2010"] },
            { nom: "Erik Gustafsson", indices: ["#56 Detroit Red Wings", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Albert Johansson", indices: ["#20 Detroit Red Wings", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Simon Edvinsson", indices: ["#77 Detroit Red Wings", "Shoots Left", "(LD)", "Draft 2021"] },

            // Gardien
            { nom: "Cam Talbot", indices: ["#39 Detroit Red Wings", "Catches Left", "(G)", "Draft Undrafted"] }
        ],


        "Florida Panthers": [
            // Attaquants
            { nom: "Aleksander Barkov", indices: ["#16 Florida Panthers", "Shoots Left", "(C)", "Draft 2013"] },
            { nom: "Matthew Tkachuk", indices: ["#19 Florida Panthers", "Shoots Left", "(LW,RW)", "Draft 2016"] },
            { nom: "Sam Reinhart", indices: ["#13 Florida Panthers", "Shoots Right", "(C,RW)", "Draft 2014"] },
            { nom: "Sam Bennett", indices: ["#9 Florida Panthers", "Shoots Left", "(C,LW)", "Draft 2014"] },
            { nom: "Carter Verhaeghe", indices: ["#23 Florida Panthers", "Shoots Left", "(C,LW)", "Draft 2013"] },
            { nom: "Brad Marchand", indices: ["#63 Florida Panthers", "Shoots Left", "(LW,C)", "Draft 2006"] },
            { nom: "Anton Lundell", indices: ["#15 Florida Panthers", "Shoots Left", "(C)", "Draft 2020"] },
            { nom: "Evan Rodrigues", indices: ["#17 Florida Panthers", "Shoots Right", "(C,W)", "Draft Undrafted"] },
            { nom: "Eetu Luostarinen", indices: ["#27 Florida Panthers", "Shoots Left", "(C)", "Draft 2017"] },
            { nom: "Jesper Boqvist", indices: ["#70 Florida Panthers", "Shoots Left", "(C,LW)", "Draft 2017"] },
            { nom: "A.J. Greer", indices: ["#10 Florida Panthers", "Shoots Left", "(LW)", "Draft 2015"] },
            { nom: "Tomas Nosek", indices: ["#92 Florida Panthers", "Shoots Left", "(LW,C)", "Draft Undrafted"] },
            { nom: "Jonah Gadjovich", indices: ["#12 Florida Panthers", "Shoots Left", "(LW)", "Draft 2017"] },
            { nom: "Mackie Samoskevich", indices: ["#25 Florida Panthers", "Shoots Right", "(RW,C)", "Draft 2021"] },

            // Défenseurs
            { nom: "Seth Jones", indices: ["#3 Florida Panthers", "Shoots Right", "(RD)", "Draft 2013"] },
            { nom: "Aaron Ekblad", indices: ["#5 Florida Panthers", "Shoots Right", "(RD)", "Draft 2014"] },
            { nom: "Gustav Forsling", indices: ["#42 Florida Panthers", "Shoots Left", "(LD)", "Draft 2014"] },
            { nom: "Niko Mikkola", indices: ["#77 Florida Panthers", "Shoots Left", "(LD)", "Draft 2015"] },
            { nom: "Uvis Balinskis", indices: ["#26 Florida Panthers", "Shoots Left", "(LD)", "Draft Undrafted"] },
            { nom: "Dmitry Kulikov", indices: ["#7 Florida Panthers", "Shoots Left", "(LD)", "Draft 2009"] },

            // Gardiens
            { nom: "Sergei Bobrovsky", indices: ["#72 Florida Panthers", "Catches Left", "(G)", "Draft Undrafted"] }
        ],


        "Montreal Canadiens": [
            // Attaquants
            { nom: "Patrik Laine", indices: ["#92 Montreal Canadiens", "Shoots Right", "(LW,RW)", "Draft 2016"] },
            { nom: "Nick Suzuki", indices: ["#14 Montreal Canadiens", "Shoots Right", "(C)", "Draft 2017"] },
            { nom: "Cole Caufield", indices: ["#13 Montreal Canadiens", "Shoots Right", "(LW,RW)", "Draft 2019"] },
            { nom: "Juraj Slafkovsky", indices: ["#20 Montreal Canadiens", "Shoots Left", "(RW,LW)", "Draft 2022"] },
            { nom: "Brendan Gallagher", indices: ["#11 Montreal Canadiens", "Shoots Right", "(RW)", "Draft 2010"] },
            { nom: "Josh Anderson", indices: ["#17 Montreal Canadiens", "Shoots Right", "(RW,LW)", "Draft 2012"] },
            { nom: "Kirby Dach", indices: ["#77 Montreal Canadiens", "Shoots Right", "(C)", "Draft 2019"] },
            { nom: "Alex Newhook", indices: ["#15 Montreal Canadiens", "Shoots Left", "(C,LW)", "Draft 2019"] },
            { nom: "Jake Evans", indices: ["#71 Montreal Canadiens", "Shoots Right", "(C)", "Draft 2014"] },
            { nom: "Ivan Demidov", indices: ["#93 Montreal Canadiens", "Shoots Left", "(RW,LW)", "Draft 2024"] },
            { nom: "Oliver Kapanen", indices: ["#91 Montreal Canadiens", "Shoots Right", "(C,RW)", "Draft 2021"] },
            { nom: "Joe Veleno", indices: ["#90 Montreal Canadiens", "Shoots Left", "(C,LW)", "Draft 2018"] },
            { nom: "Zack Bolduc", indices: ["#76 Montreal Canadiens", "Shoots Left", "(RW,LW)", "Draft 2021"] },

            // Défenseurs
            { nom: "Noah Dobson", indices: ["#53 Montreal Canadiens", "Shoots Right", "(D)", "Draft 2018"] },
            { nom: "Kaiden Guhle", indices: ["#21 Montreal Canadiens", "Shoots Left", "(LD)", "Draft 2020"] },
            { nom: "Mike Matheson", indices: ["#8 Montreal Canadiens", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Alexandre Carrier", indices: ["#45 Montreal Canadiens", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "Jayden Struble", indices: ["#47 Montreal Canadiens", "Shoots Left", "(LD)", "Draft 2019"] },
            { nom: "Arber Xhekaj", indices: ["#72 Montreal Canadiens", "Shoots Left", "(LD)", "Draft Undrafted"] },
            { nom: "Lane Hutson", indices: ["#48 Montreal Canadiens", "Shoots Left", "(LD,RD)", "Draft 2022"] },

            // Gardiens
            { nom: "Carey Price", indices: ["#31 Montreal Canadiens", "Catches Left", "(G)", "Draft 2005"] },
            { nom: "Samuel Montembeault", indices: ["#35 Montreal Canadiens", "Catches Left", "(G)", "Draft 2015"] }
        ],

        "Ottawa Senators": [
            // Attaquants
            { nom: "Tim Stützle", indices: ["#18 Ottawa Senators", "Shoots Left", "(C)", "Draft 2020"] },
            { nom: "Brady Tkachuk", indices: ["#7 Ottawa Senators", "Shoots Left", "(LW)", "Draft 2018"] },
            { nom: "Dylan Cozens", indices: ["#24 Ottawa Senators", "Shoots Right", "(C)", "Draft 2019"] },
            { nom: "Drake Batherson", indices: ["#19 Ottawa Senators", "Shoots Right", "(RW)", "Draft 2017"] },
            { nom: "Fabian Zetterlund", indices: ["#20 Ottawa Senators", "Shoots Right", "(LW,RW)", "Draft 2017"] },
            { nom: "David Perron", indices: ["#57 Ottawa Senators", "Shoots Right", "(LW,RW)", "Draft 2007"] },
            { nom: "Shane Pinto", indices: ["#12 Ottawa Senators", "Shoots Right", "(C)", "Draft 2019"] },
            { nom: "Ridly Greig", indices: ["#71 Ottawa Senators", "Shoots Left", "(C,LW)", "Draft 2020"] },
            { nom: "Michael Amadio", indices: ["#22 Ottawa Senators", "Shoots Right", "(W,C)", "Draft 2014"] },
            { nom: "Claude Giroux", indices: ["#28 Ottawa Senators", "Shoots Right", "(LW,RW)", "Draft 2006"] },
            { nom: "Lars Eller", indices: ["#89 Ottawa Senators", "Shoots Left", "(C,LW)", "Draft 2007"] },
            { nom: "Nick Cousins", indices: ["#21 Ottawa Senators", "Shoots Left", "(C,LW)", "Draft 2011"] },

            // Défenseurs
            { nom: "Jake Sanderson", indices: ["#85 Ottawa Senators", "Shoots Left", "(LD)", "Draft 2020"] },
            { nom: "Thomas Chabot", indices: ["#72 Ottawa Senators", "Shoots Left", "(LD)", "Draft 2015"] },
            { nom: "Artem Zub", indices: ["#2 Ottawa Senators", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Nick Jensen", indices: ["#3 Ottawa Senators", "Shoots Right", "(RD)", "Draft 2009"] },
            { nom: "Tyler Kleven", indices: ["#43 Ottawa Senators", "Shoots Left", "(LD)", "Draft 2020"] },
            { nom: "Nikolas Matinpalo", indices: ["#33 Ottawa Senators", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Donovan Sebrango", indices: ["#37 Ottawa Senators", "Shoots Left", "(D)", "Draft 2020"] },

            // Gardiens
            { nom: "Linus Ullmark", indices: ["#35 Ottawa Senators", "Catches Left", "(G)", "Draft 2012"] },
            { nom: "Leevi Meriläinen", indices: ["#1 Ottawa Senators", "Catches Left", "(G)", "Draft 2020"] }
        ],

        "Tampa Bay Lightning": [
            // Attaquants
            { nom: "Nikita Kucherov", indices: ["#86 Tampa Bay Lightning", "Shoots Left", "(RW)", "Draft 2011"] },
            { nom: "Brayden Point", indices: ["#21 Tampa Bay Lightning", "Shoots Right", "(C)", "Draft 2014"] },
            { nom: "Jake Guentzel", indices: ["#59 Tampa Bay Lightning", "Shoots Left", "(LW)", "Draft 2013"] },
            { nom: "Brandon Hagel", indices: ["#38 Tampa Bay Lightning", "Shoots Left", "(LW)", "Draft 2016"] },
            { nom: "Anthony Cirelli", indices: ["#71 Tampa Bay Lightning", "Shoots Left", "(C)", "Draft 2015"] },
            { nom: "Oliver Bjorkstrand", indices: ["#22 Tampa Bay Lightning", "Shoots Right", "(RW)", "Draft 2013"] },
            { nom: "Nick Paul", indices: ["#20 Tampa Bay Lightning", "Shoots Left", "(LW,C)", "Draft 2013"] },
            { nom: "Yanni Gourde", indices: ["#37 Tampa Bay Lightning", "Shoots Left", "(C,LW)", "Draft Undrafted"] },
            { nom: "Gage Goncalves", indices: ["#93 Tampa Bay Lightning", "Shoots Left", "(LW,RW)", "Draft 2020"] },
            { nom: "Conor Geekie", indices: ["#14 Tampa Bay Lightning", "Shoots Left", "(RW,C)", "Draft 2022"] },
            { nom: "Zemgus Girgensons", indices: ["#28 Tampa Bay Lightning", "Shoots Left", "(W,C)", "Draft 2012"] },
            { nom: "Mitchell Chaffee", indices: ["#41 Tampa Bay Lightning", "Shoots Right", "(RW)", "Draft Undrafted"] },

            // Défenseurs
            { nom: "Victor Hedman", indices: ["#77 Tampa Bay Lightning", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "Ryan McDonagh", indices: ["#27 Tampa Bay Lightning", "Shoots Left", "(LD)", "Draft 2007"] },
            { nom: "Erik Cernak", indices: ["#81 Tampa Bay Lightning", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "J.J. Moser", indices: ["#90 Tampa Bay Lightning", "Shoots Left", "(LD)", "Draft 2021"] },
            { nom: "Darren Raddysh", indices: ["#43 Tampa Bay Lightning", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Emil Lilleberg", indices: ["#78 Tampa Bay Lightning", "Shoots Left", "(LD)", "Draft 2021"] },

            // Gardiens
            { nom: "Andrei Vasilevskiy", indices: ["#88 Tampa Bay Lightning", "Catches Left", "(G)", "Draft 2012"] },
            { nom: "Jonas Johansson", indices: ["#31 Tampa Bay Lightning", "Catches Left", "(G)", "Draft 2014"] }
        ],

        "Toronto Maple Leafs": [
            // Attaquants
            { nom: "Auston Matthews", indices: ["#34 Toronto Maple Leafs", "Shoots Left", "(C)", "Draft 2016"] },
            { nom: "William Nylander", indices: ["#88 Toronto Maple Leafs", "Shoots Right", "(C,RW)", "Draft 2014"] },
            { nom: "Matthew Knies", indices: ["#23 Toronto Maple Leafs", "Shoots Left", "(LW,RW)", "Draft 2021"] },
            { nom: "John Tavares", indices: ["#91 Toronto Maple Leafs", "Shoots Left", "(C,LW)", "Draft 2009"] },
            { nom: "Max Domi", indices: ["#11 Toronto Maple Leafs", "Shoots Left", "(C,LW)", "Draft 2013"] },
            { nom: "Matias Maccelli", indices: ["#63 Toronto Maple Leafs", "Shoots Left", "(LW,RW)", "Draft 2019"] },
            { nom: "Dakota Joshua", indices: ["#81 Toronto Maple Leafs", "Shoots Left", "(C,LW)", "Draft 2014"] },
            { nom: "Nicolas Roy", indices: ["#55 Toronto Maple Leafs", "Shoots Right", "(C,RW)", "Draft 2015"] },
            { nom: "David Kampf", indices: ["#64 Toronto Maple Leafs", "Shoots Left", "(C,LW)", "Draft Undrafted"] },
            { nom: "Calle Jarnkrok", indices: ["#19 Toronto Maple Leafs", "Shoots Right", "(LW,RW)", "Draft 2010"] },
            { nom: "Scott Laughton", indices: ["#24 Toronto Maple Leafs", "Shoots Left", "(C,LW)", "Draft 2012"] },
            { nom: "Steven Lorentz", indices: ["#18 Toronto Maple Leafs", "Shoots Left", "(LW,RW)", "Draft 2015"] },
            { nom: "Bobby McMann", indices: ["#74 Toronto Maple Leafs", "Shoots Left", "(LW)", "Draft Undrafted"] },
            //{ nom: "Michael Pezzetta", indices: ["# Toronto Maple Leafs", "Shoots Left", "(LW,C)", "Draft 2010"] },
            { nom: "Nicholas Robertson", indices: ["#89 Toronto Maple Leafs", "Shoots Left", "(LW,RW)", "Draft 2019"] },

            // Défenseurs
            { nom: "Morgan Rielly", indices: ["#44 Toronto Maple Leafs", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Jake McCabe", indices: ["#22 Toronto Maple Leafs", "Shoots Left", "(LD)", "Draft 2012"] },
            { nom: "Christopher Tanev", indices: ["#8 Toronto Maple Leafs", "Shoots Right", "(RD)", "Draft Undrafted"] },
            { nom: "Oliver Ekman‑Larsson", indices: ["#95 Toronto Maple Leafs", "Shoots Left", "(LD)", "Draft 2009"] },
            { nom: "Brandon Carlo", indices: ["#25 Toronto Maple Leafs", "Shoots Right", "(RD)", "Draft 2015"] },
            { nom: "Simon Benoît", indices: ["#2 Toronto Maple Leafs", "Shoots Left", "(LD)", "Draft Undrafted"] },
            { nom: "Henry Thrun", indices: ["#3 Toronto Maple Leafs", "Shoots Left", "(LD)", "Draft 2019"] },

            // Gardiens
            { nom: "Joseph Woll", indices: ["#60 Toronto Maple Leafs", "Catches Left", "(G)", "Draft 2016"] },
            { nom: "Anthony Stolarz", indices: ["#41 Toronto Maple Leafs", "Catches Left", "(G)", "Draft 2012"] }
        ]
};

async function loadAllTeams() {
  let teamsData = [];
  try {
    const teamsResp = await fetch("http://localhost:3000/teams");
    teamsData = await teamsResp.json();
    if (!Array.isArray(teamsData) || teamsData.length === 0) {
      console.warn("Proxy returned empty or invalid teams, using local data.");
      joueursParEquipe = { ...localTeams };
      return;
    }
  } catch (err) {
    console.warn("Impossible de récupérer les équipes via proxy, utilisation des données locales.", err);
    joueursParEquipe = { ...localTeams };
    return;
  }

  for (const t of teamsData) {
    try {
      const teamId = t.id || t.TeamID;
      const teamName = t.name || t.Name;
      const resp = await fetch(`http://localhost:3000/roster/${teamId}`);
      const data = await resp.json();
      if (!data.roster || !Array.isArray(data.roster)) {
        console.warn(`Roster vide pour ${teamName}`);
        joueursParEquipe[teamName] = [];
        continue;
      }

      joueursParEquipe[teamName] = data.roster.map(p => ({
        nom: p.person?.fullName || p.fullName || "Unknown",
        indices: [
          `#${p.jerseyNumber || p.Jersey || "?"} ${teamName}`,
          p.position?.code === "G" ? `Catches ${p.shootsCatches || "Left"}` : `Shoots ${p.shootsCatches || "Right"}`,
          `(${p.position?.code || p.Position || "?"})`,
          p.draft?.year ? `Draft ${p.draft.year}` : "Draft info unavailable"
        ]
      }));
    } catch (err) {
      console.warn(`Impossible de récupérer le roster pour ${t.name || t.Name}`, err);
      joueursParEquipe[t.name || t.Name] = [];
    }
  }
}

async function fetchRoster(teamId, teamName) {
  try {
    const resp = await fetch(`http://localhost:3000/roster/${teamId}`);
    const data = await resp.json();

    if (!data.roster || !Array.isArray(data.roster)) {
      console.warn(`Roster vide pour ${teamName}`, data);
      return [];
    }

    return data.roster.map(p => ({
      nom: p.person?.fullName || p.fullName || "Unknown",
      indices: [
        `#${p.jerseyNumber || p.Jersey || "?"} ${teamName}`,
        p.position?.code === "G" ? `Catches ${p.shootsCatches || "Left"}` : `Shoots ${p.shootsCatches || "Right"}`,
        `(${p.position?.code || p.Position || "?"})`,
        p.draft?.year ? `Draft ${p.draft.year}` : "Draft info unavailable"
      ]
    }));
  } catch (err) {
    console.error(`Erreur récupération roster ${teamName}:`, err);
    return [];
  }
}


// -------------------------
// 3️⃣ Fonctions utilitaires du jeu
// -------------------------
function getAllPlayers() {
  let all = [];
  for (const e in joueursParEquipe) all = all.concat(joueursParEquipe[e]);
  return all;
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

function initialiserJeu(nb) {
  const copie = JSON.parse(JSON.stringify(getAllPlayers()));
  melangerArray(copie);
  joueurs = copie.slice(0, nb);
  remplirSuggestions();
}

function afficherIndice() {
  const joueur = joueurs[joueurIndex];
  if (!joueur) return;
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

// -------------------------
// 4️⃣ Gestion des événements
// -------------------------
boutonSkip.addEventListener("click", () => {
  const joueur = joueurs[joueurIndex];
  if (!joueur) return;
  boutonValider.textContent = "Next";
  boutonValider.style.marginTop = "4px";
  enAttenteDeSuivant = true;
  boutonHint.style.display = "none";
  boutonSkip.style.display = "none";
  messageDiv.innerHTML = `Skipped! The correct answer was <span style="color: green;">${joueur.nom}</span>.`;
});

boutonValider.addEventListener("click", () => {
  const joueur = joueurs[joueurIndex];
  if (!joueur) return;

  if (enAttenteDeSuivant) {
    passeAuJoueurSuivant();
    boutonValider.textContent = "Guess";
    enAttenteDeSuivant = false;
    return;
  }

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

  
  messageDiv.textContent = "Loading players… please wait...";
  await loadAllTeams();
  initialiserJeu(nbJoueurs);
  indiceDiv.textContent= "";
  afficherIndice();
  messageDiv.textContent = `Guesses Left: ${essaisRestants}`;
});
