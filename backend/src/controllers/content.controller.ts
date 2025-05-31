import { z } from "zod";
import connectToDatabase from "../config/db";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, SERVER_TIMEOUT } from "../constants/http";
// import RSVPModel from "../models/rsvp.model";
import RSVPDemoModel from "../models/rsvpDemo";
import WeddingModel from "../models/wedding.models";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import RSVPModel from "../models/rsvp.model";
import mongoose from "mongoose";

export const getWeddingContentByCategoryHandler = catchErrors(async (req, res) => {
  console.time("DB Query Time");
    const { category } = req.params;
    const { path } = req.params;
    // Fetch weddings with other criteria
    await connectToDatabase();
      const wedding = await WeddingModel.findOne({ 
    category,
    path, 
    isActive: true 
  });
    console.timeEnd("DB Query Time");
    appAssert(wedding,SERVER_TIMEOUT, "Request timed out");
  // Filter in memory based on virtual property
    appAssert(wedding, NOT_FOUND, "wedding content not found");
    res.setHeader('Cache-Control', 'no-store');
    return res.status(OK).json(wedding);
});

export const getRsvpByIdHandler = catchErrors(async(req, res)=>{  
const { weddingId } = req.params;
if (!mongoose.Types.ObjectId.isValid(weddingId)) {
     return res.status(400).json({ error: "Invalid ID format" });
  }
  await connectToDatabase();
  console.time("DB Query Time");
const wedding = await WeddingModel.findOne({ _id: weddingId, isActive: true });
console.timeEnd("DB Query Time");
appAssert(wedding, NOT_FOUND, "wedding content not found");
const rsvps = await RSVPModel.find({ weddingId: wedding._id }).exec();
res.setHeader('Cache-Control', 'no-store');
    return res.status(OK).json(rsvps);
});

export const saveRspvHandler = catchErrors(async (req, res) => {
  const { weddingId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(weddingId)) {
     return res.status(400).json({ error: "Invalid ID format" });
  }
  const rsvpData = req.body;
    console.time("DB Query Time");
const wedding = await WeddingModel.findOne({ _id: weddingId, isActive: true });
console.timeEnd("DB Query Time");
  appAssert(wedding, NOT_FOUND, "wedding content not found");
  const newRsvp = new RSVPModel(rsvpData);
  const saveRsvp = await newRsvp.save();
  appAssert(saveRsvp, INTERNAL_SERVER_ERROR, "Failed to add RSVP");
  return res.status(201).json({ message: "RSVP saved successfully" });
});

export const deleteRsvpHandler = catchErrors(async (req, res) => {
  const rsvpId = z.string().parse(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(rsvpId)) {
     return res.status(400).json({ error: "Invalid ID format" });
  }
  const deleted = await RSVPModel.findOneAndDelete({
    _id: rsvpId
  });
  appAssert(deleted, INTERNAL_SERVER_ERROR, "Failed to remove rsvp");
  appAssert(deleted, NOT_FOUND, "rsvp not found");
  return res.status(OK).json({ message: "rsvp removed" });
});


export const getRsvpDemoByTemplate = catchErrors(async(req, res)=>{  
  const { template } = req.params;
   await connectToDatabase();
    console.time("DB Query Time");
 const rsvps = await RSVPDemoModel.find({ template: template }).exec();
console.timeEnd("DB Query Time");
  appAssert(rsvps, NOT_FOUND, "RSVP not found");
  res.setHeader('Cache-Control', 'no-store');
  return res.status(OK).json(rsvps);
  });
  

export const SaveRspvDemoHandler = catchErrors(async (req, res) => {
  const rsvpData = req.body;
  const newRsvp = new RSVPDemoModel(rsvpData);
      console.time("DB Query Time");
   const saveRsvp = await newRsvp.save();
console.timeEnd("DB Query Time");
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
      console.time("DB Query Time");
  const savedWedding = await newWedding.save();
console.timeEnd("DB Query Time");
    appAssert(savedWedding, INTERNAL_SERVER_ERROR, "Failed to add wedding content");
    return res.status(201).json({ message: "Wedding Content saved successfully" });
  });

