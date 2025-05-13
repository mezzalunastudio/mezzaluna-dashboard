import mongoose from "mongoose";

export interface RSVPDemoDocument extends mongoose.Document {
  template: string;
  sender: string;
  message: string;
  attendance: string;
  createdDate: Date;
}

const rsvpDemoSchema = new mongoose.Schema<RSVPDemoDocument>(
  {
    template:{ type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    attendance: {
      type: String,
      enum: ["Tidak hadir", "Hadir", "Ragu-ragu"],
      default: "Tidak hadir",
    },
    createdDate: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const RSVPDemoModel = mongoose.model<RSVPDemoDocument>("RSVP", rsvpDemoSchema);
export default RSVPDemoModel;