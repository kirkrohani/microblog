const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const LISTENER_PORT = 4002;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postsWithComments = {};

app.get('/posts', (req, res) => {
  res.send(postsWithComments);
});


app.post("/events", (req, res) => {
  console.log('Event Received by Query Service: ', req.body.type);
  const { type, data } = req.body;

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
  res.send({});
});

app.listen(LISTENER_PORT, () => {
  console.log('QUERY SERVICE: listening on port 4002');

})