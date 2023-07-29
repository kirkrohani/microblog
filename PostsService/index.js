const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const LISTENER_PORT = 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = crypto.randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id, title
  }

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title
    }
  })

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log('Event Received by Posts: ', req.body.type);
  res.send({});
});

app.listen(LISTENER_PORT, () => {
  console.log('POSTS SERVICE: listening on port 4000');
})