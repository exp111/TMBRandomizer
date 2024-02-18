const names = {
    "base": "Base Set",
    "40d": "40 Days",
    "aot": "Age of Tyranny",
    "rot": "Rage of Tyranny",
    "aos": "Automaton of Shale",
    "sd": "Splice & Dice",
    "ut": "Undertow",
    "ub": "Unbreakable",
    "40w": "40 Waves",
    "40c": "40 Caves"
}

const gameplayAddons = [
    "base", "40d", "aot", "rot", "aos", "sd", "ut", "ub", "40w", "40c"
];

class Encounter {
    SetID = "";
    Type = "";
    Number = "";

    constructor(setID, type, number) {
        this.SetID = setID;
        this.Type = type;
        this.Number = number;
    }

    toString() {
        return `${names[this.SetID]} - ${this.Type} - ${this.Number}`;
    }
}

class Gearloc {
    ID = "";
    Name = "";

    constructor(name) {
        this.ID = name.toLowerCase().replaceAll(" ", "-");
        this.Name = name;
    }
}

class Tyrant {
    SetID = "";
    ID = "";
    Name = "";
    Progress = 0;
    Days = 0;
    Encounters = 0;
    Cards = [];

    constructor(setID, name, progress, days, encounters) {
        this.SetID = setID;
        this.ID = name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll("&","");
        this.Name = name;
        this.Progress = progress;
        this.Days = days;
        this.Encounters = encounters;
        this.buildCards();
    }

    buildCards() {
        for (let i = 0; i < this.Encounters; i++) {
            this.Cards.push(new Encounter(this.SetID, this.Name, `${i + 1}/${this.Encounters}`));
        }
    }
}

function buildCards(setID, type, num, start = 1) {
    let res = [];
    let end = start + num;
    for (let i = start; i < end; i++) {
        let num = i.toString().padStart(3, "0");
        res.push(new Encounter(setID, type, num));
    }
    return res;
}

//TODO: move into class/scope
const gearlocs = [
    new Gearloc("Patches"),
    new Gearloc("Picket"),
    new Gearloc("Boomer"),
    new Gearloc("Tantrum"),
    new Gearloc("Ghillie"),
    new Gearloc("Nugget"),
    new Gearloc("Tink"),
    new Gearloc("Gasket"),
    new Gearloc("Dart"),
    new Gearloc("Carcass"),
    new Gearloc("Polaris"),
    new Gearloc("Static"),
    new Gearloc("Lab Rats"),
    new Gearloc("Riffle"),
    new Gearloc("Duster"),
    new Gearloc("Stanza"),
    new Gearloc("Gale"),
    new Gearloc("Figment"),
];
const tyrants = [
    new Tyrant("base", "Duster", 10, 13, 3),
    new Tyrant("base", "Mulmesh", 6, 9, 1),
    new Tyrant("base", "Marrow", 10, 12, 2),
    new Tyrant("base", "Nom", 6, 8, 1),
    new Tyrant("base", "The Goblin King", 8, 12, 2),
    new Tyrant("base", "Gendricks", 8, 10, 2),
    new Tyrant("base", "Drellen", 6, 10, 1),
    new Tyrant("aos", "Automaton of Shale", 9, 11, 1),
    new Tyrant("sd", "Amanight", 6, 8, 5),
    new Tyrant("sd", "Blobulous", 6, 8, 4),
    new Tyrant("sd", "Leech", 5, 7, 3),
    new Tyrant("sd", "Oxide", 7, 9, 4),
    new Tyrant("sd", "Locgear", 8, 10, 5),
    new Tyrant("ut", "Nobulous & The Abomination", 7, 10, 2),
    new Tyrant("ut", "Barnacle", 5, 8, 2),
    new Tyrant("ut", "Vol'Kesh", 7, 11, 2),
    new Tyrant("ut", "The Goblin Queen", 6, 9, 1),
    new Tyrant("ut", "Kollossum", 5, 7, 1),
    new Tyrant("ub", "Domina & Domina's Scouts", 7, 10, 3),
    new Tyrant("ub", "Rok & Rol", 5, 7, 2),
    new Tyrant("ub", "Gavenkog", 8, 11, 2),
    new Tyrant("ub", "Nexus", 9, 11, 4),
    new Tyrant("ub", "Cinder", 6, 9, 2),
];
const cards = {
    // Base
    "base-d1": [new Encounter("base", "Special", "001")],
    "base-d2": [new Encounter("base", "Special", "002")],
    "base-d3": [new Encounter("base", "Special", "003")],
    "base": buildCards("base", "General", 30),
    "base-solo": buildCards("base", "Solo", 12),
    // 40 Days
    "40d": buildCards("40d", "General", 24),
    "40d-solo": buildCards("40d", "Solo", 12),
    "40d-nom": [new Encounter("40d", "Nom", "1/1")],
    "40d-mulmesh": [new Encounter("40d", "Mulmesh", "1/1")],
    "40d-drellen": [new Encounter("40d", "Drellen", "1/1")],
    // AoT
    "aot-d1": buildCards("aot", "Special", 7),
    "aot-d2": buildCards("aot", "Special", 7, 8),
    "aot-d3": buildCards("aot", "Special", 7, 15),
    // RoT
    "rot-d1": buildCards("rot", "Special", 4),
    "rot-d2": buildCards("rot", "Special", 4, 9),
    "rot-d3": buildCards("rot", "Special", 4, 17),
    // AoS
    "aos": buildCards("aos", "General/Solo", 5),
    "aos-solo": buildCards("aos", "General/Solo", 5),
    "aos-d1": [new Encounter("aos", "Special", "001")],
    "aos-d2": [new Encounter("aos", "Special", "002")],
    "aos-d3": [new Encounter("aos", "Special", "003")],
    // UT
    "ut": buildCards("ut", "General", 29),
    "ut-solo": buildCards("ut", "Solo", 12),
    "ut-d1": buildCards("ut", "Special", 4),
    "ut-d2": buildCards("ut", "Special", 4, 5),
    // 40w
    "40w": buildCards("40w", "General", 26),
    "40w-solo": buildCards("40w", "Solo", 12),
    "40w-the-goblin-queen": [new Encounter("40w", "The Goblin Queen", "1/1")],
    "40w-kollossum": [new Encounter("40w", "Kollossum", "1/1")],
    // UB
    "ub": buildCards("ub", "General", 27),
    "ub-solo": buildCards("ub", "Solo", 12),
    "ub-d1": buildCards("ub", "Special", 8),
    "ub-d2": buildCards("ub", "Special", 8, 9),
    // 40c
    "40c": buildCards("40c", "General", 24),
    "40c-solo": buildCards("40c", "Solo", 12),
    "40c-cinder": [new Encounter("40c", "Cinder", "1/1")],
};

