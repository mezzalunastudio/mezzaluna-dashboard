import { z } from "zod";
import { NOT_FOUND, OK, INTERNAL_SERVER_ERROR,BAD_REQUEST, FORBIDDEN } from "../constants/http";
import weddingModel from "../models/wedding.models";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";


export const getWeddingHandler = catchErrors(async (req, res, next) => {
    const weddingContent = await weddingModel.find();
    appAssert(weddingContent, NOT_FOUND, "Wedding content not found");
    return res.status(OK).json(weddingContent);
  });


  export const addWeddingHandler = catchErrors(async (req, res) => {
    const weddingData = req.body;
    const newWedding = new weddingModel(weddingData);
    const savedWedding = await newWedding.save();
    appAssert(savedWedding, INTERNAL_SERVER_ERROR, "Failed to add wedding content");
    return res.status(201).json({ message: "Wedding Content saved successfully" });
  });

  export const deleteWeddingHandler = catchErrors(async (req, res) => {
    const id = z.string().parse(req.params.id);
    const deletedWedding = await weddingModel.findByIdAndDelete(id);
    appAssert(deletedWedding, NOT_FOUND, "wedding content not found");
    return res.status(OK).json({ message: "wedding content removed" });
  } 
);

export const updateWeddingHandler = catchErrors(async (req, res) => {
    const id = z.string().parse(req.params.id);
    const updateData = req.body;
    const updatedWedding = await weddingModel.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      });
    appAssert(updatedWedding, NOT_FOUND, "wedding content not found");
    appAssert(updatedWedding, INTERNAL_SERVER_ERROR, "Error updating wedding data");
    return res.status(201).json(updatedWedding);
}
);

export const getByIdWeddingHandler = catchErrors(async (req, res) => {
  const id = z.string().parse(req.params.id);
    const wedding = await weddingModel.findById(id);
    appAssert(wedding, NOT_FOUND, "wedding content not found");
    return res.status(OK).json(wedding);
});

export const getByCategoryHandler = catchErrors(async (req, res) => {
    const { category } = req.params;
    const weddings = await weddingModel.find({ category });
    appAssert(weddings, NOT_FOUND, "wedding content not found");
    return res.status(OK).json(weddings);
});
  
export const launchWeddingHandler = catchErrors(async (req, res) => {
  const id = z.string().parse(req.params.id);
  const updatedWedding = await weddingModel.findByIdAndUpdate(
    id, {isActive: true });
  appAssert(updatedWedding, NOT_FOUND, "wedding content not found");
  appAssert(updatedWedding, INTERNAL_SERVER_ERROR, "Failed to launch");
  const wedding = await weddingModel.findById(id);
  return res.status(201).json(wedding);
});