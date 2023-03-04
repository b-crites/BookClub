console.log('Link test')

var openLibraryURL='https://openlibrary.org/api/books'

function getApi(){
fetch(openLibraryURL)
.then(function(data){
    console.log(data)
})
}
getApi()