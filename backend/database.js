const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./contacts.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabela 'contatos'
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT UNIQUE,
      foto BLOB,
      data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      salario_real REAL,
      salario_dolar REAL,
      salario_euro REAL
    )
  `);
});

module.exports = db;