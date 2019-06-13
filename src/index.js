// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 


const BASE_URL_WITH_LIKES = "http://localhost:3000/quotes?_embed=likes";
const BASE_URL = "http://localhost:3000/quotes/";
const LIKES_URL = "http://localhost:3000/likes";
const quoteList = document.querySelector("#quote-list");
const quoteForm = document.querySelector("#new-quote-form");

function postQuote(quote) {
	return fetch(BASE_URL_WITH_LIKES, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newQuote)
	})
}

quoteForm.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log({ e });
	
	newQuote = {
		quote: e.target[0].value,
		author: e.target[1].value,
		likes: []
	};

	postQuote(newQuote)
		.then(renderQuote(newQuote))
});

function getQuotes() {
	return fetch(BASE_URL_WITH_LIKES)
		.then(resp => resp.json());
}

function deleteQuote(event) {
	fetch(`${BASE_URL}${event.target.dataset.id}`,{method: "DELETE"})
		.then(event.target.parentNode.parentNode.remove())
}

function like(event) {
	like = {
		quoteId: parseInt(event.target.dataset.id),	
	};
	fetch(LIKES_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(like)
	})
		.then(() => {
			const currentLikes = parseInt(event.target.innerText.replace("Likes: ", ""));
			event.target.innerHTML = `Likes: <span>${currentLikes + 1}</span>`
		});
}

function renderQuote(quote) {
	quoteCard = document.createElement("li");
	quoteCard.className = "quote-card";

	blockquote = document.createElement("blockquote");
	blockquote.className = "blockquote";

	p = document.createElement("p");
	p.className = "mb-0";
	p.innerText = quote.quote;

	footer = document.createElement("footer");
	footer.className = "blockquote-footer";
	footer.innerText = quote.author;

	br = document.createElement("br");

	likeButton = document.createElement("button");
	likeButton.className = "btn-success";
	likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
	likeButton.dataset.id = quote.id;
	likeButton.addEventListener("click", like);

	deleteButton = document.createElement("button");
	deleteButton.className = "btn-danger";
	deleteButton.innerText = "Delete";
	deleteButton.dataset.id = quote.id;
	deleteButton.addEventListener("click", deleteQuote)

	blockquote.append(p, footer, br, likeButton, deleteButton);
	quoteCard.appendChild(blockquote);
	quoteList.appendChild(quoteCard);
}

function populateQuotes() {
	getQuotes()
		.then((quotes) => {
			quotes.forEach(renderQuote);
		});
}

populateQuotes();