function getAvailableGearlocs(owned) {
    return gearlocs.filter(g => owned[g.ID]);
}
function getAvailableTyrants(owned) {
    return tyrants.filter(t => owned[t.SetID]);
}

class Setup {
    Gearlocs = null;
    Tyrant = null;
    Encounters = null;
    Error = null;

    constructor(gearlocs, tyrant, encounters, error) {
        this.Gearlocs = gearlocs;
        this.Tyrant = tyrant;
        this.Encounters = encounters;
        this.Error = error;
    }

    static Randomize(owned, solo, players, tyrantID = null) {
        function randomEl(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function takeRandomEl(arr) {
            let index = Math.floor(Math.random() * arr.length);
            return arr.splice(index, 1)[0];
        }

        function shuffleArr(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        }

        // get the gearlocs
        let gearlocPool = getAvailableGearlocs(owned);
        let selectedGearlocs = [];
        if (gearlocPool.length < players)
            return new Setup(null, null, null, `Too few gearlocs for this player count (${players}).`);
        for (let i = 0; i < players; i++)
            selectedGearlocs.push(takeRandomEl(gearlocPool)); // fetch a random gearloc
        // get the tyrant
        let tyrantPool = getAvailableTyrants(owned);
        let tyrant = null;
        if (tyrantID == null) // fetch a random tyrant
            tyrant = randomEl(tyrantPool);
        else
            tyrant = tyrantPool.find(t => t.ID == tyrantID);
        let amountDays = (tyrant.SetID == "ut" || tyrant.SetID == "ub") ? 2 : 3;
        // build pool of cards
        let tyrantCardPool = [...tyrant.Cards];
        let day13Pool = [];
        let encounterPool = [];
        let suffix = solo ? "-solo" : "";
        for (let set of Object.keys(owned)) {
            if (!owned[set])
                continue;
            // add all day 1-3 cards from this set into the pool
            for (let i = 0; i < amountDays; i++) {
                day13Pool.push([]);
                let d = `${set}-d${i + 1}`;
                if (cards.hasOwnProperty(d)) {
                    day13Pool[i].push(...cards[d]);
                }
            }

            // add all encounters from this set into the encounter pool
            let s = `${set}${suffix}`;
            if (cards.hasOwnProperty(s)) {
                encounterPool.push(...cards[s]);
            }
            // add all tyrant encounter for this tyrant from this set to the pool
            let t = `${set}-${tyrant.ID}`;
            if (cards.hasOwnProperty(t)) {
                tyrantCardPool.push(...cards[t]);
            }
        }
        // add 3 random cards for the first days
        let first = [];
        for (let i = 0; i < amountDays; i++) {
            let pool = day13Pool[i];
            if (pool.length == 0)
                return new Setup(null, null, null, "Not enough day 1-3 encounters (needs at least 1 per day).");
            let card = takeRandomEl(pool);
            first.push(card);
        }

        // add all other encounters (days - 3)
        let amount = tyrant.Days - amountDays;
        let encounters = [];
        for (let i = 0; i < amount; i++) {
            if (encounterPool.length == 0) {
                return new Setup(null, null, null, `Not enough regular encounter (at least ${amount}).`);
            }
            let card = takeRandomEl(encounterPool);
            encounters.push(card);
        }
        // add all available tyrant encounters for this tyrant
        encounters.push(...tyrantCardPool);
        // shuffle the encounters
        shuffleArr(encounters);
        // add the cards for day 1-3 to the front
        encounters.unshift(...first);
        return new Setup(selectedGearlocs, tyrant, encounters);
    }
}