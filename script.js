console.log('Link test')
var searchButton= document.getElementById('searchButton')

var openLibraryURL='https://openlibrary.org/subjects/'
var marvelURL= 'https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&apikey=ee2ad0bf7d1f2170031816014df5a8bf'

function getApi(event){
    event.preventDefault()
    var genreInput= document.getElementById('genreInput').value.toLowerCase().split(' ').join('+')
    console.log(genreInput)
if(genreInput === 'marvel'){
    fetch(marvelURL, {
         mode: 'no-cors',
         headers: {
            "Content-Type": "application/json",
         }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
        console.log(data)
    })

}    
    else {
fetch(openLibraryURL+genreInput+'.json' , {
    // method: 'no-cors'
})
.then(function (response) {
    return response.json();
})
.then(function(data){
    console.log(data)
})
    }
}
searchButton.addEventListener('click',getApi)
