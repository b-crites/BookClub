console.log('Link test')
var displayCardEl = document.getElementById('title-display')
var savedTitlesEl = document.getElementById('saved-titles')
var searchButton = document.getElementById('searchButton')
var openLibraryURL = 'https://openlibrary.org'
var worksArray = []
var marvelURL = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&apikey=ee2ad0bf7d1f2170031816014df5a8bf"
function getApi(event) {
    event.preventDefault()
    worksArray = []
    var genreInput = document.getElementById('genreInput').value.toLowerCase().split(' ').join('_')
    console.log(genreInput)
    if (genreInput === 'marvel') {
        fetch(marvelURL, {
            // method: 'no-cors'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
            })
    }

    else {
        fetch(openLibraryURL + "/subjects/" + genreInput + '.json' + '?per_page=10', {
            // mode: 'no-cors'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                for (var i = 0; i < data.works.length; i++) {
                    worksArray.push(data.works[i])
                }
                console.log(worksArray)
            })
            .then(function () {
                for (var i = 0; i < worksArray.length; i++) {
                    console.log(worksArray[i].key)
                    fetch(openLibraryURL + '/api/books?bibkeys=OLID:' + worksArray[i].cover_edition_key + '&jscmd=data' + '&format=json', {
                        // mode: 'no-cors'
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            console.log(data)
                            searchDisplay(data)
                        })

                }

            })
    }

}
searchButton.addEventListener('click', getApi)

//A function that picks and displays the selected info in our ul element "title-display"
//List items need a card style display, Title, Description, and save button element (images if possible)
function searchDisplay(data) {
    var book = Object.values(data)[0]
    var authors = book.authors
    var image = book.cover

    console.log(authors[0].name)
    var anchorEl =document.createElement('a')
    anchorEl.setAttribute('href',book.url)

    var bookImage = document.createElement('img')
    bookImage.classList.add('book-img')
    bookImage.setAttribute('src', image.medium)

    var displayCard = document.createElement('li');
    displayCard.classList.add('display-card');

    var displayBody = document.createElement('div');
    displayBody.classList.add('display-body');
    displayBody.innerHTML = '<br/>' + 'Author:' + authors[0].name

    var saveButton = document.createElement('button')
    saveButton.classList.add('save-button')
    saveButton.innerText= 'Save'

    var displayTitle = document.createElement('h2')
    displayTitle.innerHTML = book.title
    anchorEl.append(bookImage)
    displayCard.append(displayTitle, displayBody, anchorEl, saveButton )
    displayCardEl.append(displayCard)
}

//Write a function that saves the name and a link to favorited titles
//The link should connect to titles page on either open library or the Marvel website
function saveTitle(event) {
    var localSaved = localStorage.getItem(JSON.parse("savedItems"));
    var title = event.target.textContent;
    var link = "" // the clicked on items link (href attribute)?
    localSaved.concat(title);
    localSaved.concat(link);
    localStorage.setIItem("savedItems", JSON.stringify(localSaved));
}

//Write a function that displays the save titles and links in our display section "saved-titles"
//The link should connect to titles page on either open library or the Marvel website
function saveDisplay() {

    var savedSearches = JSON.parse(localStorage.getItem('local storage neame from above'));
    console.log(savedSearches);

    savedSearches.forEach(createItem)

    function createItem() {
        var savedItem = document.createElement('li');
        savedItem.textContent = savedSearches //want to get the title from the array object
        savedItem.setAttribute('href', savedSearches) //want to get the link from the array object

        savedTitlesEl.append(savedItem);

    }

 }



