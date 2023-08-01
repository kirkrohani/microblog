const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const LISTENER_PORT = 4003;

const app = express();
app.use(bodyParser.json());
app.use(cors());



app.post("/events", (req, res) => {
  console.log('Event Received by ModerationService: ', req.body.type);
  const { type, data } = req.body;

  // Add COMMENT to data structure
  if (type === "CommentCreated") {
    //Moderate Comment
  }
  res.send({});
});

app.listen(LISTENER_PORT, () => {
  console.log('MODERATION SERVICE: listening on port 4003');

})