const { Schema, model } = require('mongoose');

const formDataSchema = new Schema(
  {
    fullname: String,
    email: String,
    phoneNumber: String,
    makeAndModel: String,
    year: String,
    postalCode: String,
    services: [String],
    message: String
  },
  {
    timestamps: true
  }
);

const FormData = model('formData', formDataSchema);

module.exports = FormData;
