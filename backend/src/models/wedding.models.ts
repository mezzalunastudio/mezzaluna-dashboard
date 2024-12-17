import mongoose from "mongoose";

export interface WeddingDocument extends mongoose.Document {
  groom: {
    shortName: string;
    fullName: string;
    fullNameWithTitle: string;
    fatherName: string;
    motherName: string;
    orderInFamily: string;
    instagram?: string;
    bank?: string;
    noRek?: string;
  };
  bride: {
    shortName: string;
    fullName: string;
    fullNameWithTitle: string;
    fatherName: string;
    motherName: string;
    orderInFamily: string;
    instagram?: string;
    bank?: string;
    noRek?: string;
  };
  quotes: {
    quote1: string;
    quote1From: string;
    quote2?: string;
    quote2From?: string;
  };
  akad: {
    time: string;
    date: string;
    place: string;
    liveLink?: string;
  };
  resepsi: {
    time: string;
    date: string;
    place: string;
    mapsLink?: string;
  };
  loveStory: {
    loveStoryActived: boolean;
    firstMeet?: string;
    theProposal?: string;
    marriage?: string;
  };
  imageUrl: {
    groomImg?: string;
    brideImg?: string;
    headerImg?: string;
    heroImg?: string;
    eventImg?: string;
    quoteImg?: string;
    loveStoryImg?: string;
    giftImg?: string;
    rsvpImg?: string;
    footerImg?: string;
  };
  rsvp: Array<{
    sender: string;
    message: string;
    attendance: string;
    createdDate: Date;
  }>;
  category: string;
  path?: string; // Virtual property
  isActive:boolean;
  createdAt: Date;
}

const weddingSchema = new mongoose.Schema<WeddingDocument>(
  {
    groom: {
      shortName: { type: String, required: true },
      fullName: { type: String, required: true },
      fullNameWithTitle: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String, required: true },
      orderInFamily: { type: String, required: true },
      instagram: { type: String },
      bank: { type: String },
      noRek: { type: String },
    },
    bride: {
      shortName: { type: String, required: true },
      fullName: { type: String, required: true },
      fullNameWithTitle: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String, required: true },
      orderInFamily: { type: String, required: true },
      instagram: { type: String },
      bank: { type: String },
      noRek: { type: String },
    },
    quotes: {
      quote1: { type: String, required: true },
      quote1From: { type: String, required: true },
      quote2: { type: String },
      quote2From: { type: String },
    },
    akad: {
      time: { type: String, required: true },
      date: { type: String, required: true },
      place: { type: String, required: true },
      liveLink: { type: String },
    },
    resepsi: {
      time: { type: String, required: true },
      date: { type: String, required: true },
      place: { type: String, required: true },
      mapsLink: { type: String },
    },
    loveStory: {
      loveStoryActived: {type: Boolean, required: true, default:false},
      firstMeet: { type: String },
      theProposal: { type: String },
      marriage: { type: String },
    },
    imageUrl: {
      groomImg: { type: String },
      brideImg: { type: String },
      headerImg: { type: String },
      heroImg: { type: String},
      eventImg: { type: String },
      quoteImg: { type: String },
      loveStoryImg: { type: String },
      giftImg: { type: String },
      rsvpImg: { type: String },
      footerImg: { type: String },
    },
    rsvp: [
      {
        sender: { type: String, required: true },
        message: { type: String, required: true },
        attendance: { type: String, enum: ["Tidak hadir", "Hadir", "Ragu-ragu"], default: "Tidak hadir" },
        createdDate: { type: Date, required: true, default: Date.now },
      },
    ],
    category: { type: String, required: true, index: true },
    isActive: { type: Boolean, required: true, default:false},
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true }, // Enable virtuals in JSON output
    toObject: { virtuals: true },
  }
);

// Virtual property for the `path`
weddingSchema.virtual("path").get(function (this: WeddingDocument) {
  return (`${this.groom.shortName}-${this.bride.shortName}`).toLowerCase();
});

const WeddingModel = mongoose.model<WeddingDocument>("Wedding", weddingSchema);
export default WeddingModel;
