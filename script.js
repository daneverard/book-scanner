function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#preview')
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (data) {
        const isbn = data.codeResult.code;
        fetchBookDetails(isbn);
        Quagga.stop();
    });
}

function fetchBookDetails(isbn) {
    fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
        .then(response => response.json())
        .then(data => {
            const book = data[`ISBN:${isbn}`];
            if (book) {
                document.getElementById('title').textContent = book.title;
                document.getElementById('author').textContent = book.authors[0].name;
                document.getElementById('publisher').textContent = book.publishers[0].name;
                document.getElementById('pubDate').textContent = book.publish_date;
                document.getElementById('book-details').style.display = 'block';
            } else {
                alert('Book not found!');
            }
        })
        .catch(error => {
            console.error("Error fetching book details:", error);
        });
}

