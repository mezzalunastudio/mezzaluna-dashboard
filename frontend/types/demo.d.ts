/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

type Status = 'DELIVERED' | 'PENDING' | 'RETURNED' | 'CANCELLED';

export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;

export interface CustomEvent {
    name?: string;
    status?: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
    date?: string;
    color?: string;
    icon?: string;
    image?: string;
}

interface ShowOptions {
    severity?: string;
    content?: string;
    summary?: string;
    detail?: string;
    life?: number;
}

export interface ChartDataState {
    barData?: ChartData;
    pieData?: ChartData;
    lineData?: ChartData;
    polarData?: ChartData;
    radarData?: ChartData;
}
export interface ChartOptionsState {
    barOptions?: ChartOptions;
    pieOptions?: ChartOptions;
    lineOptions?: ChartOptions;
    polarOptions?: ChartOptions;
    radarOptions?: ChartOptions;
}

declare namespace Demo {
  type user = {
    email: string;
    password: string;
    role: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

    type wedding = {
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
      }
      rsvp: Array<{
        sender: string;
        message: string;
        attendance: string;
        createdDate: string;
      }>;
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
      _id?: string;
      path?: string;
      isActive?: boolean;
      category: string;
      createdAt: Date; //keep this in date format (monggo default)
}
}