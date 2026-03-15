const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Simple API - Render Demo!'));

app.get('/api/todos', (req, res) => {
  res.json([
    { id: 1, text: 'Deployed on Render!', done: true },
    { id: 2, text: 'No database needed', done: false }
  ]);
});

app.listen(PORT, () => {
  console.log(`Simple API on port ${PORT}`);
});
