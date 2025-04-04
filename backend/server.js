const express = require('express');
const cors = require('cors');
const db = require('./database');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const HG_BRASIL_API_KEY = 'aeca23c0'; // Substitua pela sua chave da HG Brasil

// Função para converter moedas
async function convertCurrency(valorReal) {
  try {
    const response = await axios.get(
      `https://api.hgbrasil.com/finance?key=${HG_BRASIL_API_KEY}`
    );
    const { USD, EUR } = response.data.results.currencies;
    return {
      dolar: valorReal / USD.buy,
      euro: valorReal / EUR.buy,
    };
  } catch (error) {
    console.error('Erro ao converter moeda:', error);
    return { dolar: 0, euro: 0 };
  }
}

// CREATE
app.post('/contatos', async (req, res) => {
  const { nome, telefone, email, foto, salario_real } = req.body;
  const { dolar, euro } = await convertCurrency(salario_real);

  const stmt = db.prepare(`
    INSERT INTO contatos (nome, telefone, email, foto, salario_real, salario_dolar, salario_euro)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(nome, telefone, email, foto, salario_real, dolar, euro, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Contato criado com sucesso!' });
  });
  stmt.finalize();
});

// READ (Todos)
app.get('/contatos', (req, res) => {
  db.all('SELECT * FROM contatos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// READ (Por ID)
app.get('/contatos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM contatos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// UPDATE
app.put('/contatos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email, foto, salario_real } = req.body;
  const { dolar, euro } = await convertCurrency(salario_real);

  const stmt = db.prepare(`
    UPDATE contatos SET nome = ?, telefone = ?, email = ?, foto = ?, salario_real = ?, salario_dolar = ?, salario_euro = ?
    WHERE id = ?
  `);
  stmt.run(nome, telefone, email, foto, salario_real, dolar, euro, id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Contato atualizado com sucesso!' });
  });
  stmt.finalize();
});

// DELETE
app.delete('/contatos/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM contatos WHERE id = ?');
  stmt.run(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Contato deletado com sucesso!' });
  });
  stmt.finalize();
});

app.listen(5000, () => console.log('Servidor rodando na porta 5000'));