import './style.css';

import _ from 'lodash';

document.getElementById('searchButton').addEventListener('click', () => {
    const category = document.getElementById('searchBox').value;
    searchBooks(category);
});

document.getElementById('clearButton').addEventListener('click', () => {
    clearSearch();
});

let currentDescriptionElement = null;

async function searchBooks(category) {
    try {
        const response = await fetch(`https://openlibrary.org/subjects/${category}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const books = _.get(data, 'works', []);
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    if (books.length === 0) {
        const message = document.createElement('li');
        message.textContent = 'No books found';
        bookList.appendChild(message);
    } else {
        books.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = _.get(book, 'title', 'No title available');

            const container = document.createElement('div');
            container.appendChild(listItem);

            listItem.addEventListener('click', () => {
                fetchBookDescription(_.get(book, 'key', ''))
                    .then(description => {
                        if (currentDescriptionElement) {
                            currentDescriptionElement.remove();
                        }

                        const descriptionElement = document.createElement('div');
                        descriptionElement.classList.add('description');
                        descriptionElement.textContent = typeof description === 'string' ? description : _.get(description, 'value', 'No description available');
                        container.appendChild(descriptionElement);

                        currentDescriptionElement = descriptionElement;
                    })
                    .catch(error => {
                        console.error('Error fetching book description:', error);
                    });
            });

            bookList.appendChild(container);
        });
    }
}

async function fetchBookDescription(bookKey) {
    try {
        const response = await fetch(`https://openlibrary.org${bookKey}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return _.get(data, 'description', 'No description available.');
    } catch (error) {
        console.error('Error fetching book description:', error);
        return 'Failed to fetch description.';
    }
}

function clearSearch() {
    document.getElementById('searchBox').value = '';
    document.getElementById('bookList').innerHTML = '';
    if (currentDescriptionElement) {
        currentDescriptionElement.remove();
        currentDescriptionElement = null;
    }
}
