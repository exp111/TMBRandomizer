const names = {
    "base": "Base Set",
    "40d": "40 Days",
    "aot": "Age of Tyranny",
    "rot": "Rage of Tyranny",
    //TODO: more: AoS, UT, UB, 40w, 40c
}

const gameplayAddons = [
    "base", "40d", "aot", "rot"
];
const gearlocAddons = [
    "ghillie", "nugget", "tink"
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
    SetID = "";
    ID = "";
    Name = "";

    constructor(setID, name) {
        this.SetID = setID;
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
        this.ID = name.toLowerCase().replaceAll(" ", "-");
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
    new Gearloc("base", "Patches"),
    new Gearloc("base", "Picket"),
    new Gearloc("base", "Boomer"),
    new Gearloc("base", "Tantrum"),
    new Gearloc("ghillie", "Ghillie"),
    new Gearloc("nugget", "Nugget"),
    new Gearloc("tink", "Tink"),
];
const tyrants = [
    //TODO: aos
    new Tyrant("base", "Duster", 10, 13, 3),
    new Tyrant("base", "Mulmesh", 6, 9, 1),
    new Tyrant("base", "Marrow", 10, 12, 2),
    new Tyrant("base", "Nom", 6, 8, 1),
    new Tyrant("base", "The Goblin King", 8, 12, 2),
    new Tyrant("base", "Gendricks", 8, 10, 2),
    new Tyrant("base", "Drellen", 6, 10, 1),
];
const cards = {
    "base-d1": [new Encounter("base", "Special", "001")],
    "aot-d1": buildCards("aot", "Special", 7),
    "rot-d1": buildCards("rot", "Special", 4),
    "base-d2": [new Encounter("base", "Special", "002")],
    "aot-d2": buildCards("aot", "Special", 7, 8),
    "rot-d2": buildCards("rot", "Special", 4, 9),
    "base-d3": [new Encounter("base", "Special", "003")],
    "aot-d3": buildCards("aot", "Special", 7, 15),
    "rot-d3": buildCards("rot", "Special", 4, 17),
    "base": buildCards("base", "General", 30),
    "base-solo": buildCards("base", "Solo", 12),
    "40d": buildCards("40d", "General", 24),
    "40d-solo": buildCards("40d", "Solo", 12),
    "40d-nom": [new Encounter("40d", "Nom", "1/1")],
    "40d-mulmesh": [new Encounter("40d", "Mulmesh", "1/1")],
    "40d-drellen": [new Encounter("40d", "Drellen", "1/1")],
};

function getAvailableGearlocs(owned) {
    return gearlocs.filter(g => owned[g.SetID]);
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
        // build pool of cards
        let tyrantCardPool = [...tyrant.Cards];
        let day13Pool = [];
        let encounterPool = [];
        let suffix = solo ? "-solo" : "";
        for (let set of Object.keys(owned)) {
            if (!owned[set])
                continue;
            // add all day 1-3 cards from this set into the pool
            for (let i = 0; i < 3; i++) {
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
        for (let i = 0; i < 3; i++) {
            let pool = day13Pool[i];
            if (pool.length == 0)
                return new Setup(null, null, null, "Not enough day 1-3 encounters (needs at least 1 per day).");
            let card = takeRandomEl(pool);
            first.push(card);
        }

        // add all other encounters (days - 3)
        let amount = tyrant.Days - 3;
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