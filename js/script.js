$(function () {
    $(".navbar-toggle").blur(function (event) {
        let screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#onCollaps").collapse('hide');
        }     
    });
    $(".navbar-toggle").click(function (event) {
        $(event.target).focus();
    });
});

(function (global) {
    let main = {};

    let homeHtml = "http://localhost:8080/home-fragment.html";

    let insertHtml = function (selector, html) {
        let target = document.querySelector(selector);
        target.innerHTML = html;
    }

    let showLoading = function (selector) {
        let html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    }

    document.addEventListener("DOMContentLoaded", function () {
        showLoading("#main-content");
        $ajax.sendGetRequest(
            homeHtml, 
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            }, 
            false);
    });

    global.$main = main;
})(window);