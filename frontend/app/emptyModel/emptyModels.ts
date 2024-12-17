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
    _id: '',
    path: '',
    category: '',
    isActive:false,
    createdAt: new Date(0),
    groom: {
        shortName: '',
        fullName: '',
        fullNameWithTitle: '',
        fatherName: '',
        motherName: '',
        orderInFamily: '',
        instagram: '',
        bank: '',
        noRek: '',
    },
    bride: {
        shortName: '',
        fullName: '',
        fullNameWithTitle: '',
        fatherName: '',
        motherName: '',
        orderInFamily: '',
        instagram: '',
        bank: '',
        noRek: '',
    },
    quotes: {
        quote1: '',
        quote1From: '',
        quote2: '',
        quote2From: '',
    },
    akad: {
        time: '',
        date: '',
        place: '',
        liveLink: '',
    },
    resepsi: {
        time: '',
        date: '',
        place: '',
        mapsLink: '',
    },
    loveStory: {
        loveStoryActived:false,
        firstMeet: '',
        theProposal: '',
        marriage: '',
    },
    imageUrl: {
        groomImg: '',
        brideImg: '',
        headerImg: '',
        heroImg: '',
        eventImg: '',
        quoteImg: '',
        loveStoryImg: '',
        giftImg: '',
        rsvpImg: '',
        footerImg: '',
    },
};
