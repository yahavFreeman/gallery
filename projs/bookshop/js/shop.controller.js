'use strict'
function onInit(){
    renderBooks()
}

function renderBooks(){
    var books=getBooks()
    var thHtml='<th>Id</th><th class="sort" onclick="onSort(0)">Title</th><th class="sort" onclick="onSort(1)">Price</th><th>Action</th><th>Rating</th>'
    //books is an array, we can use map so it will give us a new copy of it all and return to the string foreach index
    var strHtml = books.map(book=>{
        return`<tr class = "books">
        <td>${book.id}</td>
        <td>${book.Title}</td>
        <td>${book.price}</td>
        <td><button class="read" onclick="onShowModal(${book.id})">Read</button><button class="update" onclick="onUpdateBook (${book.id})">Update</button><button class="delete" onclick="onRemoveBook(${book.id})">Delete</button></td>
        <td><button class="rate" onclick="onRating(-1,${book.id})">-</button><input style="width:20px; text-align:center;" type="text" value="${book.rating}"><button class="rate" onclick="onRating(1,${book.id})">+</button></td>
        </tr>`
    })
    var elBooks=document.querySelector('.da-books')
    elBooks.innerHTML=thHtml+strHtml.join('')
}

function onNextPage(){
    nextPage()
    renderBooks()
}

function onRemoveBook(bookId){
    removeBook(bookId)
    renderBooks()
}

function onAddBook(){
    var elbook=document.querySelector(".add-book-input")
    elbook.hidden=false
    elbook.innerHTML='<input class = "new-book-name" type="text" placeholder="book name"> <input class = "new-book-price" type="text" placeholder="book price"><br><button class="submit" onclick="addIt()">Submit</button>'
}

function addIt(){
var elBookName=document.querySelector(".new-book-name")
var elBookPrice=document.querySelector(".new-book-price")
var bookName=elBookName.value
var bookPrice=elBookPrice.value
console.log(bookName)
AddBook(bookName,bookPrice)
renderBooks()
var elbook=document.querySelector(".add-book-input")
    elbook.hidden=true
}

function onUpdateBook (bookId){
    var newPrice=prompt('what is the new price?')
UpdateBook(bookId,newPrice)
renderBooks()
}

function onShowModal(bookID){
ShowModal(bookID)
}

function onCLoseModal(){
    CLoseModal()
}

function onRating(howMuch,bookID){
    rating(howMuch,bookID)
    renderBooks()
}

function onSort(num){
sort(num)
renderBooks()
}

