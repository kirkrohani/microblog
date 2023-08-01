const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const LISTENER_PORT = 4001;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const id = crypto.randomBytes(4).toString("hex");
  const { comment } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({id, comment});
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id,
      comment,
      postId: req.params.id
    }
  })
  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log('Event Received by Comments: ', req.body);
  res.send({});
});

app.listen(LISTENER_PORT, () => {
  console.log('COMMENTS SERVICE: listening on port 4001');
})