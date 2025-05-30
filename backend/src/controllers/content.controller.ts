import { z } from "zod";
import connectToDatabase from "../config/db";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, SERVER_TIMEOUT } from "../constants/http";
// import RSVPModel from "../models/rsvp.model";
import RSVPDemoModel from "../models/rsvpDemo";
import WeddingModel from "../models/wedding.models";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import RSVPModel from "../models/rsvp.model";

export const getWeddingContentByCategoryHandler = catchErrors(async (req, res) => {
  console.time("DB Query Time");
    const { category } = req.params;
    const { path } = req.params;
    // Fetch weddings with other criteria
    await connectToDatabase();
    const wedding = await WeddingModel.find({ category, isActive: true }).limit(10);
    console.timeEnd("DB Query Time");
    appAssert(wedding,SERVER_TIMEOUT, "Request timed out");
  // Filter in memory based on virtual property
    const filteredWeddings = wedding.filter((wedding) => wedding.path === path);
    appAssert(wedding, NOT_FOUND, "wedding content not found");
    return res.status(OK).json(filteredWeddings);
});

export const getRsvpByIdHandler = catchErrors(async(req, res)=>{  
const { weddingId } = req.params;
const wedding = await WeddingModel.findOne({ _id: weddingId, isActive: true });
appAssert(wedding, NOT_FOUND, "wedding content not found");
const rsvps = await RSVPModel.find({ weddingId: wedding._id }).exec();
    return res.status(OK).json(rsvps);
});

export const saveRspvHandler = catchErrors(async (req, res) => {
  const { weddingId } = req.params;
  const rsvpData = req.body;
  const wedding = await WeddingModel.findOne({ _id: weddingId, isActive: true });
  appAssert(wedding, NOT_FOUND, "wedding content not found");
  const newRsvp = new RSVPModel(rsvpData);
  const saveRsvp = await newRsvp.save();
  appAssert(saveRsvp, INTERNAL_SERVER_ERROR, "Failed to add RSVP");
  return res.status(201).json({ message: "RSVP saved successfully" });
});

export const deleteRsvpHandler = catchErrors(async (req, res) => {
  const rsvpId = z.string().parse(req.params.id);
  const deleted = await RSVPModel.findOneAndDelete({
    _id: rsvpId
  });
  appAssert(deleted, INTERNAL_SERVER_ERROR, "Failed to remove rsvp");
  appAssert(deleted, NOT_FOUND, "rsvp not found");
  return res.status(OK).json({ message: "rsvp removed" });
});


export const getRsvpDemoByTemplate = catchErrors(async(req, res)=>{  
  const { template } = req.params;
  const rsvps = await RSVPDemoModel.find({ template: template }).exec();
  appAssert(rsvps, NOT_FOUND, "RSVP not found");
  return res.status(OK).json(rsvps);
  });
  

export const SaveRspvDemoHandler = catchErrors(async (req, res) => {
  const rsvpData = req.body;
  const newRsvp = new RSVPDemoModel(rsvpData);
  const saveRsvp = await newRsvp.save();
  appAssert(saveRsvp, INTERNAL_SERVER_ERROR, "Failed to add RSVP");
  return res.status(201).json({ message: "RSVP saved successfully" });
});

export const deleteRsvpDemoHandler = catchErrors(async (req, res) => {
  const rsvpId = z.string().parse(req.params.id);
  const deleted = await RSVPDemoModel.findOneAndDelete({
    _id: rsvpId
  });
  appAssert(deleted, INTERNAL_SERVER_ERROR, "Failed to remove rsvp");
  appAssert(deleted, NOT_FOUND, "rsvp not found");
  return res.status(OK).json({ message: "rsvp removed" });
});


  export const SaveWeddingHandler = catchErrors(async (req, res) => {
    const weddingData = req.body;
    const newWedding = new WeddingModel(weddingData);
    const savedWedding = await newWedding.save();
    appAssert(savedWedding, INTERNAL_SERVER_ERROR, "Failed to add wedding content");
    return res.status(201).json({ message: "Wedding Content saved successfully" });
  });

