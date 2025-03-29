const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

app.get('/api/tmdb/*', async (req, res) => {
  try {
    const endpoint = req.params[0]; // Captura tudo após /api/tmdb/
    const queryParams = new URLSearchParams(req.query);
    
    queryParams.append('api_key', process.env.TMDB_API_KEY);
    
    if (!queryParams.has('language')) {
      queryParams.append('language', 'pt-BR');
    }
    
    const apiUrl = `https://api.themoviedb.org/3/${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Erro ao acessar a API:', error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/shows.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shows.html'));
});

app.get('/movie-details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'movie-details.html'));
});

app.get('/tv-details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tv-details.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
