const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const LISTENER_PORT = 4005;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const POSTS_SERVICE_URL = "http://localhost:4000/events";
const COMMENTS_SERVICE_URL = "http://localhost:4001/events";
const QUERY_SERVICE_URL = "http://localhost:4002/events";
const MODERATION_SERVICE_URL = "http://localhost:4003/events";


const events = [];



app.post('/events', (req, res) => {
  const event = req.body;
  console.log('Event received by EVENT BUS - ', event);
  events.push(event);

  console.log('Sending Event to PostsService, CommentsService, QueryService and ModerationService');
  //Send event to POSTS SERVICE
  axios.post(POSTS_SERVICE_URL, event)
    .catch((error) =>
    {
      console.log(`Error posting to POSTS_SERVICE_URL` );
    });
  
  //Send event to COMMENTS SERVICE
  axios.post(COMMENTS_SERVICE_URL, event)
    .catch((error) =>
    {
      console.log(`Error posting to COMMENTS_SERVICE_URL`);
    });
  
  //Send event to QUERY SERVICE
  axios.post(QUERY_SERVICE_URL, event)
    .catch((error) =>
    {
      console.log(`Error posting to QUERY_SERVICE_URL`);
    });

  //Send event to MODERATION SERVICE
  axios.post(MODERATION_SERVICE_URL, event)
    .catch((error) =>
    {
      console.log(`Error posting to MODERATION_SERVICE_URL`);
    });

  res.send({ status: "OK" });
});

app.post('/events/comment-moderated', (req, res) => {
  const comment = req.body;
  console.log('Event received by EVENT BUS - ', comment);

  //Send event to COMMENTS SERVICE
  axios.post(COMMENTS_SERVICE_URL, comment)
    .catch((error) =>
    {
      console.log('Error posting to localhost:4001/events');
    });
});


app.get("/events", (req, res) => {
  res.send(events);
})


app.listen(LISTENER_PORT, () => {
  console.log('EVENT BUS: listening on port 4005');
  console.log('____________________________________________');
})