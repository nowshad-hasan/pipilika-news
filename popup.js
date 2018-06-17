window.onload = function (ev) {
    // alert("Hello! I'm trying to fix it");

    /*

    Some Issues:
    There are 8 cases for internet connection. I'll explain it later.

    1. icon for menu tab

     */

    // For the first time internetConnection and firstTimeLaunch both are set to true.
    var connectionAvailable;
    var firstTimeAppCheck;
    var triggerOnce = true;
    var previousConnection = true;       // This variable is to check if Internet is
    // connected before we click popup.html that means run the extension.


    var bottomFlag = false;

    var recentNewsCounter = 1, mostReadNewsCounter = 1, discussedNewsCounter = 1;
    var recentNewsScrollHeight, mostReadNewsScrollHeight, discussedNewsScrollHeight;

    var recentNewsNewID = 0, mostReadNewsNewID = 0, discussedNewsNewID = 0;

    var newDataAvailable = false;

    var newDataChecking = false;  //This variable is to check if our code can check for 'new data'. When net is not connected
    // before (so, its can't get id with AJAX request after clicking popup.html) and when connection
    // available it should check for 'new data' available. So, it checks on 'confirmed-up' function
    // on the third condition.


    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var currentSecond = currentDate.getSeconds();

    var finalEnlishToBanglaNumber = {
        '0': '০',
        '1': '১',
        '2': '২',
        '3': '৩',
        '4': '৪',
        '5': '৫',
        '6': '৬',
        '7': '৭',
        '8': '৮',
        '9': '৯'
    };

    // This function is to convert English number to Bengali. If it is called from above, there will be an error.
    // So, this function is put here at top, so that any place below it, can call easily.

    String.prototype.getDigitBanglaFromEnglish = function () {
        var retStr = this;
        for (var x in finalEnlishToBanglaNumber) {
            retStr = retStr.replace(new RegExp(x, 'g'), finalEnlishToBanglaNumber[x]);
        }
        return retStr;
    };


    firstTimeAppCheck = checkForFistTimeInstallation();

    console.log("First Time App Checking " + firstTimeAppCheck);


    // bottomNotification("DataAlreadyLoaded");
    // console.log(getTimeDifference("2018-04-17 19:10:31"));
    // setTimeout(hideBottomNotification,3000);

    //console.log("Recent News New ID " + getNewID("RecentNews"));


    if (firstTimeAppCheck == false) {

        getNewID();


        if (localStorage.getItem("RecentNewsCacheData") != null) {
            hideMenuData("menu1");
            var recentNewsCache = JSON.parse(localStorage.getItem("RecentNewsCacheData"));
            loadMenuData(recentNewsCache, "menu1");
        }
        else if (localStorage.getItem("RecentNewsCacheData") == null) {
            noCacheDataAtCenter("menu1");
        }


        if (localStorage.getItem("MostReadNewsCacheData") != null) {
            hideMenuData("menu2");
            var mosReadNewsCache = JSON.parse(localStorage.getItem("MostReadNewsCacheData"));
            loadMenuData(mosReadNewsCache, "menu2");
        }

        else if (localStorage.getItem("MostReadNewsCacheData") == null) {
            noCacheDataAtCenter("menu2");
        }


        if (localStorage.getItem("DiscussedNewsCacheData") != null) {
            hideMenuData("menu3");
            var discussedNewsCache = JSON.parse(localStorage.getItem("DiscussedNewsCacheData"));
            loadMenuData(discussedNewsCache, "menu3");
        }

        else if (localStorage.getItem("DiscussedNewsCacheData") == null) {

            noCacheDataAtCenter("menu3");
        }


        setTimeout(checkForNewData, 2000);  // We wait here for 2 second so that getNewID() is fired
                                            // to load data in recentNewsNewID, mostReadNewsNewID and discussedNewsNewID.
                                            //  In that meantime, cache data will be loaded and user will see those.

        setTimeout(function () {
            console.log("Check For New Data " + recentNewsNewID + " " + mostReadNewsNewID + " " + discussedNewsNewID + " " + newDataAvailable);
        }, 2100);
    }


    // setTimeout(function () {
    //     console.log("Recent News New ID " + recentNewsNewID)
    // }, 2000);

    $("#menu1").scroll(function () {

        // For every menu tab, height is 475 and scrollTop (pixel) is changing.
        // If scrollTop is 875, that means scroll reaches to 15th element. On the other hand, 15*90=scrollTop+menuHeight(1350).

        recentNewsScrollHeight = $("#menu1").scrollTop() + $("#menu1").height();


        // console.log($("#menu1").scrollTop());
        // console.log("Height " + $("#menu1").height());

        if (connectionAvailable == true && newDataAvailable == true && (recentNewsScrollHeight == (recentNewsCounter * 15 * 90))) {

            alert("সার্ভারে নতুন খবর এসেছে");
            hideCenterData();
            loadingImageAtCenter("menu1");
            loadingImageAtCenter("menu2");
            loadingImageAtCenter("menu3");
            recentNewsData(0);
            mostReadNewsData(0);
            discussedNewsData(0);
        }

        else if ((recentNewsScrollHeight == (recentNewsCounter * 15 * 90)) && connectionAvailable == true && newDataAvailable == false) {
            var offset = recentNewsCounter * 15;
            emptyBottomNotification();
            bottomNotification("MoreDataLoading");
            recentNewsData(offset);


        }


        if (recentNewsScrollHeight > ((recentNewsCounter - 1) * 15 * 90) && bottomFlag == true) {
            emptyBottomNotification();
            bottomFlag = false; //This variable is necessary because otherwise this block of code is hit again and again scrolling down
            // And so I can't show any notification like "bottomNotification("MoreDataLoading")". So, I have to ensure
            // this block is run once, when bottomNotification("DataAlreadyLoaded") is called.
        }
    });


    $("#menu2").scroll(function () {

        // For every menu tab, height is 475 and scrollTop (pixel) is changing.
        // If scrollTop is 875, that means scroll reaches to 15th element. On the other hand, 15*90=scrollTop+menuHeight(1350).

        mostReadNewsScrollHeight = $("#menu2").scrollTop() + $("#menu2").height();


        // console.log($("#menu1").scrollTop());
        // console.log("Height " + $("#menu1").height());

        if (connectionAvailable == true && newDataAvailable == true && (mostReadNewsScrollHeight == (mostReadNewsCounter * 15 * 90))) {

            alert("সার্ভারে নতুন খবর এসেছে");
            hideCenterData();
            loadingImageAtCenter("menu1");
            loadingImageAtCenter("menu2");
            loadingImageAtCenter("menu3");
            recentNewsData(0);
            mostReadNewsData(0);
            discussedNewsData(0);

        }

        else if ((mostReadNewsScrollHeight == (mostReadNewsCounter * 15 * 90)) && connectionAvailable == true && newDataAvailable == false) {
            var offset = mostReadNewsCounter * 15;
            emptyBottomNotification();
            bottomNotification("MoreDataLoading");
            mostReadNewsData(offset);


        }


        if (mostReadNewsScrollHeight > ((mostReadNewsCounter - 1) * 15 * 90) && bottomFlag == true) {
            emptyBottomNotification();
            bottomFlag = false; //This variable is necessary because otherwise this block of code is hit again and again scrolling down
            // And so I can't show any notification like "bottomNotification("MoreDataLoading")". So, I have to ensure
            // this block is run once, when bottomNotification("DataAlreadyLoaded") is called.
        }
    });


    $("#menu3").scroll(function () {

        // For every menu tab, height is 475 and scrollTop (pixel) is changing.
        // If scrollTop is 875, that means scroll reaches to 15th element. On the other hand, 15*90=scrollTop+menuHeight(1350).

        discussedNewsScrollHeight = $("#menu3").scrollTop() + $("#menu3").height();


        // console.log($("#menu1").scrollTop());
        // console.log("Height " + $("#menu1").height());

        if (connectionAvailable == true && newDataAvailable == true && (discussedNewsScrollHeight == (discussedNewsCounter * 15 * 90))) {

            alert("সার্ভারে নতুন খবর এসেছে");
            hideCenterData();
            loadingImageAtCenter("menu1");
            loadingImageAtCenter("menu2");
            loadingImageAtCenter("menu3");
            recentNewsData(0);
            mostReadNewsData(0);
            discussedNewsData(0);
        }

        else if ((discussedNewsScrollHeight == (discussedNewsCounter * 15 * 90)) && connectionAvailable == true && newDataAvailable == false) {
            var offset = discussedNewsCounter * 15;
            emptyBottomNotification();
            bottomNotification("MoreDataLoading");
            discussedNewsData(offset);


        }


        if (discussedNewsScrollHeight > ((discussedNewsCounter - 1) * 15 * 90) && bottomFlag == true) {
            emptyBottomNotification();
            bottomFlag = false; //This variable is necessary because otherwise this block of code is hit again and again scrolling down
            // And so I can't show any notification like "bottomNotification("MoreDataLoading")". So, I have to ensure
            // this block is run once, when bottomNotification("DataAlreadyLoaded") is called.
        }
    });


    Offline.options = {


        reconnect: {
            // How many seconds should we wait before rechecking.
            initialDelay: 1,

            // How long should we wait between retries.

        },
        checks: {
            image:
                {
                    url: function () {
                        return 'http://esri.github.io/offline-editor-js/tiny-image.png?_=' + (Math.floor(Math.random() * 1000000000));
                    }
                },
            active: 'image'
        }
    };


    // This check for first time checking when we click the popup.html page
    // confirmed-down is triggered if still it has connection (up) or no connection (down)
    // If we remove Offline.check(), it will work but it can't handle first time checking
    // Of course we've to put it (Offline.check()) below Offline.options otherwise it will give wrong result.

    Offline.check();


    Offline.on('confirmed-up', function () {
        connectionAvailable = true;
        triggerOnce = true;
        console.log('up');

        if (firstTimeAppCheck == true && previousConnection == false) {


            bottomNotification("ConnectionAvailable");

            setTimeout(hideBottomNotification, 2000);

            console.log("Data is loading now!");


            hideMenuData("menu1");
            loadingImageAtCenter("menu1");
            recentNewsData(0);

            hideMenuData("menu2");
            loadingImageAtCenter("menu2");
            mostReadNewsData(0);

            hideMenuData("menu3");
            loadingImageAtCenter("menu3");
            discussedNewsData(0);


        }

        else if (firstTimeAppCheck == true && previousConnection == true) {

            emptyBottomNotification();
            bottomNotification("NewDataLoading");
            setTimeout(hideBottomNotification, 2000);

            console.log("Data is loading!");

            recentNewsData(0);
            mostReadNewsData(0);
            discussedNewsData(0);

            //  hideCenterData();
            // firstTimeAppCheck = false;
        }
        else if (firstTimeAppCheck == false && previousConnection == false) {



            previousConnection = true; // If I don't 'true' this variable it hit again and again after from 'down' to 'up' after firstTimeAppCheck
            bottomNotification("ConnectionAvailable");
            setTimeout(hideBottomNotification, 3000);

            // Code block given below to check for new data when data connection available if it didn't check yet.

            if (newDataChecking == false) {
                getNewID();
                setTimeout(checkForNewData, 2000);

                setTimeout(function () {
                    console.log("Check For New Data " + recentNewsNewID + " " + mostReadNewsNewID + " " + discussedNewsNewID + " " + newDataAvailable);
                }, 2100);
            }

        }

        // Here is the fourth condition which is not written- if firstTime is false
        // (not the first time) and previous connection is true (it is connected before we click/launch the app), it
        // will not show anything. And it is the most normal situation I think.


    });


    Offline.on('confirmed-down', function () {


        connectionAvailable = false;
        console.log('down');


        // triggerOnce is 'true' by default and it will again true if internet is connected again.
        // Here triggerOnce is set to 'false' because 'confirmed-down' is called again and again until connection is up
        // So noConnectionAtCenter is drawn continuously. To stop it, we ensure another variable here to trigger once and not again.

        if (firstTimeAppCheck == true && triggerOnce == true) {

            noConnectionAtCenter();

            triggerOnce = false;
            previousConnection = false;  // This variable is useful when Internet is connected and hit into 'up' function.
        }
        else if (firstTimeAppCheck == false) {
            bottomNotification("NoConnectionAvailable");
            previousConnection = false;
        }


    });


    // All the functions go here.


    function noConnectionAtCenter() {

        $('.loading').hide();


        $('#menu1').append('<img style="width: 230px;padding-top: 170px;padding-left: 170px;align:center;" src="Image/info.png" />');
        $("#menu1").append("<h3> No Internet Connection </h3>");

        $('#menu2').append('<img style="width: 230px;padding-top: 170px;padding-left: 170px;align:center;" src="Image/info.png" />');
        $("#menu2").append("<h3> No Internet Connection </h3>");

        $('#menu3').append('<img style="width: 230px;padding-top: 170px;padding-left: 170px;align:center;" src="Image/info.png" />');
        $("#menu3").append("<h3> No Internet Connection </h3>");

    }

    function noCacheDataAtCenter(menuType) {

        $("#" + menuType).empty();

        $('#' + menuType).append('<img style="width: 230px;padding-top: 170px;padding-left: 170px;align:center;" src="Image/info.png" />');
        $('#' + menuType).append("<h3> Cache Data Unavailable </h3>");
    }

    function loadingImageAtCenter(menuType) {

        var loadingMenu = document.getElementById(menuType);
        var divLoadingIcon1 = document.createElement("div");
        divLoadingIcon1.className = "loading";
        divLoadingIcon1.style = "margin-top: 180px;text-align: center;";
        var imgLoadingIcon1 = document.createElement("img");
        imgLoadingIcon1.style.height = "48px";
        imgLoadingIcon1.style.width = "48px";
        imgLoadingIcon1.src = "Image/logo.png";

        divLoadingIcon1.append(imgLoadingIcon1);
        loadingMenu.append(divLoadingIcon1);

        var divLoadingGif1 = document.createElement("div");
        divLoadingGif1.className = "loading";
        divLoadingGif1.style = "padding-left: 10px;text-align: center; display:block;";
        var imgLoadingGif1 = document.createElement("img");
        imgLoadingGif1.style.height = "70px";
        imgLoadingGif1.style.width = "70px";
        imgLoadingGif1.src = "Image/loading.gif";

        divLoadingGif1.append(imgLoadingGif1);
        loadingMenu.append(divLoadingGif1);

    }


    function checkForFistTimeInstallation() {
        var firstTime;

        if (localStorage.getItem("RecentNewsCacheData") == null && localStorage.getItem("MostReadNewsCacheData") == null
            && localStorage.getItem("DiscussedNewsCacheData") == null) {
            firstTime = true;
        }
        else {
            firstTime = false;
        }

        return firstTime;
    }

    function bottomNotification(NotificationType) {

        if (NotificationType == "ConnectionAvailable") {
            $(".loadingImage").html("Internet is Connected!");
            $(".loadingImage").css('visibility', 'visible');
        }
        else if (NotificationType == "NoConnectionAvailable") {
            $(".loadingImage").html("No Internet Connection");
            $(".loadingImage").css('visibility', 'visible');
        }


        else if (NotificationType == "NewDataLoading") {

            $(".loadingImage").html("নতুন খবর লোড হচ্ছে");
            $(".loadingImage").css('visibility', 'visible');

        }
        else if (NotificationType == "MoreDataLoading") {

            $(".loadingImage").html("আরও খবর লোড করা হচ্ছে");
            $('.loadingImage').append('<img style="padding-left:8px;" src="Image/ajax-loader.gif" />');
            $(".loadingImage").css('visibility', 'visible');


        }
        else if (NotificationType == "DataAlreadyLoaded") {
            bottomFlag = true;


            $(".loadingImage").append("নতুন <span class='label label-danger'>" + "15".getDigitBanglaFromEnglish() + '</span>' + " টি খবর লোড করা হয়েছে");
            $(".loadingImage").css('visibility', 'visible');

        }

        else if (NotificationType == "SomethingWrong") {

            $(".loadingImage").html("Something Goes Wrong!");
            $(".loadingImage").css('visibility', 'visible');

        }


    }

    function hideCenterData() {
        $("#menu1").empty();
        $("#menu2").empty();
        $("#menu3").empty();
    }

    function hideMenuData(menuType) {
        if (menuType == "menu1") {
            $("#menu1").empty();
        }
        else if (menuType == "menu2") {
            $("#menu2").empty();
        }
        else if (menuType == "menu3") {
            $("#menu3").empty();
        }
    }

    function hideBottomNotification() {
        $(".loadingImage").css("visibility", "hidden");
    }

    function emptyBottomNotification() {
        $(".loadingImage").empty();
    }

    function getTimeDifference(newsTime) {

        var newsYear, newsMonth, newsDay, newsHour, newsMinute, newsSecond;
        var yearDifference, monthDifference, dayDifference, hourDifference, minuteDifference, secondDifference;


        newsYear = parseInt(newsTime.substring(0, 4));


        newsMonth = parseInt(newsTime.substring(5, 7));

        newsDay = parseInt(newsTime.substring(8, 10));
        // console.log(newsDay);
        newsHour = parseInt(newsTime.substring(11, 13));
        // console.log(newsHour);
        newsMinute = parseInt(newsTime.substring(14, 16));
        // console.log(newsMinute);
        newsSecond = parseInt(newsTime.substring(17, 19));


        //  console.log(currentYear+" "+monthDifference+" "+dayDifference+" "+hourDifference+" "+minuteDifference+" "+secondDifference)
        if (currentSecond < newsSecond) {
            secondDifference = currentSecond + 60 - newsSecond;
            newsMinute++;
        } else {
            secondDifference = currentSecond - newsSecond;
        }

        if (currentMinute < newsMinute) {
            minuteDifference = currentMinute + 60 - newsMinute;
            newsHour++;
        } else {
            minuteDifference = currentMinute - newsMinute;
        }

        if (currentHour < newsHour) {
            hourDifference = currentHour + 24 - newsHour;
            newsDay++;
        } else {
            hourDifference = currentHour - newsHour;
        }

        if (currentDay < newsDay) {
            dayDifference = currentDay + 30 - newsDay;
            newsMonth++;
        } else {
            dayDifference = currentDay - newsDay;
        }

        if (currentMonth < newsMonth) {
            monthDifference = currentMonth + 12 - newsMonth;
            newsYear++;
        } else {
            monthDifference = currentMonth - newsMonth;
        }

        yearDifference = currentYear - newsYear;
        // english_number.getDigitBanglaFromEnglish()



        var timeBefore = "";

        if (yearDifference == -1) {
            timeBefore = "এইমাত্র";     // Sometimes I noticed there are '-1' year difference. Actually there is little
                                    // difference between two time stamps when to subtract.
                                    // So I set it there 'instant' for that case.
        } else if (yearDifference != 0) {
            timeBefore = timeBefore + yearDifference.toString().getDigitBanglaFromEnglish() + " বছর পূর্বে ";
        } else if (monthDifference != 0) {
            timeBefore = timeBefore + monthDifference.toString().getDigitBanglaFromEnglish() + " মাস পূর্বে ";
        } else if (dayDifference != 0) {
            timeBefore = timeBefore + dayDifference.toString().getDigitBanglaFromEnglish() + " দিন পূর্বে ";
        } else if (hourDifference != 0) {
            timeBefore = timeBefore + hourDifference.toString().getDigitBanglaFromEnglish() + " ঘণ্টা পূর্বে ";
        } else if (minuteDifference != 0) {
            timeBefore = timeBefore + minuteDifference.toString().getDigitBanglaFromEnglish() + " মিনিট পূর্বে ";
        } else {
            timeBefore = "এইমাত্র";
        }

        return timeBefore;


    }

    function recentNewsData(offset) {

        var recentNewsHttpRequest = new XMLHttpRequest();
        var jsonData;

        recentNewsHttpRequest.open("GET", "http://pipilika.com:70/recent_news/news/most/recent?total=15&&offset=" + offset, true);
        recentNewsHttpRequest.setRequestHeader("api_key", 123);
        recentNewsHttpRequest.send();


        recentNewsHttpRequest.onreadystatechange = function () {
            if (recentNewsHttpRequest.readyState == 4 && recentNewsHttpRequest.status == 200) {
//console.log("latest "+ JSON.parse(latestNewsCheckIdHttpRequest.responseText).data[0].id);
                //  console.log(recentNewsHttpRequest.responseText);
                jsonData = JSON.parse(recentNewsHttpRequest.responseText);
                if (offset == 0) {
                    hideMenuData("menu1");
                    loadMenuData(jsonData, "menu1");
                    saveCacheData(jsonData, "RecentNews");
                    recentNewsCounter = 1;
                    emptyBottomNotification();
                    // bottomNotification("DataAlreadyLoaded");
                    newDataAvailable = false;
                    firstTimeAppCheck = false;

                }
                else {
                    loadMenuData(jsonData, "menu1");
                    emptyBottomNotification();
                    bottomNotification("DataAlreadyLoaded");
                    ++recentNewsCounter;
                }


            }

            else if (recentNewsHttpRequest.readyState == 4 && recentNewsHttpRequest.status >= 400 && recentNewsHttpRequest.status < 600) {
                console.log("Something wrong!");
            }
        }


    }


    // New Code Added

    function mostReadNewsData(offset) {

        var mostReadNewsHttpRequest = new XMLHttpRequest();
        var jsonData;

        mostReadNewsHttpRequest.open("GET", "http://pipilika.com:70/recent_news/news/most/read?total=15&&offset=" + offset, true);
        mostReadNewsHttpRequest.setRequestHeader("api_key", 123);
        mostReadNewsHttpRequest.send();


        mostReadNewsHttpRequest.onreadystatechange = function () {
            if (mostReadNewsHttpRequest.readyState == 4 && mostReadNewsHttpRequest.status == 200) {
//console.log("latest "+ JSON.parse(latestNewsCheckIdHttpRequest.responseText).data[0].id);
                  console.log("Offset "+offset+" and data "+mostReadNewsHttpRequest.responseText);
                jsonData = JSON.parse(mostReadNewsHttpRequest.responseText);
                if (offset == 0) {
                    hideMenuData("menu2");
                    loadMenuData(jsonData, "menu2");
                    saveCacheData(jsonData, "MostReadNews");
                    mostReadNewsCounter = 1;
                    emptyBottomNotification();
                    // bottomNotification("DataAlreadyLoaded");
                    newDataAvailable = false;
                    firstTimeAppCheck = false;

                }
                else {
                    loadMenuData(jsonData, "menu2");
                    emptyBottomNotification();
                    bottomNotification("DataAlreadyLoaded");
                    ++mostReadNewsCounter;
                }


            }

            else if (mostReadNewsHttpRequest.readyState == 4 && mostReadNewsHttpRequest.status >= 400 && mostReadNewsHttpRequest.status < 600) {
                console.log("Something wrong!");
            }
        }


    }


    function discussedNewsData(offset) {

        var discussedNewsHttpRequest = new XMLHttpRequest();
        var jsonData;

        discussedNewsHttpRequest.open("GET", "http://pipilika.com:70/recent_news/news/most/discussed?total=15&&offset=" + offset, true);
        discussedNewsHttpRequest.setRequestHeader("api_key", 123);
        discussedNewsHttpRequest.send();


        discussedNewsHttpRequest.onreadystatechange = function () {
            if (discussedNewsHttpRequest.readyState == 4 && discussedNewsHttpRequest.status == 200) {
//console.log("latest "+ JSON.parse(latestNewsCheckIdHttpRequest.responseText).data[0].id);
                //  console.log(recentNewsHttpRequest.responseText);
                jsonData = JSON.parse(discussedNewsHttpRequest.responseText);
                if (offset == 0) {
                    hideMenuData("menu3");
                    loadMenuData(jsonData, "menu3");
                    saveCacheData(jsonData, "DiscussedNews");
                    discussedNewsCounter = 1;
                    emptyBottomNotification();
                    // bottomNotification("DataAlreadyLoaded");
                    newDataAvailable = false;
                    firstTimeAppCheck = false;

                }
                else {
                    loadMenuData(jsonData, "menu3");
                    emptyBottomNotification();
                    bottomNotification("DataAlreadyLoaded");
                    ++discussedNewsCounter;
                }


            }

            else if (discussedNewsHttpRequest.readyState == 4 && discussedNewsHttpRequest.status >= 400 && discussedNewsHttpRequest.status < 600) {
                console.log("Something wrong!");
            }
        }


    }

    // New Code ended


    function loadMenuData(jsonData, menuType) {
        var menu = document.getElementById(menuType);
        var image, link, description;
        for (var i = 0; i < 15; ++i) {


            image = "img" + (i + 1);
            link = "link" + (i + 1);
            description = "desc" + (i + 1);


            var newsTime = jsonData.data[i].date;
            // console.log(newsTime);

            var timeBefore = getTimeDifference(newsTime);


//      console.log(timeBefore);


            var url = jsonData.data[i].url;


            var menuDiv = document.createElement("div");

            menuDiv.className = "row bottom-border";

            var menuDivCol1 = document.createElement("div");
            menuDivCol1.className = "col-xs-3";
            menuDivCol1.style = "padding:0px;";
            var menuDivThumbnail1 = document.createElement("div");
            menuDivThumbnail1.className = "thumbnail";
            var menuThumbnail = document.createElement("img");
            menuThumbnail.className = "img-responsive";
            menuThumbnail.src = jsonData.data[i].image;
            menuDivThumbnail1.append(menuThumbnail);
            menuDivCol1.append(menuDivThumbnail1);


            menuDiv.append(menuDivCol1);

            var menuDivCol2 = document.createElement("div");
            menuDivCol2.className = "col-xs-9";
            var menu_a = document.createElement("a");
            menu_a.href = jsonData.data[i].url;
            menu_a.target = "_blank";
            var menu_p1 = document.createElement("p");
            menu_p1.className = "desc";
            var desc = document.createTextNode(jsonData.data[i].title);
            menu_p1.appendChild(desc);
            menu_a.append(menu_p1);
            menuDivCol2.append(menu_a);

            var menu_p2 = document.createElement("p");
            var menuSpan1 = document.createElement("span");
            menuSpan1.className = "img-source";
            var menuFavIcon = document.createElement("img");
            menuFavIcon.src = "https://www.google.com/s2/favicons?domain=" + url.substring(url.indexOf("www"), (url.indexOf("/", 10)));
            menuSpan1.append(menuFavIcon);
            menu_p2.append(menuSpan1);

            var menuSpan2 = document.createElement("span");
            menuSpan2.className = "source";
            var menuPaperName;
            if (jsonData.data[i].paper != undefined) {
                menuPaperName = document.createTextNode(jsonData.data[i].paper);
            }
            else if (jsonData.data[i].paper == undefined) {
                menuPaperName = document.createTextNode("পিপীলিকা ডেস্ক");
            }

            menuSpan2.appendChild(menuPaperName);
            menu_p2.append(menuSpan2);

            var menuSpan3 = document.createElement("span");
            var menuTimeBefore = document.createTextNode(timeBefore);
            menuSpan3.appendChild(menuTimeBefore);
            menu_p2.append(menuSpan3);
            menuDivCol2.append(menu_p2);

            menuDiv.append(menuDivCol2);


            menu.append(menuDiv);
        }

    }

    function checkForNewData() {


        var recentNewsCacheID, mostReadNewsCacheID, discussedNewsCacheID;

        recentNewsCacheID = getCacheID("RecentNews");
        mostReadNewsCacheID = getCacheID("MostReadNews");
        discussedNewsCacheID = getCacheID("DiscussedNews");

        if (recentNewsNewID != 0 || mostReadNewsNewID != 0 || discussedNewsCacheID != 0) {
            newDataChecking = true;   // That means it is checked once and I get relief that no data is available.

            if ((recentNewsNewID > recentNewsCacheID) || (mostReadNewsNewID > mostReadNewsCacheID) || (discussedNewsNewID > discussedNewsCacheID)) {
                newDataAvailable = true;
            }

        }


    }

    function getNewID() {


        var recentNewsHttpRequest = new XMLHttpRequest();
        var mostReadNewsHttpRequest = new XMLHttpRequest();
        var discussedNewsHttpRequest = new XMLHttpRequest();


        recentNewsHttpRequest.onreadystatechange = function () {
            if (recentNewsHttpRequest.readyState == 4 && recentNewsHttpRequest.status == 200) {
//console.log("latest "+ JSON.parse(latestNewsCheckIdHttpRequest.responseText).data[0].id);
                if (recentNewsHttpRequest.responseText.trim().length != 0) {


                    // The two condition bottom and up can be merged with && condition but then
                    // there will be the error when length will be 0 and check in the JSON parse for 'success' in the condition checking.
                    // That's why I ensure at first data length is not 0 and then I applied JSON.parse().

                    if (JSON.parse(recentNewsHttpRequest.responseText).success == true) {
                        console.log("From Recent News " + recentNewsHttpRequest.responseText);
                        recentNewsNewID = JSON.parse(recentNewsHttpRequest.responseText).data[0].id;
                    }
                    else if (JSON.parse(recentNewsHttpRequest.responseText).success == false) {
                        console.log("From Recent News- Not NUll- Invalid API Key or some bad url or some backend error");
                    }


                }

                else if (recentNewsHttpRequest.responseText.trim().length == 0) {
                    console.log("From Recent News- Garbage data which is null");
                }

            }

            else if (recentNewsHttpRequest.readyState == 4 && recentNewsHttpRequest.status >= 400 && recentNewsHttpRequest.status < 600) {
                console.log("Something wrong!");
            }


        }

        recentNewsHttpRequest.open("GET", "http://pipilika.com:70/recent_news/news/most/recent?total=1&&offset=0", true);
        recentNewsHttpRequest.setRequestHeader("api_key", 123);
        recentNewsHttpRequest.send();


        mostReadNewsHttpRequest.onreadystatechange = function () {
            if (mostReadNewsHttpRequest.readyState == 4 && mostReadNewsHttpRequest.status == 200) {
//console.log("latest "+ JSON.parse(latestNewsCheckIdHttpRequest.responseText).data[0].id);

                if (mostReadNewsHttpRequest.responseText.trim().length != 0) {

                    if (JSON.parse(mostReadNewsHttpRequest.responseText).success == true) {
                        console.log("From Most Read " + mostReadNewsHttpRequest.responseText);
                        mostReadNewsNewID = JSON.parse(mostReadNewsHttpRequest.responseText).data[0].id;
                    }
                    else if (JSON.parse(mostReadNewsHttpRequest.responseText).success == false) {
                        console.log("From Most Read News- Not NUll- Invalid API Key or some bad url or some backend error");
                    }

                }
                else if (mostReadNewsHttpRequest.responseText.trim().length == 0) {
                    console.log("From Most Read News- Garbage data which is null");
                }


            }

            else if (mostReadNewsHttpRequest.readyState == 4 && mostReadNewsHttpRequest.status >= 400 && mostReadNewsHttpRequest.status < 600) {
                console.log("Something wrong!");
            }


        }

        mostReadNewsHttpRequest.open("GET", "http://pipilika.com:70/recent_news/news/most/read?total=1&&offset=0", true);
        mostReadNewsHttpRequest.setRequestHeader("api_key", 123);
        mostReadNewsHttpRequest.send();


        discussedNewsHttpRequest.onreadystatechange = function () {
            if (discussedNewsHttpRequest.readyState == 4 && discussedNewsHttpRequest.status == 200) {
//console.log("latest "+ JSON.parse(latestNewsCheckIdHttpRequest.responseText).data[0].id);

                if (discussedNewsHttpRequest.responseText.trim().length != 0) {

                    if (JSON.parse(discussedNewsHttpRequest.responseText).success == true) {
                        console.log("From Discussed News " + discussedNewsHttpRequest.responseText);
                        discussedNewsNewID = JSON.parse(discussedNewsHttpRequest.responseText).data[0].id;
                    }
                    else if (JSON.parse(discussedNewsHttpRequest.responseText).success == false) {
                        console.log("From Discussed News- Not NUll- Invalid API Key or some bad url or some backend error");
                    }


                }
                else if (discussedNewsHttpRequest.responseText.trim().length == 0) {
                    console.log("From Discussed News- Garbage data which is null");
                }


            }

            else if (discussedNewsHttpRequest.readyState == 4 && discussedNewsHttpRequest.status >= 400 && discussedNewsHttpRequest.status < 600) {
                console.log("Something wrong!");
            }


        }

        discussedNewsHttpRequest.open("GET", "http://pipilika.com:70/recent_news/news/most/discussed?total=1&&offset=0", true);
        discussedNewsHttpRequest.setRequestHeader("api_key", 123);
        discussedNewsHttpRequest.send();


        //return newsID;
    }

    function getCacheID(newsType) {

        var cacheID = 0;

        if (newsType == "RecentNews" && localStorage.getItem("RecentNewsCacheData") != null) {


            cacheID = JSON.parse(localStorage.getItem("RecentNewsCacheData")).data[0].id;


        }
        else if (newsType == "MostReadNews" && localStorage.getItem("MostReadNewsCacheData") != null) {

            cacheID = JSON.parse(localStorage.getItem("MostReadNewsCacheData")).data[0].id;

        }
        else if (newsType == "DiscussedNews" && localStorage.getItem("DiscussedNewsCacheData") != null) {

            cacheID = JSON.parse(localStorage.getItem("DiscussedNewsCacheData")).data[0].id;

        }

        return cacheID;

    }

    function saveCacheData(jsonData, newsType) {

        if (newsType == "RecentNews") {


            localStorage.setItem("RecentNewsCacheData", JSON.stringify(jsonData));


        }
        else if (newsType == "MostReadNews") {

            localStorage.setItem("MostReadNewsCacheData", JSON.stringify(jsonData));

        }
        else if (newsType == "DiscussedNews") {

            localStorage.setItem("DiscussedNewsCacheData", JSON.stringify(jsonData));

        }

    }
}