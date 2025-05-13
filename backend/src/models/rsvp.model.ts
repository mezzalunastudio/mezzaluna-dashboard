// import mongoose from "mongoose";

// export interface RSVPDocument extends mongoose.Document {
//   weddingId: mongoose.Types.ObjectId; // Reference ke Wedding
//   sender: string;
//   message: string;
//   attendance: string;
//   createdDate: Date;
// }

// const rsvpSchema = new mongoose.Schema<RSVPDocument>(
//   {
//     weddingId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Wedding",
//       required: true,
//     },
//     sender: { type: String, required: true },
//     message: { type: String, required: true },
//     attendance: {
//       type: String,
//       enum: ["Tidak hadir", "Hadir", "Ragu-ragu"],
//       default: "Tidak hadir",
//     },
//     createdDate: { type: Date, default: Date.now },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// const RSVPModel = mongoose.model<RSVPDocument>("RSVP", rsvpSchema);
// export default RSVPModel;