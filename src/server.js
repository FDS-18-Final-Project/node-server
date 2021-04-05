const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FormData = require('./model/formData');

dotenv.config();
const app = express();
const PORT = process.env.PORT;
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

// db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch(err => {
    console.log(err);
  });

app.use(cors());

app.post('/get-a-quote', async (req, res) => {
  try {
    console.log(req.body);
    const newFormData = new FormData({
      fullname: req.body.fullname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      makeAndModel: req.body.makeAndModel,
      year: req.body.year,
      postalCode: req.body.postalCode,
      services: req.body.services,
      message: req.body.message
    });

    await newFormData.save();
    res.json({ newFormData });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is started on ${PORT}`);
});
