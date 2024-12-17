import { NOT_FOUND, OK, INTERNAL_SERVER_ERROR,BAD_REQUEST, FORBIDDEN } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user.omitPassword());
});

export const addUserRoleHandler = catchErrors(async (req, res) => {
  
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  //create function isAdmin(role);
  const currentUserRole = user.role;
  appAssert(
    currentUserRole === "admin",
    FORBIDDEN,
    "Only admins can assign roles"
  );

  const { role } = req.body;
  const allowedRoles =  ["user", "admin", "superadmin"];
  const isValidRole = allowedRoles.includes(role);
  appAssert(isValidRole, BAD_REQUEST, "Invalid role provided");

  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id, {role: role });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to update roles");
  return res.status(OK).json(updatedUser.omitPassword());
});
