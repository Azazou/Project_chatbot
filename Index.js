const express = require('express');
const app = express();
const axios = require('axios');
const nltk = require('nltk');
const { word_tokenize, pos_tag } = require('nltk');
const WIKIPEDIA_API_URL = 'https://fr.wikipedia.org/w/api.php';

// Téléchargement des données nécessaires à NLTK pour le POS tagging
async function downloadNltkData() {
  console.log("Téléchargement des données NLTK...");
  try {
    await nltk.download('punkt');
  } catch (err) {
    console.error(err);
  }
}

// POS tagging d'un message avec NLTK
function posTagMessage(message) {
  const tokens = word_tokenize(message);
  const tagged = pos_tag(tokens);
  return tagged.map(([word, tag]) => `${word}_${tag}`);
}

app.get('/chatbot', async (req, res) => {
  const message = req.query.message;

  // Téléchargement des données NLTK (si nécessaire) et POS tagging du message
  await downloadNltkData();
  const taggedMessage = posTagMessage(message);

  // try
  try {
    require.resolve('nltk');
  } catch (e) {
    console.error('Le module NLTK n\'est pas correctement installé ou accessible');
    process.exit(1);
  }
  
  // Recherche sur Wikipédia des articles correspondant au POS tagging du message
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: taggedMessage.join(' '),
        format: 'json',
        origin: '*',
      },
    });

    const articles = response.data.query.search.map((article) => article.title);
    res.send(`Voici les résultats pour "${message}" sur Wikipédia : ${articles.join(', ')}`);
  } catch (error) {
    console.error(error);
    res.send('Une erreur s\'est produite');
  }
});

app.listen(3000, () => {
  console.log('Le serveur est en écoute sur le port 3000...');
});
