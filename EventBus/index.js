const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const LISTENER_PORT = 4005;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = {};



app.post('/events', (req, res) => {
  const event = req.body;
  console.log('Event received by EVENT BUS - ', event);

  //Send event to POSTS SERVICE
  axios.post("http://localhost:4000/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4000/events');
  });
  
  //Send event to COMMENTS SERVICE
  axios.post("http://localhost:4001/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4001/events');
  });
  
  //Send event to QUERY SERVICE
  axios.post("http://localhost:4002/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4002/events');
  });

  //Send event to MODERATION SERVICE
  axios.post("http://localhost:4003/events", event).catch((error) =>
  {
    console.log('Error posting to localhost:4002/events');
  });

  res.send({ status: "OK" });
});

app.post('/events/comment-moderated', (req, res) => {
  const comment = req.body;
  console.log('Event received by EVENT BUS - ', comment);

  //Send event to COMMENTS SERVICE
  axios.post("http://localhost:4001/events", comment).catch((error) =>
  {
    console.log('Error posting to localhost:4001/events');
  });
});

app.listen(LISTENER_PORT, () => {
  console.log('EVENT BUS: listening on port 4005');
})