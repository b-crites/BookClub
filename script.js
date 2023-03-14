console.log('Link test');
// localStorage.clear();
var displayCardEl = document.getElementById('title-display');
var savedTitlesEl = document.getElementById('saved-titles');
var searchButton = document.getElementById('searchButton');
var openLibraryURL = 'https://openlibrary.org';
var worksArray = [];
var saveButton = "";
var marvelURL = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&apikey=ee2ad0bf7d1f2170031816014df5a8bf";

function getApi(event) {
    event.preventDefault();
    clearDisplay();
    worksArray = [];
   
    var genreInput = document.getElementById('genreInput').value.toLowerCase().split(' ').join('_');
    console.log(genreInput);
    if (genreInput === 'marvel') {
        fetch(marvelURL//,{
            // method: 'no-cors'
        //}
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // console.log(data.data.results);
                marvelDisplay(data);
            });
    }

    else {
        fetch(openLibraryURL + "/subjects/" + genreInput + '.json', {
            // mode: 'no-cors'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (response){
                let random =Math.random();
                let randomNumber= Math.floor(random*(response.work_count-5)) +1
                console.log(randomNumber)
                fetch(openLibraryURL + "/subjects/" + genreInput + '.json'  + '?limit=5&offset=' + randomNumber)

            .then(function(data){
                return data.json()
            })

            .then(function (data) {
                console.log(data);
                for (var i = 0; i < data.works.length; i++) {
                    worksArray.push(data.works[i])
                }
                
            })
            .then(function () {
                for (var i = 0; i < worksArray.length; i++) {
                    console.log(worksArray[i].key);
                    fetch(openLibraryURL + '/api/books?bibkeys=OLID:' + worksArray[i].cover_edition_key + '&jscmd=data' + '&format=json')
                        //mode: 'no-cors'
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            console.log(data);
                            searchDisplay(data);
                        })

                };

            })
        })
    }

};

//A function that picks and displays the selected info in our ul element "title-display"
function searchDisplay(data) {
    var book = Object.values(data)[0];
    var authors = book.authors;
    var image = book.cover;

    console.log(authors[0].name);
    var anchorEl = document.createElement('a');
    anchorEl.setAttribute('href',book.url);

    var bookImage = document.createElement('img');
    bookImage.classList.add('book-img');
    bookImage.setAttribute('src', image.medium);

    var displayCard = document.createElement('li');
    displayCard.classList.add('display-card');

    var displayBody = document.createElement('div');
    displayBody.classList.add('display-body');
    displayBody.innerHTML = '<br/>' + 'Author:' + authors[0].name;

    saveButton = document.createElement('button');
    saveButton.classList.add('save-button');
    saveButton.innerText = 'Save';
    saveButton.setAttribute("url", book.url);
    saveButton.setAttribute("title", book.title);

    var displayTitle = document.createElement('h2');
    displayTitle.innerHTML = book.title;
    anchorEl.append(bookImage);
    displayCard.append(displayTitle, displayBody, anchorEl, saveButton );
    displayCardEl.append(displayCard);
    

    saveButton.addEventListener('click', e=> {
        console.log(e);
        saveTitle(e);
    });
};

function marvelDisplay(data){
    var comics = data.data.results;
    for(i = 0; i < comics.length, i < 10; i++) {
        var creators = comics[i].creators.items[0].name;
        var comicTitles = comics[i].title;
        var anchorEl = document.createElement('a');
        anchorEl.setAttribute('href',comics[i].urls[0].url);

        var comicImages = comics[i].thumbnail.path +'.jpg';
        var displayCard = document.createElement('li');
        displayCard.classList.add('display-card');

        var displayTitle = document.createElement('h2');
        displayTitle.innerHTML = comicTitles;

        var bookImage = document.createElement('img');
            bookImage.classList.add('book-img');
            bookImage.setAttribute('src', comicImages);

        var displayBody = document.createElement('div');
        displayBody.classList.add('display-body');
        displayBody.innerHTML = '<br/>' + 'Creator:' + creators;

        var saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.innerText = 'Save';
        saveButton.setAttribute("url", comics[i].urls[0].url);
        saveButton.setAttribute("title", comics[i].title);

        anchorEl.append(bookImage);
        displayCard.append(displayTitle, anchorEl , displayBody, saveButton );
        displayCardEl.append(displayCard);

        saveButton.addEventListener('click', e=> {
            console.log(e);
            saveMarvelTitle(e);
        });
    }
};

