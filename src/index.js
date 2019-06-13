// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 


document.addEventListener("DOMContentLoaded", init);
const quotesUrl = "http://localhost:3000/quotes?_embed=likes"
const quotesList = document.querySelector("#quote-list");
const onlyQuotesUrl = "http://localhost:3000/quotes/"
const onlyLikesUrl = "http://localhost:3000/likes/"
const form = document.querySelector("#new-quote-form")



function fetchQuotes() {
    return fetch(quotesUrl)
        .then(response => response.json())
        .then(quotesObject => {
            // console.log(Object.keys(quotesObject).length)
            renderQuotes(quotesObject)
        })
}

function renderQuotes(quotesObject) {
    quotesList.innerHTML = ""
    quotesObject.forEach(quote => {
        renderQuote(quote)
    })
}

function renderQuote(quote) {
    const quoteLi = document.createElement("li");
    quoteLi.className = 'quote-card';
    
    const blockQuote = document.createElement("blockquote");
    blockQuote.className = 'blockquote'
    blockQuote.innerHTML = `
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author} </footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
        <button class='btn-danger'>Delete</button>
    `
    quoteLi.append(blockQuote)
    quotesList.append(quoteLi)

    const likeBtn = blockQuote.querySelector(".btn-success")
    const deleteBtn = blockQuote.querySelector(".btn-danger")
    const spanLikes = blockQuote.querySelector("span")


    likeBtn.addEventListener('click', (e) => {
        e.preventDefault()
        let like = {
            quoteId: parseInt(quote.id)
        }
        createLike(like)
            .then(() => spanLikes.innerText = `${quote.likes ? quote.likes.length : 0}`)
    })
    
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault()
        quoteLi.remove()
        deleteQuote(quote.id)
    })
}

function createLike(like) {
    return fetch(onlyLikesUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(like)
    }).then(fetchQuotes)
}

function deleteQuote(quoteId) {
    return fetch(onlyQuotesUrl + quoteId, {
        method: "DELETE"
    })
}

function createQuoteEventListener() {
    quoteText = document.querySelector("#new-quote")
    quoteAuthor = document.querySelector("#author")
    // console.log("hello")
    form.addEventListener('submit', event => {
        event.preventDefault()
        // console.log("submit")
        let newQuote = {
            quote: quoteText.value,
            author: quoteAuthor.value
        }
    
        createQuote(newQuote)
            .then(newQuote => renderQuote(newQuote)).then(console.log)
        
        form.reset()
    })
}

function createQuote(newQuote) {
    console.log(newQuote)
    return fetch(onlyQuotesUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuote)
    }).then(response => response.json())
}


function init() {
    fetchQuotes()
    createQuoteEventListener()
}

