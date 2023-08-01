const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const LISTENER_PORT = 4003;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const filterWord = 'orange';

app.post("/events", async (req, res) => {
  console.log('Event Received by ModerationService: ', req.body);
  const { type, data } = req.body;

  // Moderate comment
  if (type === "CommentCreated") {
    //Moderate Comment
    if (data.comment.toLowerCase().includes(filterWord)) {
      data.status = "rejected";
    } else {
      data.status = "approved";
    }

    //Send updated comment to Comment Service
    await axios.post("http://localhost:4005/events/comment-moderated", {
      type: "CommentModerated",
      data
    });
  }
  res.send({});
});

app.listen(LISTENER_PORT, () => {
  console.log('MODERATION SERVICE: listening on port 4003');

})