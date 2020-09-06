const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// TODO: if firebase is used, setup the necessary credentials as environment (config vars) on hosting platform of choice
//  heroku works well, with a verified account (still free but requires credit card added to account) there are enough
//  service worker hours to run a discord bot 24/7; a standard free account will shut down around the 20~ish of each month.

// TODO: if no other services are added, consider just naming this firebase-config rather than generic config
// might make sense to move github config here

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

let db = firebase.firestore();
module.exports = db;