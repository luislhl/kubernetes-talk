const express = require('express');

const app = express();

// v1
// app.use((req, res) => {
//   res.send('Olá, Paretos!');
// })

// v2
let counter = 0;

app.use('/health', (req, res) => {
  if (++counter > 5) {
    throw new Error('Unhealthy!');
  };

  res.send('Healthy!');
})

app.use('/', (req, res) => {
  res.send(JSON.stringify(process.env));
});

app.listen(3000, () => {
  console.log('Running on port 3000!');
});
