window.onload = () => {
  initializeUI();
  updateBookListFromDB();
};

var firebaseConfig = {
    apiKey: "AIzaSyBffTv5IlN1urARx1fmR-1ICwPYFi-JsHU",
    authDomain: "library-a091b.firebaseapp.com",
    projectId: "library-a091b",
    storageBucket: "library-a091b.appspot.com",
    messagingSenderId: "255169206482",
    appId: "1:255169206482:web:0b1a1ac332d65e1f95f50b",
    measurementId: "G-8TPJCJRNEY",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const bookDB = db.collection("Books");

  
/**
 * Adds a book document to the database
 * @param {Book} book Takes a Book object with title, author and isRead properties
 */
function addBookToDB(book) {
  try {
    bookDB
      .add({
        title: book.title,
        author: book.author,
        isRead: book.isRead,
      })
      .then((book) => {
        console.log("added book successfully with ID : ", book.id);
        addBookToBookList(book.id);
      });
  } catch (e) {
    console.log("Error adding book: ", e);
  }
}

/**
 * Deletes a given book from the database
 * @param {id} id takes a document ID from the firestore database
 */
function deleteBookFromDB(id) {
  try {
    bookDB
      .doc(id)
      .delete()
      .then(() => {
        console.log("Deleted book");
      });
  } catch (e) {
    console.log("Error deleting book: ", e);
  }
}

/**
 * Toggles the isRead property in the database
 * @param {id} id takes a document ID from the firestore database
 */
function toggleIsRead(id) {
  bookDB
    .doc(id)
    .get()
    .then((status) => {
      status = status.data().isRead;
      bookDB
        .doc(id)
        .update({
          isRead: !status,
        })
        .then(() => {
          console.log("Updated book to status: ", !status);
        });
    });
}

/**
 * Appends a book to the UI book list 
 * @param {id} id Takes a document ID from the firestore database
 */
function addBookToBookList(id) {
  bookDB
    .doc(id)
    .get()
    .then((book) => {
      
      //Creates main book card element  
      let bookItem = document.createElement("div");
      bookItem.setAttribute("class", "book");
      bookItem.setAttribute("data-id", id);
      
      //Book info is stored in an H1 tag
      let bookInfo = document.createElement("h1");
      bookInfo.innerHTML = book.data().title + " - " + book.data().author;
      
      //Delete button
      let deleteButton = document.createElement("button");
      deleteButton.innerHTML = "x";
      deleteButton.setAttribute("type", "button");
      deleteButton.addEventListener("click", function () {
        deleteBookFromDB(bookItem.getAttribute("data-id"));
        bookItem.remove();
      });

      //Button that toggles has read status
      let readButton = document.createElement("button");
      readButton.setAttribute("type", "button");
      readButton.classList.add("readButton");
      readButton.classList.add("not");
      readButton.innerHTML = "Read";
      if (book.data().isRead) {
        readButton.classList.add("isRead");
        readButton.classList.remove("not");
      } else {
        readButton.classList.remove("isRead");
      }
      readButton.addEventListener("click", function () {
        bookDB
          .doc(bookItem.getAttribute("data-id"))
          .get()
          .then((book) => {
            toggleIsRead(book.id);
            readButton.classList.toggle("isRead");
            readButton.classList.toggle("not");
          });
      });

      //Appending all elements to the main card and appending the card to the list
      bookItem.appendChild(deleteButton);
      bookItem.appendChild(bookInfo);
      bookItem.appendChild(readButton);
      bookList.appendChild(bookItem);
    });
}

//Called on window load. Takes all books from database and appends then to the UI list
function updateBookListFromDB(){
    bookDB.get().then((snapshot) =>{
        snapshot.docs.forEach((book)=>{
            addBookToBookList(book.id);
        })
    })
}

//UI Elements
const bookList = document.getElementById("bookList");
const newBookForm = document.getElementById("bookForm");
const submitButton = document.getElementById("submitButton");
const newBookButton = document.getElementById("newBookButton");

//Initializes listeners for the new book form and submit buttons
function initializeUI() {
  newBookButton.addEventListener("click", function () {
    newBookForm.classList.remove("hidden");
  });

  submitButton.addEventListener("click", function () {
    let book = {
      title: document.getElementById("titleInputBox").value,
      author: document.getElementById("authorInputBox").value,
      isRead: false,
    };
    addBookToDB(book);
    newBookForm.classList.add("hidden");
  });
}

