const bookList = document.getElementById("bookList");
const newBookForm = document.getElementById("bookForm");
const submitButton = document.getElementById("submitButton");
const newBookButton = document.getElementById("newBookButton");

class Book {
  constructor(title, author, isRead = false) {
    this.title = title;
    this.author = author;
    this.isRead = isRead;
  }
  info() {
    return this.title + " - " + this.author;
  }
  toggleRead() {
    this.isRead = !this.isRead;
  }
}

window.onload = function () {
  if (localStorage.getItem("myLibrary")) {
    let previousLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    if (previousLibrary.length > 0) {
      previousLibrary.forEach((item) => {
        let book = new Book(item.title, item.author, item.isRead);
        addBookToLibrary(book);
      });
      updateBookList();
    }
  }
};

let myLibrary = [];

function updateLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function updateBookList() {
  while (bookList.firstChild) {
    bookList.removeChild(bookList.firstChild);
  }
  myLibrary.forEach((book) => {
    appendBook(book);
  });
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  updateLocalStorage();
}

function removeBookFromLibrary(bookIndex) {
  myLibrary.splice(bookIndex, 1);
  updateBookList();
  updateLocalStorage();
}

newBookButton.addEventListener("click", function () {
  newBookForm.classList.remove("hidden");
});

submitButton.addEventListener("click", function () {
  let bookTitle = document.getElementById("titleInputBox").value;
  let bookAuthor = document.getElementById("authorInputBox").value;

  let book = new Book(bookTitle, bookAuthor);

  addBookToLibrary(book);
  updateBookList();
  //appendBook(book);
  newBookForm.classList.add("hidden");
});

function appendBook(book) {
  let bookItem = document.createElement("div");
  bookItem.setAttribute("data", myLibrary.indexOf(book));
  bookItem.setAttribute("class", "book");
  
  let bookInfo = document.createElement("h1");
  bookInfo.innerHTML = book.info();

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "x";
  deleteButton.setAttribute("type", "button");
  deleteButton.addEventListener("click", function (book) {
    let index = deleteButton.parentNode.attributes['data'].value;
    removeBookFromLibrary(index);
    bookItem.remove();
  });

  let readButton = document.createElement("button");
  readButton.setAttribute("type", "button");
  readButton.classList.add("readButton");
  if (book.isRead) {
    readButton.innerHTML = "Read";
    readButton.classList.add("isRead");
  } else {
    readButton.innerHTML = "Not Read";
    readButton.classList.remove("isRead");
  }
  readButton.addEventListener("click", function () {
    book.toggleRead();
    if (book.isRead) {
      readButton.innerHTML = "Read";
      readButton.classList.add("isRead");
    } else {
      readButton.innerHTML = "Not Read";
      readButton.classList.remove("isRead");
    }
    updateLocalStorage();
  });

  bookItem.appendChild(deleteButton);
  bookItem.appendChild(bookInfo);
  bookItem.appendChild(readButton);

  bookList.appendChild(bookItem);
}
