import * as $ from "jquery";
import { signUserIn, signUserOut, signUserUp, changePage } from "./model";

function route() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");

    changePage(pageID);
    //console.log("route " + pageID);
}
 
$(document).ready(function () {
    $(window).on("hashchange", route);
    route();
});