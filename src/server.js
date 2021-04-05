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
app.use(cors());

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

app.post('/get-a-quote', cors(), async (req, res) => {
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
