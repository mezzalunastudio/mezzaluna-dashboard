import mongoose from "mongoose";
import { BAD_REQUEST, NOT_FOUND, OK, INTERNAL_SERVER_ERROR } from "../constants/http";
import MenuItemModel from "../models/menu.model";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import UserModel from "../models/user.model";

export const menuTreeHandler = catchErrors(async (req, res) => {
  const menuTree = await MenuItemModel.find({}).lean(); // Use .lean() for faster query without Mongoose document overhead
  return res.status(OK).json(menuTree);
});

export const menuByRoleHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  //create function isAdmin(role);
  const role = user.role;
  const menuItems = await MenuItemModel.find({ role: role })
    .sort({ order: 1 })
    .lean();

  appAssert(menuItems && menuItems.length > 0, NOT_FOUND, "Menu items not found.");

  const menuMap = new Map<string, any>();
  const result: any[] = [];

  menuItems.forEach((item) => {
    const extendedItem = { ...item, items: [] }; // Tambahkan properti `items` di runtime
    menuMap.set(item._id.toString(), extendedItem);

    if (extendedItem.parentId) {
      const parent = menuMap.get(extendedItem.parentId.toString());
      if (parent) {
        parent.items.push(extendedItem);
      }
    } else {
      result.push(extendedItem);
    }
  });

  return res.status(OK).json(result);
});


export const addMenuItemHandler = catchErrors(async (req, res) => {
  const { menuItems } = req.body;

  appAssert(Array.isArray(menuItems) && menuItems.length > 0, BAD_REQUEST, "Invalid menuItems array");

  const deleteResult = await MenuItemModel.deleteMany({});
  appAssert(deleteResult?.acknowledged, INTERNAL_SERVER_ERROR, "Failed to truncate existing menu items.");

  await saveMenuHierarchy(menuItems);

  return res.status(201).json({ message: "Menu hierarchy saved successfully" });
});

async function saveMenuHierarchy(menuItems: any[], parentId: mongoose.Types.ObjectId | null = null) {
  for (const item of menuItems) {
    const { items, ...menuData } = item;
    const menuItem = await MenuItemModel.create({ ...menuData, parentId });

    if (items && Array.isArray(items) && items.length > 0) {
      await saveMenuHierarchy(items, menuItem._id);
    }
  }
}
