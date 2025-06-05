import mongoose from "mongoose";

export interface WeddingDocument extends mongoose.Document {
  groom: {
    shortName: string;
    fullName: string;
    fullNameWithTitle: string;
    fatherName: string;
    motherName: string;
    orderInFamily?: string;
    instagram?: string;
  };
  bride: {
    shortName: string;
    fullName: string;
    fullNameWithTitle: string;
    fatherName: string;
    motherName: string;
    orderInFamily?: string;
    instagram?: string;
  };
  quotes: {
    quote1: string;
    quote1From: string;
    quote2?: string;
    quote2From?: string;
  };
  akad: {
    time?: string;
    timeRange?: {
    start: string;
    end: string;
  };
    date: string;
    place: string;
    address:string;
    liveLink?: string;
  };
  resepsi: {
    isResepsi: boolean;
    time?: string;
    timeRange?: {
    start: string;
    end: string;
  };
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
    nameNorek1?:string;
    groomBank?: string;
    groomNoRek?: string;
    nameNorek2?:string;
    brideBank?: string;
    brideNoRek?: string;
  };
  dressColors?: string[];
  otherInfo?: {
    [key: string]: string;
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
      orderInFamily: { type: String},
      instagram: { type: String },
    },
    bride: {
      shortName: { type: String, required: true },
      fullName: { type: String, required: true },
      fullNameWithTitle: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String, required: true },
      orderInFamily: { type: String },
      instagram: { type: String },
    },
    quotes: {
      quote1: { type: String, required: true },
      quote1From: { type: String, required: true },
      quote2: { type: String },
      quote2From: { type: String },
    },
    akad: {
      time: { type: String },
       timeRange: {
        start: { type: String},
        end: { type: String }
      },
      date: { type: String, required: true },
      place: { type: String, required: true },
      address: { type: String },
      liveLink: { type: String },
    },
    resepsi: {
      isResepsi: {type: Boolean, required: true, default:true},
      firstMeet: { type: String },
      time: { type: String },
      timeRange: {
        start: { type: String },
        end: { type: String}
      },
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
      nameNoRek1: { type: String },
      groomNoRek: { type: String },
      groomBank: { type: String },
      nameNoRek2: { type: String },
      brideNoRek: { type: String },
      brideBank: { type: String },
    },
    dressColors: { type: [String]},
    otherInfo: { type: Map, of: String },
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
      footerImg1: { type: String },
      footerImg2: { type: String },
      img1: { type: String },
      img2: { type: String },
      img3: { type: String },
    },
    media: {
      audio: { type: String },
      youtubeVideoId: { type: String },
    },
    
    path: { type: String, index: true }, 
    category: { type: String, required: true, index: true },
    isActive: { type: Boolean, required: true,index: true, default:false},
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true }, // Enable virtuals in JSON output
    toObject: { virtuals: true },
  }
);
weddingSchema.index({ category: 1, isActive: 1 });
weddingSchema.index({ path: 1 });

// Virtual property untuk kompatibilitas
weddingSchema.virtual('calculatedPath').get(function(this: WeddingDocument) {
  return (`${this.groom.shortName}-${this.bride.shortName}`).toLowerCase();
});

// Pre-save hook untuk mengisi field path
weddingSchema.pre('save', function(next) {
  if (this.isModified('groom.shortName') || this.isModified('bride.shortName') || !this.path) {
    this.path = (`${this.groom.shortName}-${this.bride.shortName}`).toLowerCase();
  }
  next();
});

weddingSchema.pre('save', function(next) {
  if (this.isModified('groom.shortName') || this.isModified('bride.shortName')) {
    this.path = `${this.groom.shortName}-${this.bride.shortName}`.toLowerCase();
  }
  next();
});

weddingSchema.pre('save', function (next) {
  if (typeof this.akad.timeRange === 'string') {
    try {
      this.akad.timeRange = JSON.parse(this.akad.timeRange);
    } catch (e) {
      return next(new Error('Invalid JSON format for akad.timeRange'));
    }
  }

  if (typeof this.resepsi.timeRange === 'string') {
    try {
      this.resepsi.timeRange = JSON.parse(this.resepsi.timeRange);
    } catch (e) {
      return next(new Error('Invalid JSON format for resepsi.timeRange'));
    }
  }
  next();
});

const WeddingModel = mongoose.model<WeddingDocument>("Wedding", weddingSchema);
export default WeddingModel;

