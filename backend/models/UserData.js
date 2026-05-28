const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: false },
  person: {
    fullName: {
      type: String,
      required: true,
    },
    displayPicture: {
      type: String,
      default: null,
    },
  },
  student: {
    enrollmentNumber: { type: String, required: true },
    "branch name": { type: String },
    currentYear: { type: Number, required: true },
    currentSemester: { type: Number, required: true },
  },
  contactInformation:{
    emailAddress:{type: String, required: true},
    emailAddressVerified:{type:Boolean, required: true}
  }
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
