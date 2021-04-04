import { Schema, model } from 'mongoose';

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

export default FormData;
