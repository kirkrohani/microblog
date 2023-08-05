const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const LISTENER_PORT = 4002;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postsWithComments = {};

const handleEvent = (type, data) => {
  // Add POST to data structure
  if (type === "PostCreated") {
    const { id, title } = data;
    postsWithComments[id] = {
      id,
      title,
      comments: []
    };
   }

  // Add COMMENT to data structure
  if (type === "CommentCreated") {
    const { id, comment, postId, status } = data;
    const post = postsWithComments[postId];
    post.comments.push({ id, comment, status });
  }

  // Update COMMENT in data structure
  if (type === "CommentUpdated") {
    const { postId, id, status, comment } = data;
    const comments = postsWithComments[postId].comments;
    const updatedComment = comments.find(comment => comment.id === id);
    updatedComment.status = status;
    updatedComment.comment = comment;
  }

}

app.get('/posts', (req, res) => {
  res.send(postsWithComments);
});

app.post("/events", (req, res) => {
  console.log('Event Received by <- Query Service: ', req.body.type);
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(LISTENER_PORT, async () => {
  console.log('QUERY SERVICE: listening on port 4002');

  //When the Query Service starts
  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log('initial processing of event: ', event.type);
    handleEvent(event.type, event.data);
  }

})