const names = {
    "base": "Base Game",
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

function buildGeneralCards(setID, num, solo = false) {
    let res = [];
    let type = solo ? "Solo" : "General";
    for (let i = 0; i < num; i++) {
        let num = (i + 1).toString().padStart(3, "0");
        res.push(new Encounter(setID, type, num));
    }
    return res;
}

const tyrants = [
    //TODO: 40 days?
    new Tyrant("base", "Duster", 10, 13, 3),
    new Tyrant("base", "Mulmesh", 6, 9, 1),
    new Tyrant("base", "Marrow", 10, 12, 2),
    new Tyrant("base", "Nom", 6, 8, 1),
    new Tyrant("base", "The Goblin King", 8, 12, 2),
    new Tyrant("base", "Gendricks", 8, 10, 2),
    new Tyrant("base", "Drellen", 6, 10, 1),
];
const cards = {
    "d1": [
        new Encounter("base", "Special", "001"),
    ],
    "d2": [
        new Encounter("base", "Special", "002"),
    ],
    "d3": [
        new Encounter("base", "Special", "003"),
    ],
    "general": [
        ...buildGeneralCards("base", 30)
    ],
    "generalSolo": [
        ...buildGeneralCards("base", 12, true)
    ]
};

class Setup {
    Tyrant = null;
    Encounters = null;

    constructor(tyrant, encounters) {
        this.Tyrant = tyrant;
        this.Encounters = encounters;
    }

    static Randomize(solo) {
        function randomEl(arr) {
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

        let tyrant = randomEl(tyrants);
        let first = [];
        for (let i = 0; i < 3; i++) {
            let c = cards[`d${i + 1}`];
            let card = randomEl(c);
            first.push(card);
        }

        let amount = tyrant.Days - 3;
        let arr = solo ? cards["generalSolo"] : cards["general"];
        let encounters = [];
        for (let i = 0; i < amount; i++) {
            let card = randomEl(arr);
            encounters.push(card);
        }
        for (let card of tyrant.Cards) {
            encounters.push(card);
        }
        shuffleArr(encounters);
        encounters.unshift(...first);
        return new Setup(tyrant, encounters);
    }
}