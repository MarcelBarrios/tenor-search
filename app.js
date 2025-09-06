// Require Libraries
const express = require('express');

// App Setup
const app = express();

// Middleware
// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

const Tenor = require("tenorjs").client({
    // Replace with your own key
    "Key": "AIzaSyCRWniVkeQMPyX_9-G4y9Nb7p8ZKoERPwk", // https://tenor.com/developer/keyregistration
    "Filter": "high", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

// Routes
app.get('/', (req, res) => {
    // Check if there is a search query
    if (req.query.term) {
        // If there is, search the Tenor API
        Tenor.Search.Query(req.query.term, "10")
            .then(response => {
                // Render the home template with the GIFs
                res.render('home', { gifs: response });
            }).catch(console.error);
    } else {
        // If there is no search query, render the page without GIFs
        res.render('home', { gifs: [] });
    }
});
// example URL "http://localhost:3000/?term=hey"
// app.get('/', (req, res) => {
//     console.log(req.query) // => "{ term: hey" }[/bold]
//     res.render('home')
// })
// app.get('/', (req, res) => {
//     // set the url of the gif
//     const gifUrl = 'https://media1.tenor.com/images/561c988433b8d71d378c9ccb4b719b6c/tenor.gif?itemid=10058245'
//     // render the hello-gif view, passing the gifUrl into the view to be displayed
//     res.render('hello-gif', { gifUrl })
// })

app.get('/greetings/:name', (req, res) => {
    // grab the name from the path provided
    const name = req.params.name;
    // render the greetings view, passing along the name
    res.render('greetings', { name });
})

// Start Server

app.listen(3000, () => {
    console.log('Gif Search listening on port localhost:3000!');
});