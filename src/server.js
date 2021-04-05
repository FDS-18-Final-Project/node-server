const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FormData = require('./model/formData');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_API_KEY);

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));
app.use(express.json());

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

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let msg =
          'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.post('/get-a-quote', async (req, res) => {
  try {
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
    const msg = {
      to: req.body.email,
      from: 'jaelee9212@gmail.com', // Use the email address or domain you verified above
      subject: 'MM Auto Care - Confirmation',
      text: req.body.message,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    };
    await newFormData.save();
    console.log(msg);
    await sgMail.send(msg);
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
