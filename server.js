const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serves your HTML

// POST endpoint to save responses
app.post('/submit', (req, res) => {
  const { exercise, answer } = req.body;
  if (!exercise || !answer) return res.status(400).json({ error: 'Missing data' });

  // If file doesn't exist, add headers
  if (!fs.existsSync('responses.csv')) {
    fs.writeFileSync('responses.csv', `"exercise","answer"\n`);
  }

  const line = `"${exercise.replace(/"/g, '""')}","${answer}"\n`;
  fs.appendFile('responses.csv', line, err => {
    if (err) return res.status(500).json({ error: 'Failed to save' });
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));