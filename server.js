const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, JS, CSS)
app.use(express.static('public'));

// Middleware to parse JSON requests from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to results CSV
const csvFilePath = path.join(__dirname, 'results.csv');

// Ensure CSV file exists
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'Exercise,Answer\n', 'utf8');
}

// Endpoint to receive form submissions
app.post('/submit', (req, res) => {
  const { exercise, answer } = req.body;

  if (!exercise || !answer) {
    return res.status(400).send('Missing exercise or answer.');
  }

  // Convert answer to Possible / Impossible
  const formattedAnswer = answer === "I can do it" ? "Possible" : "Impossible";

  // Append to CSV
  const line = `"${exercise}","${formattedAnswer}"\n`;
  fs.appendFile(csvFilePath, line, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to save.');
    }
    res.send('Saved successfully!');
  });
});

// Endpoint to download CSV
app.get('/download', (req, res) => {
  res.download(csvFilePath);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
