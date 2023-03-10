console.log('Link test')
var savedTitlesEl = document.getElementById('saved-titles')
var searchButton = document.getElementById('searchButton')
var openLibraryURL = 'https://openlibrary.org'
var worksArray = []
var marvelURL = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&apikey=ee2ad0bf7d1f2170031816014df5a8bf"
function getApi(event) {
    event.preventDefault()
    worksArray= []
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
            .then( function (){
        for (var i = 0; i < worksArray.length; i++) {
            console.log (worksArray[i].key)
            fetch(openLibraryURL + '/api/books?bibkeys=OLID:' + worksArray[i].cover_edition_key +'&jscmd=data' + '&format=json',{
               // mode: 'no-cors'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                })
            }
        })
    }
}
searchButton.addEventListener('click', getApi)

//A function that picks and displays the selected info in our ul element "title-display"
//List items need a card style display, Title, Description, and save button element (images if possible)
function searchDisplay() { 

}

//Write a function that saves the name and a link to favorited titles
//The link should connect to titles page on either open library or the Marvel website
function saveTitle() { 
    
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



