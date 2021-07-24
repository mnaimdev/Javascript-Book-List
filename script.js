// Book Class : Represent a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI Class : Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger delete btn-sm">x</a></td>
            `;
    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = null;
    document.querySelector("#author").value = null;
    document.querySelector("#isbn").value = null;
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
}
// Store Class :  Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// Event  : Display a Book
document.addEventListener("DOMContentLoaded", UI.displayBooks);
// Event : Add a Book

document.querySelector("#book-form").addEventListener("submit", (e) => {
  /**
   * prevent form default submission
   */
  e.preventDefault();
  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate

  /**
   *
   *
   * check title,author,isbn is null or not
   * if title,author,isbn any of them is null then give error message
   *
   *
   */
  if (!title || !author || !isbn  && title === ' ' || author === ' ' || isbn === ' ') {
    UI.showAlert("please fill all fields", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);
    //  Add book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // success message
    UI.showAlert("Book added", "success");

    // Clear fields
    UI.clearFields();
  }
});
// Event : Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // remove book from UI
  UI.deleteBook(e.target);
  //  remove book from storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // remove message
  UI.showAlert("Book removed", "success");
});
