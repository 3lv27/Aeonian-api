const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sports-game', {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});
const Challenge = require('../models/challenge');



//fakes productssss

const fakeOne = {
    nameSport: 'BMX',
    challengerName: 'BMX',
    owner: null,
    location: null,
    sports: null,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
}

const fakeTwo = {
    nameSport: 'Skateboarding',
    challengerName: 'Skateboarding',
    owner: null,
    location: null,
    sports: null,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
}

const fakeTree = {
    nameSport: 'Fitness',
    challengerName: 'Fitness',
    owner: null,
    location: null,
    sports: null,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
}

const fakeFour = {
    nameSport: 'Rollingskating',
    challengerName: 'Rollingskating',
    owner: null,
    location: null,
    sports: null,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
}

const sports = [fakeOne, fakeTwo, fakeTree, fakeFour];

Challenge.create(sports, (err, docs) => {
    if (err) {
        throw err;
    }

    docs.forEach((sports) => {
        console.log(sports.nameSport);
    });
    mongoose.connection.close();
});