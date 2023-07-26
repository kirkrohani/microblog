const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = {};



app.post('/events', (req, res) => {
  const event = req.body;

  axios.post("http://localhost:4000/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4000/events');
  });
  
  axios.post("http://localhost:4001/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4001/events');
  });
  
  axios.post("http://localhost:4002/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4002/events');
  });

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log('App - Event Bus: listening on port 4005');
})