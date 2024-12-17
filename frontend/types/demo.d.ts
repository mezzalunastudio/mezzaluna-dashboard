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
          _id?:string;
          path?:string;
          isActive?:boolean;
          category: string;
          createdAt: Date;
        }
}
