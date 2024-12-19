import connectToDatabase from "../config/db";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, SERVER_TIMEOUT } from "../constants/http";
import WeddingModel from "../models/wedding.models";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

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

export const saveRspvHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { sender, message, attendance } = req.body;
  const wedding = await WeddingModel.findOne({ _id: id, isActive: true });
  appAssert(wedding, NOT_FOUND, "wedding content not found");

  const newRsvp = {
    sender,
    message,
    attendance,
    createdDate: new Date(),
  };

  wedding.rsvp.push(newRsvp);

  // Simpan dokumen yang telah diperbarui
  const updatedWedding = await wedding.save();
    
    appAssert(updatedWedding, INTERNAL_SERVER_ERROR, "Failed to save rsvp");
    return res.status(201).json(updatedWedding);
});

