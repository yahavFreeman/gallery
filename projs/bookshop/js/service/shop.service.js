'use strict'
const PAGE_SIZE=2;
const KEY='booksDB'
var gBooks
var gPageIndx=0
var gFilterBy
var gSortBy='txt'

_createBooks()
function getBooks(){
    var books=gBooks
    var start=gPageIndx*PAGE_SIZE
    books=books.slice(start,start+PAGE_SIZE)
    return books
}

function nextPage(){
    gPageIndx+=1
    if(gPageIndx*PAGE_SIZE>=gBooks.length){
        gPageIndx=0  
    }
}

function removeBook(thisBook){
    gBooks=gBooks.filter(book=>{
        return (book.id!==thisBook)
    })
    saveToStorage(KEY,gBooks)
}

function AddBook(bookName,bookPrice){
    var book=_createBook()
    book.Title=bookName
    book.price=bookPrice
    gBooks.push(book)
    saveToStorage(KEY,gBooks)
}

function UpdateBook(bookId,newPrice){
gBooks.forEach(book=>{
    if(book.id===bookId){
        book.price=newPrice
    }
})
saveToStorage(KEY,gBooks)
}

function ShowModal(bookID){
    var book=gBooks.filter(book=>{
        return (book.id===bookID)
    })
    var elModal=document.querySelector(".reading-material")
    elModal.innerHTML=book[0].read   
        elModal.innerHTML+=`<br><button class="close-Modal" onclick="onCLoseModal()">Close</button><a href="${book[0].imgUrl}">link to the book\'s picture</a>`
    elModal.hidden=false
}

function CLoseModal(){
    var elModal=document.querySelector(".reading-material")
    elModal.hidden=true
}

function rating(howMuch,bookID){
    gBooks.forEach(book=>{
        if(book.id===bookID){
            if(book.rating+howMuch>=0 && book.rating+howMuch<=10){
                book.rating+=howMuch
            }
        }
    })
saveToStorage(KEY,gBooks)
}

function sort(num){
    if(num){
        gSortBy='price'
    }else{
        gSortBy='txt'
    }
    sortBooks()
}

function sortBooks(){
    if (gSortBy==='txt'){
        console.log('sorting by txt')
        gBooks.sort((a, b) => a.Title.localeCompare(b.Title))
        return gBooks
    }else if (gSortBy==='price'){
        gBooks.sort(function(a, b){return a.price-b.price;})
        return gBooks
    }
saveToStorage(KEY,gBooks)
}

function _createBook(){
    var titles=['hu',"hi",'ho','po','ro']
    return{
        id:Math.floor(Math.random()*100000)+1,
        Title:titles[Math.floor(Math.random()*titles.length)],
        price:Math.floor(Math.random()*100),
        read:makeLorem(),
        rating:0,
        imgUrl:"https://www.google.com/search?q=lotr&tbm=isch&ved=2ahUKEwi-qrru7cfzAhUckaQKHZN5Ca4Q2-cCegQIABAA&oq=lotr&gs_lcp=CgNpbWcQAzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIECAAQQzIFCAAQgAQyBQgAEIAEOgsIABCABBCxAxCDAToICAAQgAQQsQM6BwgAELEDEENQrKgYWJSuGGDmrxhoAHAAeACAAeMBiAGUBpIBBTAuMi4ymAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=IBBnYb6aCZyikgWT86XwCg&bih=722&biw=1536"
    }
}

function _createBooks(){
    var books=loadFromStorage(KEY)
    if (!books||books.length===0){
        books=[]
        for (var i=0;i<3;i++){
            books.push(_createBook())
        }
    }
    gBooks=books
    saveToStorage(KEY,gBooks)
}
