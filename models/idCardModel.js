import mongoose from "mongoose";

const idCardSchema = new mongoose.Schema(
  {
    identificationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    issueDate: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    bgColor: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const IdCard = mongoose.models.IdCard || mongoose.model("IdCard", idCardSchema);
IdCard.createIndexes();

export default IdCard;
