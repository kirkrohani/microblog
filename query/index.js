const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postsWithComments = {};

app.get('/posts', (req, res) => {
  res.send(postsWithComments);
});


app.post("/events", (req, res) => {
  console.log('Event Received by Query: ', req.body.type);
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    postsWithComments[id] = {
      id,
      title,
      comments: []
    };
   }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const post = postsWithComments[postId];
    post.comments.push({ id, content });
  }
  res.send({});
});

app.listen(4002, () => {
  console.log('App - Query: listening on port 4002');

})