function saveMarvelTitle(marvelData) {
    var a = marvelData.target;
    var title = a.getAttribute("title");
    var url = a.getAttribute("url");
    var savedMarvel = JSON.parse(localStorage.getItem("savedMarvel"));

    if(!savedMarvel) {
        var saveMarvel = {};
        saveMarvel[0] = title + "?! ";
        saveMarvel[1] = url + "?! ";
        localStorage.setItem("savedMarvel", JSON.stringify(saveMarvel));

    }
    else {
        savedMarvel[0] = savedMarvel[0] + title + "?! ";
        savedMarvel[1] = savedMarvel[1] + url + "?! ";
        localStorage.setItem("savedMarvel", JSON.stringify(savedMarvel));
    };
    saveMarvelDisplay(marvelData);
};

function saveMarvelDisplay() {
    //clearSaveDisplay();
    var savedMarvel = JSON.parse(localStorage.getItem("savedMarvel"));

    if(!savedMarvel) {
        console.log("no data yet");
        return
    }
    else {
        var savedTitles = savedMarvel[0];
        var URLs = savedMarvel[1];

        var newTitles = "";
        newTitles = savedTitles.split("?! ");

        var newURLs = "";
        newURLs = URLs.split("?! ");

        for (i = 0; i < newTitles.length; i++) {
            var savedBookEl = document.createElement('li');
            var savedBook = document.createElement('a');
            savedBook.textContent = newTitles[i]; 
            savedBook.classList.add("saved-card");
            savedBook.setAttribute('href', newURLs[i]);
            savedBookEl.append(savedBook);
            savedTitlesEl.append(savedBookEl);
        };
    };
};

// A function that saves the name and a link to favorited titles -- for non Marvel titles
function saveTitle(data) {
    var a = data.target;
    var title = a.getAttribute("title");
    var url = a.getAttribute("url");
    var savedData = JSON.parse(localStorage.getItem("savedData"));

    if(!savedData) {
        var saveData = {};
        saveData[0] = title + ", ";
        saveData[1] = url + ", ";
        localStorage.setItem("savedData", JSON.stringify(saveData));

    }
    else {
        savedData[0] = savedData[0] + title + ", ";
        savedData[1] = savedData[1] + url + ", ";
        localStorage.setItem("savedData", JSON.stringify(savedData));
    };
    saveDisplay(data);
};

// In saveDisplay if/else statement to diferentiate between normal data vs marvel data
// put all the information into for loop to create display
// before run  -- clearDisplay

// Write a function that displays the save titles and links in our display section "saved-titles"
function saveDisplay(event) {
    event.preventDefault();
    console.log(event.target);

    clearSaveDisplay();

    var savedData = JSON.parse(localStorage.getItem("savedData"));

    if(!savedData) {
        console.log("no data yet");
        return
    }
    else {
        var savedTitles = savedData[0];
        var URLs = savedData[1];

        var newTitles = "";
        newTitles = savedTitles.split(", ");

        var newURLs = "";
        newURLs = URLs.split(", ");
    
        for (i=0; i< newTitles.length; i++) {
            var savedBookEl = document.createElement('li');
            var savedBook = document.createElement('a');
            savedBook.textContent = newTitles[i]; 
            savedBook.classList.add("saved-card");
            savedBook.setAttribute('href', newURLs[i]);
            savedBookEl.append(savedBook);
            savedTitlesEl.append(savedBookEl);
        };
    };
    
};

function clearSaveDisplay() {
    while (savedTitlesEl.firstChild){
        savedTitlesEl.removeChild (savedTitlesEl.firstChild)
    };
};

//A function that clears the Search Display before each search
function clearDisplay(){
    while (displayCardEl.firstChild){
        displayCardEl.removeChild(displayCardEl.firstChild)
    };
};

searchButton.addEventListener('click', getApi);
saveMarvelDisplay();
saveDisplay();