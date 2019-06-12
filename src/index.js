document.addEventListener("DOMContentLoaded", function() {
  fetchThenRenderQuotes();
});
//////////////////////////////
const baseUrl = "http://localhost:3000/quotes/";
const likesUrl = "http://localhost:3000/likes/";
//////////////////////////////
const quoteList = document.querySelector("#quote-list");
const quoteForm = document.querySelector("#new-quote-form");
//////////////////////////////
function fetchQuotes() {
  return fetch(baseUrl).then(response => response.json());
}
//////////////////////////////
function fetchLikes() {
  return fetch(likesUrl).then(response => response.json());
}
//////////////////////////////
function makeQuoteList(quote) {
  const li = document.createElement("li");
  li.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";
  li.appendChild(blockquote);

  const p = document.createElement("p");
  p.innerText = quote.quote;
  blockquote.appendChild(p);

  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  blockquote.appendChild(footer);

  const likeBtn = document.createElement("button");
  likeBtn.className = "btn-success";
  likeBtn.innerText = "Likes";
  blockquote.appendChild(likeBtn);
  likeBtn.addEventListener("click", () => addLikeToServer(quote));

  const span = document.createElement("span");
  span.innerText = counter;
  span.className = counter;
  likeBtn.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-danger";
  deleteBtn.innerText = "Delete";
  blockquote.appendChild(deleteBtn);
  deleteBtn.addEventListener("click", () => deleteQuote(quote));

  return li;
}
//////////////////////////////
function renderQuotes(json) {
  quoteList.innerHTML = "";
  json.forEach(quote => {
    quoteList.appendChild(makeQuoteList(quote));
  });
}
//////////////////////////////
function fetchThenRenderQuotes() {
  fetchQuotes().then(renderQuotes);
}
//////////////////////////////
quoteForm.addEventListener("submit", addQuoteToServer);
//////////////////////////////
function addQuoteToServer(e) {
  e.preventDefault();
  const quote = {
    quote: e.target[0].value,
    author: e.target[1].value
  };
  createQuote(quote).then(addQuoteToPage(quote));
  e.target.reset();
}
//////////////////////////////
function createQuote(quote) {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  });
}
//////////////////////////////
function addQuoteToPage(quote) {
  const quoteCard = makeQuoteList(quote);
  quoteCard.dataset.id = quote.id;
  quoteList.appendChild(quoteCard);
}
//////////////////////////////
function deleteQuote(quote) {
  const parent = event.target.parentElement;
  deleteQuoteFromServer(quote.id).then(() => parent.remove());
}
//////////////////////////////
function deleteQuoteFromServer(id) {
  return fetch(baseUrl + id, {
    method: "DELETE"
  });
}
//////////////////////////////
function addLikeToServer(quote) {
  event.preventDefault();
  counter++;
  const like = {
    quoteId: quote.id
  };
  createLike(like, quote).then(fetchThenRenderQuotes);
}
//////////////////////////////
function createLike(like, quote) {
  return fetch(likesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(like)
  });
}
//////////////////////////////
let counter = 0;
