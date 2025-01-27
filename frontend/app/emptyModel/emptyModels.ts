import { Demo } from '@/types';

export const emptyUser: Demo.user = {
    email: '',
    password: '',
    role: '',
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const emptyWeddingContent: Demo.wedding = {
    _id: "",
  path: "",
  isActive: false,
  category: "",
  createdAt: new Date(0), 
  groom: {
    shortName: "",
    fullName: "",
    fullNameWithTitle: "",
    fatherName: "",
    motherName: "",
    orderInFamily: "",
    instagram: "",
  },
  bride: {
    shortName: "",
    fullName: "",
    fullNameWithTitle: "",
    fatherName: "",
    motherName: "",
    orderInFamily: "",
    instagram: "",
  },
  quotes: {
    quote1: "",
    quote1From: "",
    quote2: "",
    quote2From: "",
  },
  akad: {
    time: "",
    date: "",
    place: "",
    address:"",
    liveLink: "",
  },
  resepsi: {
    time: "",
    date: "",
    place: "",
    liveLink:"",
    mapsLink: "",
    address: "",
  },
  loveStory: {
    loveStoryActived: false,
    firstMeet: "",
    theProposal: "",
    marriage: "",
  },
  gift:{
    isRecieveGift:false,
    groomBank:"",
    groomNoRek:"",
    brideBank:"",
    brideNoRek:"",
  },
  rsvp:[{
    sender: "",
    message: "",
    attendance: "",
    createdDate: "",
  }],
  imageUrl: {
    groomImg: "",
    brideImg: "",
    heroImg: "",
    headerImg: "",
    eventImg: "",
    eventImg2: "",
    quoteImg: "",
    loveStoryImg: "",
    giftImg: "",
    rsvpImg: "",
    footerImg1: "",
    footerImg2: "",
    img1: "", 
    img2: "", 
    img3: "", 
  },
  media: {
    audio:"",
    youtubeVideoId:"",
  }
};

