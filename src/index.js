// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const BASE_URL = "http://localhost:3000/quotes?_embed=likes";
const QUOTES_URL = "http://localhost:3000/quotes/"
const LIKES_URL = "http://localhost:3000/likes/"
const quoteList = document.getElementById("quote-list")
const form = document.getElementById("new-quote-form")

/// ---- render quotes
fetchQuotes = () => {
  fetch(BASE_URL)
    .then(data => data.json())
    .then(quotesArray => renderQuoteLine(quotesArray));
}

renderQuoteLine = (quotesArray) => {
  quoteList.innerHTML = "";
  quotesArray.forEach(quote => quoteLine(quote));
}

quoteLine = (quote) => {
  const li = document.createElement("li");
  li.dataset.id = quote.id;
  li.className = "quote-card"
  quoteList.append(li);

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";
  li.append(blockquote);

  const p = document.createElement("p");
  p.className = "mb=0";
  p.innerText = quote.quote

  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.innerText = quote.author;

  const br = document.createElement("br");

  const likeButton = document.createElement("button");
  likeButton.className = 'btn-success';
  likeButton.id = "a";
  likeButton.innerText = "Likes: ";
  // --- like a quote

  likeQuote = (e) => {
    e.preventDefault();
    const target = e.target;
    const like = {
      quoteId: quote.id,
      createdAt: Date.now()
    };

    postLikeQuoteToTheServer(like)
      .then(likeData => likeData.json())
      .then(init)
  
  }
  likeButton.addEventListener('click', likeQuote)

  const span = document.createElement("span");
  span.innerText = quote.likes.length
  likeButton.append(span)

  const deleteButton = document.createElement("button");
  deleteButton.className = 'btn-danger';
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener('click', e => {
    const parent = e.target.parentNode;
    const grandParent = parent.parentNode; 
    deleteQuote(grandParent.dataset.id).then(() => grandParent.remove());   
  })

  blockquote.append(p, footer, br, likeButton, deleteButton);

  return li
}


/// --- create new quote

createQuote = (e) => {
  e.preventDefault();
  const target = e.target;
  const quote = {
    quote: target[0].value,
    author: target[1].value,
    likes: []
  };

  postQuoteToTheServer(quote)
    .then(quoteData => quoteData.json())
    .then(quote => {
      quoteLine(quote)
    });
  target.reset()
  
}

form.addEventListener("submit", createQuote)


///// --- server conections

postQuoteToTheServer = (quote) => {
  return fetch(QUOTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
}
deleteQuote = (id) => {
  return fetch(QUOTES_URL+`${id}`, {
    method: "DELETE"
  })
}

postLikeQuoteToTheServer = like => {
  return fetch(LIKES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(like)
  })
}

//// --- initialize function

init = () => {
  fetchQuotes()
}

init();
