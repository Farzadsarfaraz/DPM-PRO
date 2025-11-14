const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage });
async function correctGrammarWithLanguageTool(text) {
  try {
    const response = await axios.post(
      'https://api.languagetool.org/v2/check',
      new URLSearchParams({
        text: text,
        language: 'en-US'
      })
    );
    let correctedText = text;
    response.data.matches
      .sort((a, b) => b.offset - a.offset)
      .forEach(match => {
        if (match.replacements && match.replacements.length > 0) {
          correctedText =
            correctedText.substring(0, match.offset) +
            match.replacements[0].value +
            correctedText.substring(match.offset + match.length);
        }
      });
    return correctedText;
  } catch (err) {
    console.error('LanguageTool error:', err.message);
    return text;
  }
}
app.post('/upload', upload.single('audio'), async (req, res) => {
  const { email, transcript } = req.body;

  if (!email || !transcript) {
    return res.status(400).json({ message: 'Missing email or transcript' });
  }

  console.log(`Received from ${email}: ${transcript}`);

  const correctedText = await correctGrammarWithLanguageTool(transcript);

  res.json({ correctedText });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
