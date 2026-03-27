const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Render sets PORT automatically
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

const csvFile = "results.csv";

// Create CSV if missing
if (!fs.existsSync(csvFile)) {
    fs.writeFileSync(csvFile, "Exercise,Answer\n");
}

// Save POST submissions
app.post("/save", (req, res) => {
    const { exercise, answer } = req.body;

    // Map answers
    let mappedAnswer = "";
    if (answer === "I can do it") mappedAnswer = "possible";
    else if (answer === "I can't do it") mappedAnswer = "impossible";
    else mappedAnswer = answer;

    const row = `"${exercise}","${mappedAnswer}"\n`;

    fs.appendFile(csvFile, row, err => {
        if (err) {
            res.status(500).send("Error saving result");
        } else {
            res.send("Saved");
        }
    });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});