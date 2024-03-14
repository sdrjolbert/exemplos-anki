const sqlite3 = require('sqlite3').verbose();

function showTables(path) {
  const db = new sqlite3.Database(path);

  db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (e, tables) => {
      if (e) {
        console.error(`Erro ao listar tabelas: ${e}`);
        return;
      }

      console.log("Tabelas disponíveis no banco de dados:\n");

      tables.forEach(table => {
        console.log(`${table.name}`);
      });
    });
  });

  db.close((err) => {
    if (err) {
      console.error(`Erro ao fechar o banco de dados: ${err}`);
    }
    console.log("\nConexão com o banco de dados fechada com sucesso!");
  });
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Uso: node converterAnki2IntoDB.js '<caminho_do_arquivo.anki2>'");
  process.exit(1);
}

const filePath = args[0];

showTables(filePath);