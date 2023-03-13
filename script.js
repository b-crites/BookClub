console.log('Link test');

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
                console.log(data.data.results);
                marvelDisplay(data);
            });
    }

    else {
        fetch(openLibraryURL + "/subjects/" + genreInput + '.json' + '?per_page=10', {
            // mode: 'no-cors'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                for (var i = 0; i < data.works.length; i++) {
                    worksArray.push(data.works[i])
                }
                console.log(worksArray);
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
    }

};

searchButton.addEventListener('click', getApi);

//A function that picks and displays the selected info in our ul element "title-display"
//List items need a card style display, Title, Description, and save button element (images if possible)
function searchDisplay(data) {
    var book = Object.values(data)[0];
    var authors = book.authors;
    var image = book.cover;

    console.log(authors[0].name);
    var anchorEl =document.createElement('a');
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
    saveButton.innerText= 'Save';
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
        //console.log(data)
    });
    

};

function marvelDisplay(data){
    var comics= data.data.results;
    for(i=0;i<10;++i) {
        
        var creators= comics[i].creators.items[0].name;


        var comicTitles = comics[i].title;


        var anchorEl = document.createElement('a');
        anchorEl.setAttribute('href',comics[i].urls[0].url);
        // console.log(comics[i].urls[0].url);

        var comicImages=comics[i].thumbnail.path +'.jpg';


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
            saveButton.innerText= 'Save';
        anchorEl.append(bookImage);
        displayCard.append(displayTitle, anchorEl , displayBody, saveButton );
        displayCardEl.append(displayCard);

        saveButton.addEventListener('click', e=> {
            console.log(e);
            saveTitle(e);
            //console.log(data);
        });
    }

};

//Write a function that saves the name and a link to favorited titles
//The link should connect to titles page on either open library or the Marvel website
function saveTitle(e) { //for titles not marvel
    var a = e.target;
    var title = a.getAttribute("title");
    var url = a.getAttribute("url");
    console.log(url);
    console.log(title);
    var savedItems = JSON.parse(localStorage.getItem("savedItems"));

    if (savedItems === null) {
        savedItems = title + ", " + url + ", ";
        console.log(savedItems);
        localStorage.setItem("savedItems", JSON.stringify(savedItems));
        console.log(savedItems);
    } 
    else {
        savedItems = savedItems + title + ", " + url + ", ";
        console.log(savedItems);
        localStorage.setItem("savedItems", JSON.stringify(savedItems));
        console.log(savedItems);
        // localStorage.clear();  for resetting
    };
   
};


//Write a function that displays the save titles and links in our display section "saved-titles"
//The link should connect to titles page on either open library or the Marvel website
function saveDisplay() {

    var savedSearches = JSON.parse(localStorage.getItem("savedItems"));
    console.log(savedSearches);

    savedSearches.forEach(createItem);

    // function createItem() {
    //     var savedItem = document.createElement('li');
    //     savedItem.textContent = savedSearches.title; //want to get the title from the array object
    //     savedItem.setAttribute('href', savedSearches.link); //want to get the link from the array object

    //     savedTitlesEl.append(savedItem);

    // }

};

//Write a function that clears the Search Display before each search
function clearDisplay(){
    while (displayCardEl.firstChild){
        displayCardEl.removeChild (displayCardEl.firstChild)
    }
};

