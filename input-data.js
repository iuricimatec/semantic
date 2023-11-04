const sqlite3 = require('sqlite3');
// const gensim = require('gensim');
const fs = require('fs');
const readline = require('readline'); // Add this line


const db = new sqlite3.Database('data.db');

function createWord2VecTable() {
  db.serialize(function () {
    db.run('PRAGMA journal_mode=WAL');
    db.run('CREATE TABLE IF NOT EXISTS embedding (word TEXT PRIMARY KEY, vector BLOB)');
    db.run(`CREATE TABLE IF NOT EXISTS tests (id INTEGER NOT NULL, data DATETIME NOT NULL, tempo TIME NOT NULL, palavra_sonda TEXT NOT NULL, palavra_respondida TEXT, similaridade FLOAT NOT NULL )`);
  });
}
function uploadEmbedding() {
  console.log('Running function uploadEmbeding');
  db.serialize(function () {
    console.log('SERIALIZE')
    db.run('PRAGMA journal_mode=WAL');
    db.run('DELETE FROM embedding');

    const fileStream = readline.createInterface({
      input: fs.createReadStream('model.txt', { encoding: 'utf-8' }),
      crlfDelay: Infinity,
    });

    let n = 0;

    fileStream.on('line', (line) => {
      const words = line.trim().split(' ');
      const word = words[0];
      const vector = words.slice(1).map(Number);
      console.log('word ', word)
      db.run('INSERT INTO embedding VALUES (?, ?)', [word, Buffer.from(JSON.stringify(vector))]);

      n += 1;
      if (n % 100000 === 0) {
        console.log(`Processed ${n} (+1) lines`);
      }
    });

    fileStream.on('close', () => {
      db.run('COMMIT');
      db.close();
    });
  });
}

function main() {
  createWord2VecTable();
  uploadEmbedding();
}

main();
