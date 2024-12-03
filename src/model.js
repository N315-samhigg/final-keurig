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
            let pageTitle = "Jungle Cook - " + String(pageName).charAt(0).toUpperCase() + String(pageName).slice(1);
            $("title").html(pageTitle);
        }).fail((error) => {
            console.log("error " + error.message);
            alert("error " + error.message);
        });
    } else {
        $.get("pages/home.html", (data) =>{
            $("#app").html(data);
            let pageTitle = "Jungle Cook - Home";
            $("title").html(pageTitle);
        }).fail((error) => {
            console.log("error " + error);
            alert("error " + error);
        });
    }
}