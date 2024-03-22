const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

function decodeUnicode(str) {
  return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
}

function selectQuery(dbPath, outputDir) {
  const db = new sqlite3.Database(dbPath);

  db.all('SELECT n.flds, c.ord FROM cards c JOIN notes n ON c.nid = n.id', (e, rows) => {
    if (e) {
      console.error(e.message);
      return;
    }

    const cardsData = rows.map(row => {
      const [front, back] = row['flds'].split('\x1f');
      return {
        front: decodeUnicode(front),
        back: decodeUnicode(back),
        order: row['ord']
      };
    });

    fs.writeFile(`${outputDir}.json`, JSON.stringify(cardsData, null, 4), 'utf8', (e) => {
      if (e) {
        console.log(`Não foi possível salvar os cards no arquivo .json: ${e}`);
        return;
      }

      console.log("Cards salvos com sucesso no arquivo .json!");
    });

    db.close((e) => {
      if (e) {
        console.log(`Erro ao fechar o banco de dados: ${e.message}`);
      }
      console.log("Conexão com o banco de dados encerrada com sucesso!");
    });
  });
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Uso: node converterCollectionIntoJson.js '<collection.anki2> ou <collection.anki21>'");
  process.exit(1);
}

const filePath = args[0];

const fileNameWithoutExtension = path.basename(path.dirname(filePath));
const outputDir = fileNameWithoutExtension;

selectQuery(filePath, `./jsons/${outputDir}`);