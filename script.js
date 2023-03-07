console.log('Link test')
var searchButton= document.getElementById('searchButton')

var openLibraryURL='https://openlibrary.org/subjects/'

function getApi(event){
    event.preventDefault()
    var genreInput= document.getElementById('genreInput').value.toLowerCase().split(' ').join('+')
    console.log(genreInput)
    
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
searchButton.addEventListener('click',getApi)
