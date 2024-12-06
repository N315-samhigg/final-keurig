import * as $ from "jquery";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseconfig";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("signed in");
    } else {
        console.log("signed out")
    }
})

export function signUserUp(fName, lName, email, password) {
    createUserWithEmailAndPassword(auth, email, password).then(() => {
        console.log("User Created");
    }).catch((error) => {
        console.log(error);
    });
}

export function signUserOut() {
    signOut(auth).then(() => 
        console.log("signed out")
    ).catch((error) => {
        console.log(error)
    });
}

export function signUserIn(email, password) {
    signInWithEmailAndPassword(auth, email, password).then(() => {
        console.log("User signed in")
    }).catch((error) => {
        console.log(error);
    })
}

export function changePage(pageName) {
    console.log(pageName);
    if (pageName) {
        $.get("pages/" + pageName + ".html", (data) =>{
            $("#app").html(data);
            let pageTitle = "Keurig - " + String(pageName).charAt(0).toUpperCase() + String(pageName).slice(1);
            $("title").html(pageTitle);
        }).fail((error) => {
            console.log("error " + error.message);
            alert("error " + error.message);
        }).then(console.log("done load"));
    } else {
        $.get("pages/home.html", (data) =>{
            $("#app").html(data);
            let pageTitle = "Keurig - Home";
            $("title").html(pageTitle);
        }).fail((error) => {
            console.log("error " + error);
            alert("error " + error);
        }).then(console.log("done load"));
    }

    if (pageName == "" || pageName == "home") {
        loadHomeListeners();
    }
}

function loadHomeListeners() {
    for (let i = 0; i < 14; i++) {
        if (i == 8) {
            console.log("skip 8");
        } else {
            var elementName = "buyNow" + String(i+1);
            var element = document.getElementById(elementName);
            element.addEventListener("click", function() {addToCart(i)});
            //$(elementName).on("click", addToCart(i));
        }
    }
}

async function addToCart(itemNum) {
    try {
        //const rawData = await fetch("./items.json");
        //const itemDataFormatted = await rawData.json();
        console.log(itemNum)
      } catch (error) {
        console.log(error);
    }
}