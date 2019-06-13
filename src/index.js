// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
FETCH_URL="http://localhost:3000/quotes?_embed=likes";
BASEQUOTE_URL="http://localhost:3000/quotes"
BASELIKE_URL="http://localhost:3000/likes"
const QUOTE_NODE=document.getElementById('list-quotes');
const QUOTE_UL=document.createElement('UL');
QUOTE_NODE.appendChild(QUOTE_UL);

const NEWQUOTE_NODE=document.querySelector('#new-quote-form');
NEWQUOTE_NODE.addEventListener('submit', clickSubmit )
searchParam=document.querySelector('#order-quotes').addEventListener('click', toggleQuotes )

// 1) Get all the quotes
function getQuotes() {
    QUOTE_UL.innerHTML="";

    fetch( FETCH_URL )
        .then( data => data.json() )
        .then( renderQuotes )
        .catch( console.log );

}

function toggleQuotes() {

    let searchParam=document.querySelector('#order-quotes').innerText

    if (searchParam==="My favorite quotes: in no particular order") {
        document.querySelector('#order-quotes').innerText="My favorite quotes: ordered by author";
    } else if (searchParam==="My favorite quotes: ordered by author") {
        document.querySelector('#order-quotes').innerText="My favorite quotes: ordered by quote";
    } else {
        document.querySelector('#order-quotes').innerText="My favorite quotes: in no particular order";
    }

    getQuotes()

}

function renderQuotes( quotesObj ) {
// Now sort out the order by,
    let searchParam=document.querySelector('#order-quotes').innerText

    if (searchParam==="My favorite quotes: in no particular order") {
        quotesObj.forEach( function(quote) {
            renderQuote(quote)
        });
    } else if (searchParam==="My favorite quotes: ordered by author") {
        quotesObj.sort((a,b) => ( a.author > b.author ? 1 : -1)).forEach( function(quote) {
            renderQuote(quote)
        });
    } else {
        quotesObj.sort((a,b) => ( a.quote > b.quote ? 1 : -1)).forEach( function(quote) {
            renderQuote(quote)
        });
    }

}

// and render them, with the number of likes and a like button
// using the template
// <li class='quote-card'>
// <blockquote class="blockquote">
// <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
// <footer class="blockquote-footer">Someone famous</footer>
// <br>
// <button class='btn-success'>Likes: <span>0</span></button>
// <button class='btn-danger'>Delete</button>
// </blockquote>
// </li>
function renderQuote( quoteObj ) {

    let quoteNode=document.createElement('LI')
    quoteNode.innerHTML = 
            `<blockquote class="blockquote">
            <p class="mb-0">${quoteObj.quote}</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
            <button class='btn-primary'>Edit</button>
            </blockquote>`
    QUOTE_UL.appendChild(quoteNode);
    quoteNode.querySelector('.btn-danger').addEventListener('click', () => deleteQuote(quoteObj, quoteNode));
    quoteNode.querySelector('.btn-success').addEventListener('click', () => likeQuote(quoteObj, quoteNode));
    quoteNode.querySelector('.btn-primary').addEventListener('click', () => editQuote(quoteObj, quoteNode));

}

// 2) Make the delete button delete the quote
function deleteQuote( quoteObj, quoteNode ) {

    fetch( `${BASEQUOTE_URL}/${quoteObj.id}`, { method:"DELETE" } )
    .then( () => quoteNode.remove() )
    .catch( console.log )

}

function clickSubmit( event ) {
    event.preventDefault();
    if (event.target[2].innerText==="Submit") {
        createQuote( event );
    } else {
        updateQuote( event );
    }

}
// 3) Make the submit form work, adding the quote, but not refreshing the page
function createQuote( event ) {
    event.preventDefault();
    let quoteObj = {
        quote: event.target[0].value,
        author: event.target[1].value,
        likes: []
    }

    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             "Accept": "application/json"
        },
            body: JSON.stringify( quoteObj )
        }

    fetch(BASEQUOTE_URL, configObj )
    .then( data => data.json())
    .then( renderQuote )
    .catch( console.log )

    event.target.reset()
}

// 4) Add the like functionality
function likeQuote( quoteObj, quoteNode ){

    let likeObj = { quoteId: quoteObj.id,
                    createdAt: Date.now() }; // 5) Then add the bonus using the time when creating the like


    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             "Accept": "application/json"
        },
            body: JSON.stringify( likeObj )
        }
    quoteNode.querySelector('span').innerText=parseInt(quoteNode.querySelector('span').innerText)+1

    fetch( BASELIKE_URL, configObj )
      .then( data => data.json())
      .catch( console.log )

}
// 5) extend learning ... add an edit
function editQuote(quoteObj, quoteNode) {

    NEWQUOTE_NODE[0].value=quoteObj.quote;
    NEWQUOTE_NODE[1].value=quoteObj.author;
    NEWQUOTE_NODE[2].innerText='Update';
    NEWQUOTE_NODE[3].value=quoteObj.id // The hidden quote id
    NEWQUOTE_NODE[0].focus()
}

function updateQuote( event ) {
    event.preventDefault();

    let quoteObj = {
        quote: NEWQUOTE_NODE[0].value,
        author: NEWQUOTE_NODE[1].value,
        id: NEWQUOTE_NODE[3].value    
    };

    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
             "Accept": "application/json"
        },
            body: JSON.stringify( quoteObj )
        }
  
    fetch( `${BASEQUOTE_URL}/${quoteObj.id}`, configObj )
        .then( () => getQuotes() )
        .catch( console.log )

    NEWQUOTE_NODE[2].innerText='Submit';
    event.target.reset();

}

document.body.onload = getQuotes()