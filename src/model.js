import * as $ from "jquery";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseconfig";

const auth = getAuth(app);
var cart = [];

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("signed in");
    } else {
        console.log("signed out");
    }
})

export function signUserUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password).then(() => {
        alert("User Created");
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
        alert("User signed in")
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
        }).then(() => { initListeners(pageName) });
    } else {
        $.get("pages/home.html", (data) =>{
            $("#app").html(data);
            let pageTitle = "Keurig - Home";
            $("title").html(pageTitle);
        }).fail((error) => {
            console.log("error " + error.message);
            alert("error " + error.message);
        }).then(() => { initListeners(pageName) });
    }
}

function initListeners(pageName) {
    $(document).on("input", "#countrySelect", function() {
        var newVal = $("#countrySelect").val();
        $("#flag").attr("src", `./public/${newVal}.webp`);
    })

    if (pageName == "" || pageName == "home") {
        for (let i = 0; i < 14; i++) {
            if (i == 7) {
                console.log("skip 8");
            } else {
                var elementName = "#buyNow" + String(i+1);
                //console.log(elementName)
                $(document).on("click", elementName, function() {addToCart(i+1)});
            }
        }
    } else if (pageName == "cart") {
        updateCart();

        for (let k = 0; k < cart.length; k++) {
            const element = cart[k];
            $(document).on("click", `#delete${k}`, function() {
                cart.splice(k, 1);
                initListeners("cart");
            })
            $(document).on("input", `#count${k}`, function() {
                element.count = $(`#count${k}`).val();
                initListeners("cart")
            })
        }
    } else if (pageName == "account") {
        const signInBtn = $("signInBtn");
        const signUpBtn = $("signUpBtn");
        const signOutBtn = $("signOutBtn");
        $(document).on("click", signInBtn, function() {
            var email = $("#emailSignInInput").val();
            var password = $("#passSignInInput").val();
            signUserIn(email, password);
        });
        $(document).on("click", signUpBtn, function() {
            var email = $("#emailSignUpInput").val();
            var password = $("#passSignUpInput").val();
            signUserUp(email, password);
        });
        $(document).on("click", signOutBtn, signUserOut());
    }
}

async function updateCart() {
    var subtotal = 0.00;
    var itemCount = 0;
    var htmlItems = '<div class="header"> <h3>Regular Purchases</h3> <em>These items will be processed today and ship right away.</em> </div>'
    for (let j = 0; j < cart.length; j++) {
        const element = cart[j];
        const elementSubtotal = (element.price * element.count)
        subtotal += elementSubtotal;
        itemCount += element.count
            
        //Adds element to list for display
        htmlItems += `<div class="item">
            <img id="itemImg${j}" src="./public/${element.image}" alt="Item Image" />
            <div class="itemInfo">
                <p>Keurig®</p>
                <p>${element.name}</p>
            </div>
            <div class="rightBar">
                <div class="delBtn" id="delete${j}"></div>
                <p class="points">Estimated Points: <b id="points1">${Math.round(elementSubtotal * 1000 /100)-1}</b></p>
                <div class="priceCount">
                    <p id="price${j}" class="price">$${element.price} Each</p>
                    <input type="number" name="count${j}" id="count${j}" placeholder="#" value=${element.count} />
                    <p id="calcPrice${j}" class="calcPrice">$${Math.round(element.price * element.count * 100) / 100}</p>
                    </div>
                </div>
            </div>`;

            if (itemCount == 1) {
                $("#itemCount").html("You have 1 item in your cart.");
                $("#subtotalCount").html("Subtotal (1 Item)");
            } else {
                $("#itemCount").html(`You have ${itemCount} items in your cart.`);
                $("#subtotalCount").html(`Subtotal (${itemCount} Items)`);
            }
    }
    //adds full list to display
    $("#itemSec").html(htmlItems);
    $("#subtotalText").html(`$${subtotal}`);
    $("#total").html(`$${Math.round(subtotal * 107)/100}`);

    $(document).on("click", "#checkoutBtn", checkout);
}

async function addToCart(itemNum) {
    console.log("clicked")
    try {
        const rawData = await fetch(`./items/item${itemNum}.json`);
        const itemDataFormatted = await rawData.json();

        for (let i = 0; i < cart.length; i++) {
            const element = cart[i];
            if (itemDataFormatted.image == element.image) {
                element.count += 1;
                return;
            }
        }

        cart.push(itemDataFormatted);
        console.log(cart);
      } catch (error) {
        console.log(error);
    }
}

async function checkout() {
    if (cart.length == 0) {
        alert("You can't check out with nothing in your cart!")
    } else {
        cart = []
        alert("You have successfully checked out!");

    }
}