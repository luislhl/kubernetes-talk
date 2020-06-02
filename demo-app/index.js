const express = require('express');

const app = express();

// v1
// app.use((req, res, next) => {
//   return next('Olá, Paretos!');
// })

// v2
app.use('/', (req, res, next) => {
  return next(JSON.stringify(process.env));
});

app.listen(3000, () => {
  console.log('Running on port 3000!');
});
