const names = {
    "base": "Base Set",
    "40d": "40 Days",
    "aot": "Age of Tyranny",
    //TODO: more: RoT, AoS, UT, UB, 40w, 40c
}

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
    "base-d2": [new Encounter("base", "Special", "002")],
    "aot-d2": buildCards("aot", "Special", 7, 8),
    "base-d3": [new Encounter("base", "Special", "003")],
    "aot-d3": buildCards("aot", "Special", 7, 15),
    "base": buildCards("base", "General", 30),
    "base-solo": buildCards("base", "Solo", 12),
    "40d": buildCards("40d", "General", 24),
    "40d-solo": buildCards("40d", "Solo", 12),
    "40d-nom": [new Encounter("40d", "Nom", "1/1")],
    "40d-mulmesh": [new Encounter("40d", "Mulmesh", "1/1")],
    "40d-drellen": [new Encounter("40d", "Drellen", "1/1")],
};

class Setup {
    Tyrant = null;
    Encounters = null;
    Error = null;

    constructor(tyrant, encounters, error) {
        this.Tyrant = tyrant;
        this.Encounters = encounters;
        this.Error = error;
    }

    static Randomize(owned, solo, tyrantID = null) {
        function randomEl(arr) {
            //TODO: remove
            return arr[Math.floor(Math.random() * arr.length)];
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

        // get the tyrant
        let tyrant = null;
        if (tyrantID == null) // fetch a random tyrant
            tyrant = randomEl(tyrants);
        else
            tyrant = tyrants.find(t => t.ID == tyrantID);
        // build pool of cards
        let tyrantPool = tyrant.Cards;
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
                tyrantPool.push(...cards[t]);
            }
        }
        // add 3 random cards for the first days
        let first = [];
        for (let i = 0; i < 3; i++) {
            let pool = day13Pool[i];
            if (pool.length == 0)
                return new Setup(null, null, "Not enough day 1-3 encounters (needs at least 1 per day).");
            let card = randomEl(pool);
            first.push(card);
        }

        // add all other encounters (days - 3)
        let amount = tyrant.Days - 3;
        let encounters = [];
        for (let i = 0; i < amount; i++) {
            let card = randomEl(encounterPool);
            encounters.push(card);
        }
        // add all available tyrant encounters for this tyrant
        encounters.push(...tyrantPool);
        // shuffle the encounters
        shuffleArr(encounters);
        // add the cards for day 1-3 to the front
        encounters.unshift(...first);
        return new Setup(tyrant, encounters);
    }
}