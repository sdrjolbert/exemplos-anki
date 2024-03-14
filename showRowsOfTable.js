const sqlite3 = require('sqlite3').verbose();

function selectQuery(path, table) {
  const db = new sqlite3.Database(path);

  db.serialize(() => {
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) {
        console.log(`Erro ao realizar o select no banco de dados: ${err}`);
        return;
      }
      if (rows.length === 0) {
        console.log("Nenhuma linha encontrada nessa tabela!");
      } else {
        console.log(`Linhas da tabela ${table}:\n`);
        rows.forEach(row => {
          console.log(row);
        });
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.log(`Erro ao fechar o banco de dados: ${err.message}`);
    }
    console.log("Conexão com o banco de dados encerrada com sucesso!");
  });
}


const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Uso: node selectFromDatabase.js '<collection.anki2> ou <collection.anki21>' <nome_da_tabela_do_db>");
  process.exit(1);
}

const filePath = args[0];
const table = args[1];

selectQuery(filePath, table);