import * as $ from "jquery";
import { signUserIn, signUserOut, signUserUp, changePage } from "./model";

const hamburgerMenu = document.querySelector(".hamburger-menu");
const nav = document.querySelector("nav");
const loginBtn = document.querySelector("#loginBtn");
const signUpBtn = document.querySelector("#signUpBtn");

function initListeners() {
  hamburgerMenu.addEventListener("click", () => {nav.classList.toggle("active");});
    $(signUpBtn).on("click", () => {
        const firstName = $("#fName").val();
        const lastName = $("#lName").val();
        const email = $("#email").val();
        const password = $("#password").val();

        signUserUp(firstName, lastName, email, password)
    });

    $("#signOutBtn").on("click", () => {
        signUserOut();
    });

    $(loginBtn).on("click", () => {
        const siUser = $("signUser").val();
        const siPass = $("signPass").val();
        signUserIn(siUser, siPass);
    });
}

function route() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");

    changePage(pageID);
    initListeners();
    //console.log("route " + pageID);

    if (pageID == "create") {
        form();
    }
}

function form() {
    console.log("adding listeners");
    var instCount = 3;
    var ingredCount = 3;
    var userRecipes = [];
    
    $("#ingredBtn").on("click", function () {
        ingredCount++;
        $(".ingredients").append(`<input type='text' name='ingred${ingredCount}' id='ingred${ingredCount}' placeholder='Ingredient ${ingredCount}...' />`)
    });
    
    $("#instructBtn").on("click", function () {
        instCount++;
        $(".instructions").append(`<input type='text' name='instruct${instCount}' id='instruct${instCount}' placeholder='Instruction ${instCount}...' />`)
    });
    
    $("#submitBtn").on("click", function() {
        let recipe = {
            recipeName: $("#recipeName").val(),
            recipeImageURL: $("#imageURL").val(),
            ingredients: [],
            instructions: [],
        };
    
        $(".ingredients input").each(function () {
            recipe.ingredients.push($(this).val());
        });
    
        $(".instructions input").each(function () {
            recipe.instructions.push($(this).val());
        });
    
        userRecipes.push(recipe);
        console.log(recipe);
    });
}
 
$(document).ready(function () {
    $(window).on("hashchange", route);
    route();
    initListeners();
});