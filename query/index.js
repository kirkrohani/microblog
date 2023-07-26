const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postsAndComments = {};

app.get('/postss', (req, res) => {
});


app.post("/events", (req, res) => {
  console.log('Event Received by Query: ', req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log('App - Query: listening on port 4002');
})