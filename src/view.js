import _ from 'lodash';
import { fetchBookDescription } from '.';
import { currentDescriptionElement } from '.';

export function displayBooks(books) {
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

export function clearSearch() {
    document.getElementById('searchBox').value = '';
    document.getElementById('bookList').innerHTML = '';
    if (currentDescriptionElement) {
        currentDescriptionElement.remove();
        currentDescriptionElement = null;
    }
}


