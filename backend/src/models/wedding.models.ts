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
  };
  bride: {
    shortName: string;
    fullName: string;
    fullNameWithTitle: string;
    fatherName: string;
    motherName: string;
    orderInFamily: string;
    instagram?: string;
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
    address:string;
    liveLink?: string;
  };
  resepsi: {
    time: string;
    date: string;
    place: string;
    address:string;
    liveLink?: string;
    mapsLink?: string;
  };
  loveStory: {
    loveStoryActived: boolean;
    firstMeet?: string;
    theProposal?: string;
    marriage?: string;
  };
  gift:{
    isRecieveGift:boolean;
    giftAddress?:string;
    groomBank?: string;
    groomNoRek?: string;
    brideBank?: string;
    brideNoRek?: string;
  };
  imageUrl: {
    groomImg?: string;
    brideImg?: string;
    heroImg?: string;
    headerImg?: string;
    eventImg?: string;
    eventImg2?: string;
    quoteImg?: string;
    loveStoryImg?: string;
    giftImg?: string;
    rsvpImg?: string;
    footerImg1?: string;
    footerImg2?: string;
    img1?: string; 
    img2?: string; 
    img3?: string; 
  };
  media:{
    audio?:string;
    youtubeVideoId?:string;
  };
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
    },
    bride: {
      shortName: { type: String, required: true },
      fullName: { type: String, required: true },
      fullNameWithTitle: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String, required: true },
      orderInFamily: { type: String, required: true },
      instagram: { type: String },
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
      address: { type: String },
      liveLink: { type: String },
    },
    resepsi: {
      time: { type: String, required: true },
      date: { type: String, required: true },
      place: { type: String, required: true },
      address: { type: String },
      liveLink: { type: String },
      mapsLink: { type: String },
    },
    loveStory: {
      loveStoryActived: {type: Boolean, required: true, default:false},
      firstMeet: { type: String },
      theProposal: { type: String },
      marriage: { type: String },
    },
    gift: {
      isRecieveGift: {type: Boolean, required: true, default:false},
      giftAddress: { type: String },
      groomNoRek: { type: String },
      groomBank: { type: String },
      brideNoRek: { type: String },
      brideBank: { type: String },
    },
    imageUrl: {
      groomImg: { type: String },
      brideImg: { type: String },
      headerImg: { type: String },
      heroImg: { type: String},
      eventImg: { type: String },
      eventImg2: { type: String },
      quoteImg: { type: String },
      loveStoryImg: { type: String },
      giftImg: { type: String },
      rsvpImg: { type: String },
      footerImg: { type: String },
      footerImg2: { type: String },
      Img1: { type: String },
      Img2: { type: String },
      Img3: { type: String },
    },
    media: {
      audio: { type: String },
      youtubeVideoId: { type: String },
    },
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

