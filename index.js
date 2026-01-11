const express = require('express');

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  res.send('Hello from docker container!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});