const express = require('express');
const app = express();
const axios = require('axios');
const nltk = require('nltk');
const { word_tokenize, pos_tag } = require('nltk');
const runSample = require('./chatbot-helper.js')

const { PROJECT_ID, OPENWEATHERMAP_APIKEY, MOVIEDB_APIKEY } = process.env;

// const WIKIPEDIA_API_URL = 'https://fr.wikipedia.org/w/api.php';

// // Téléchargement des données nécessaires à NLTK pour le POS tagging
// async function downloadNltkData() {
//   console.log("Téléchargement des données NLTK...");
//   try {
//     await nltk.download('punkt');
//   } catch (err) {
//     console.error(err);
//   }
// }

// // POS tagging d'un message avec NLTK
// function posTagMessage(message) {
//   const tokens = word_tokenize(message);
//   const tagged = pos_tag(tokens);
//   return tagged.map(([word, tag]) => `${word}_${tag}`);
// }

// app.get('/chatbot', async (req, res) => {
//   const message = req.query.message;

//   // Téléchargement des données NLTK (si nécessaire) et POS tagging du message
//   await downloadNltkData();
//   const taggedMessage = posTagMessage(message);

//   // try
//   try {
//     require.resolve('nltk');
//   } catch (e) {
//     console.error('Le module NLTK n\'est pas correctement installé ou accessible');
//     process.exit(1);
//   }
  
//   // Recherche sur Wikipédia des articles correspondant au POS tagging du message
//   try {
//     const response = await axios.get(WIKIPEDIA_API_URL, {
//       params: {
//         action: 'query',
//         list: 'search',
//         srsearch: taggedMessage.join(' '),
//         format: 'json',
//         origin: '*',
//       },
//     });

//     const articles = response.data.query.search.map((article) => article.title);
//     res.send(`Voici les résultats pour "${message}" sur Wikipédia : ${articles.join(', ')}`);
//   } catch (error) {
//     console.error(error);
//     res.send('Une erreur s\'est produite');
//   }
// });

app.get('/', (req, res) => {

    runSample.runSample(PROJECT_ID, req.query.message)
        .then((data) => {
            res.send(data); // .fulfillmentText
        })
        .catch((err) => console.log(err));
});

app.get('/meteo', (req, res) => {

    runSample.runSample(PROJECT_ID, req.query.message)
        .then((data) => {
            //res.send(data);
            

        })
        .catch((err) => console.log(err));
});

async function getMovies(name) {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie?api_key=757d2e8a63e45b8eec2c696cd8edca74&query=" + name)
    return response.data;
}

app.get('/movie', (req, res) => {

    runSample.runSample(PROJECT_ID, req.query.message)
        .then((data) => {
            //res.send(data);
            console.log(data.parameters.fields.name.stringValue);
            if (data.parameters.fields.name.stringValue != "") {
                axios({
                    method: 'get',
                    url: "https://api.themoviedb.org/3/search/movie?api_key=757d2e8a63e45b8eec2c696cd8edca74&query=" + data.parameters.fields.name.stringValue
                }).then(function (response) {
                    console.log(response.data);
                    res.send("Si je ne me trompe pas ce film est sortie à cette date: " + response.data.results[0].release_date);
                  });
            
                
                
            } else {
                res.send("Je n'ai pas compris, de quel film parlez-vous ?");
            }

        })
        .catch((err) => console.log(err));
});

app.listen(3000, () => {
    console.log('Le serveur est en écoute sur le port 3000...');
});
