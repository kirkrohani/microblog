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
  comments.push({
    id,
    comment,
    status: "pending"
  });
  commentsByPostId[req.params.id] = comments;

  //Send newly created comment to EVENT BUS
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id,
      comment,
      postId: req.params.id,
      status: "pending"
    }
  })
  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log('Event Received by <- Comments Service: ', req.body);
  const { type, data } = req.body;
  const { id, postId, status } = data;

  if (type === "CommentModerated") {
    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => comment.id === id);
    comment.status = status;
  

    console.log('Comments Service -> sending out Comment Updated Event');
    //Send newly updated comment to EVENT BUS
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        comment: comment.comment,
        postId: postId,
        status: status
      }
    })
      .catch((error) => {
        console.log('ERROR posting updated comment to Events Service: ', error);
      });
  }


  res.send({});
});

app.listen(LISTENER_PORT, () => {
  console.log('COMMENTS SERVICE: listening on port 4001');
})