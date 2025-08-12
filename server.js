const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.sqlite');

// garante pasta data
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// abre / cria banco sqlite
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('Erro DB:', err);
  console.log('SQLite aberto em', DB_PATH);
});

// cria tabela users se não existir
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );`
  );
});

app.use(express.urlencoded({ extended: true })); // para forms
app.use(express.json());

// serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// rota de cadastro (espera form com name, email, password)
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/cadastro.html?erro=campos_vazios');
  }
  // verifica se já existe
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.redirect('/cadastro.html?erro=erro_servidor');
    if (row) return res.redirect('/cadastro.html?erro=email_duplicado');

    // cria hash e insere
    const hash = bcrypt.hashSync(password, 10);
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name || '', email, hash],
      function (err2) {
        if (err2) {
          console.error(err2);
          return res.redirect('/cadastro.html?erro=erro_servidor');
        }
        // cadastro ok -> vai para login
        return res.redirect('/login.html?sucesso=cadastrado');
      }
    );
  });
});

// rota de login (espera form com email, password)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/login.html?erro=campos_vazios');
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.redirect('/login.html?erro=erro_servidor');
    }
    if (!user) return res.redirect('/login.html?erro=usuario_nao_encontrado');

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.redirect('/login.html?erro=senha_incorreta');

    // login bem sucedido -> redireciona para área restrita
    // você pode melhorar isso colocando sessão/jwt; aqui é só demo.
    return res.redirect('/area-restrita.html');
  });
});

// rota de API útil de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
