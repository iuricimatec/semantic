const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');

const db = new sqlite3.Database('data.db');
const dbGet = util.promisify(db.get.bind(db));

var selectedWords = require('./modules/selectedWords.js');

app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // Function to shuffle the array (Fisher-Yates shuffle algorithm)
  // it shuffles array selectedWords using the Fisher-Yates shuffle algorithm, and then accesses an element from the shuffled array. 
  // Remember that JavaScript arrays are 0-based, so if you want to access the first element, you use perm[i - 1].
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  selectedWords = shuffleArray(selectedWords);
  res.render('index', { selectedWords });
});

app.use('/assets', express.static(path.join(__dirname, 'static', 'assets')));

app.get('/model/:word', (req, res) => {
  const word = req.params.word;

  db.get('SELECT vector FROM embedding WHERE word = ?', [word], (err, row) => {
    if (err) {
      console.error(err);
      return res.json('Error');
    }
    if (!row) {
      return res.json([]);
    }

    const data = JSON.parse(row.vector); // Deserialize data using JSON.parse
    res.json(data);
  });
});


app.get('/model2/:word_1/:word_2', async (req, res) => {
  const word1 = req.params.word_1.toLocaleLowerCase();
  const word2 = req.params.word_2.toLocaleLowerCase();

  // console.log('Running Function model2');
  // console.log('w1:', word1, 'w2:', word2);

  try {
    const row1 = await dbGet('SELECT vector FROM embedding WHERE word = ?', [word1]);
    const row2 = await dbGet('SELECT vector FROM embedding WHERE word = ?', [word2]);

    const row = [row1, row2].filter((row) => row !== undefined);

    if (row.length === 2) {
      // Deserialize the Buffer assuming it's stored as JSON
      const vec1 = JSON.parse(row[0].vector.toString());
      const vec2 = JSON.parse(row[1].vector.toString());

      // console.log('w1:', word1, 'w2:', word2);
      // console.log('v1:', vec1);
      // console.log('v2:', vec2);

      const result = {
        vec_1: vec1,
        vec_2: vec2,
      };

      return res.json(result);
    } else {
      return res.json({});
    }
  } catch (err) {
    console.error(err);
    return res.json('Error');
  }
});


app.post('/save_test', (req, res) => {
  const { id, data, tempo, palavra_sonda, palavra_respondida, similaridade } = req.body;

  db.run(
    'INSERT INTO tests (id, data, tempo, palavra_sonda, palavra_respondida, similaridade) VALUES (?, ?, ?, ?, ?, ?)',
    [id, data, tempo, palavra_sonda, palavra_respondida, similaridade],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json('500');
      } else {
        res.json('200');
      }
    }
  );
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(3002, () => {
  // console.log('Server is running on port');
});
