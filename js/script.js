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

    let allCategoriesUrl = "http://localhost:8080/categories.json"; //JSON of positions in menu
    let menuHtml = "http://localhost:8080/menu-fragment.html";
    let categoryHtml = "http://localhost:8080/category-fragment.html";

    let menuItemsUrl = "http://localhost:8080/menu-items-{{short_name}}.json"; //JSON of positions in category
    let itemHtml = "http://localhost:8080/menu-item-fragment.html";
    let itemTitleHtml = "http://localhost:8080/menu-item-title-fragment.html";

    let insertHtml = function (selector, html) {
        let target = document.querySelector(selector);

        target.innerHTML = html;
    };

    let showLoading = function (selector) {
        let html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";

        insertHtml(selector, html);
    };

    let insertProperty = function (propValue, propName, string) {
        let property = "{{" + propName + "}}";
        
        string = string.replace(new RegExp(property, "g"), propValue);
        return (string);
    };

    let switchMenuToActive = function () {
        let classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;
    
        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") == -1) {
          classes += " active";
          document.querySelector("#navMenuButton").className = classes;
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        showLoading("#main-content");
        $ajax.sendGetRequest(
            homeHtml, 
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            }, 
            false);
    });

    main.loadMenuCategories = function() {
        showLoading("#main-content");
        $ajax.sendGetRequest (
            allCategoriesUrl,
            buildAndShowCategoriesHtml,
            true
        );
    }

    function buildAndShowCategoriesHtml (categories) {
        $ajax.sendGetRequest (
            menuHtml,
            function (menuHtml) {
                $ajax.sendGetRequest (
                    categoryHtml,
                    function (categoryHtml) {
                        switchMenuToActive();

                        let categoriesHtml = buildCategoriesHtml (categories, menuHtml, categoryHtml);
                        insertHtml("#main-content", categoriesHtml);
                    },
                    false
                );
            },
            false
        );
    }

    function buildCategoriesHtml (categories, menuHtml, categoryHtml) {
        let finalHtml = menuHtml;

        finalHtml += "<section class='row'>";
        for (let i = 0; i < categories.length; i++) {
            let name = categories[i].name;
            let short_name = categories[i].short_name;
            let html = categoryHtml;

            html = insertProperty(name, "name", html);
            html = insertProperty(short_name, "short_name", html);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return (finalHtml);
    }

    main.loadMenuItem = function(subCat) {
        showLoading("#main-content");
        menuItemsUrl = insertProperty(subCat, "short_name", menuItemsUrl);
        $ajax.sendGetRequest(
            menuItemsUrl,
            buildAndShowItemHtml
        );
    }

    function buildAndShowItemHtml (items) {
        $ajax.sendGetRequest(
            itemTitleHtml,
            function (itemTitleHtml) {
                $ajax.sendGetRequest (
                    itemHtml,
                    function (itemHtml) {
                        switchMenuToActive();

                        let finalItemHtml = buildItemHtml(items, itemTitleHtml, itemHtml);
                        insertHtml("#main-content", finalItemHtml);
                    },
                    false
                );
            },
            false
        );
    }

    function buildItemHtml(items, itemTitleHtml, itemHtml) {
        let titleHtml = insertProperty(items.category.name, "name", itemTitleHtml);
        let catShortName = items.category.short_name;

        titleHtml = insertProperty(items.category.special_instructions, "special_instructions", titleHtml);
        titleHtml += "<section class='row'>";
        for (let i = 0; i < items.menu_items.length; i++) {
            let name = items.menu_items[i].name;
            let short_name = items.menu_items[i].short_name;
            let description = items.menu_items[i].description;
            let stepHtml = insertProperty(name, "name", itemHtml);
            let lowPrice = (items.menu_items[i].price_small || "");
            let hightPrice = (items.menu_items[i].price_large || "");
            let lowPortion = (items.menu_items[i].small_portion_name || "");
            let hightPortion = (items.menu_items[i].large_portion_name || "");

            if (lowPrice != "")
                lowPrice = "$" + lowPrice;
            if (hightPrice != "")
            hightPrice = "$" + hightPrice; 
            if (lowPortion != "")
                lowPortion = "(" + lowPortion + ")";
            if (hightPortion != "")
                hightPortion = "(" + hightPortion + ")"; 
            stepHtml = insertProperty(short_name, "short_name", stepHtml);
            stepHtml = insertProperty(description, "description", stepHtml);
            stepHtml = insertProperty(catShortName, "catShortName", stepHtml);
            stepHtml = insertProperty(lowPrice, "price_small", stepHtml);
            stepHtml = insertProperty(hightPrice, "price_large", stepHtml);
            stepHtml = insertProperty(lowPortion, "small_portion_name", stepHtml);
            stepHtml = insertProperty(hightPortion, "large_portion_name", stepHtml);
            titleHtml += stepHtml;
            if (i % 2 != 0)
                titleHtml += "<div class='clearfix visible-md-block visible-lg-block'></div>";
        }
        titleHtml += "</section>";
        return (titleHtml);
    }

    global.$main = main;
})(window);