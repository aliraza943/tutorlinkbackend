const express = require('express');
const mongoose = require('mongoose');
const tutorsRoute = require('./routes/tutors');
const SessionRoute = require('./routes/sessions')
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/TutorNext';

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB', error));

app.use(express.json());

app.use('/tutors', tutorsRoute);
app.use('/session', SessionRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
