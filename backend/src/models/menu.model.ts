import mongoose from "mongoose";

export interface MenuItemDocument extends mongoose.Document {
  label: string;
  icon?: string;
  to?: string;
  url?: string;
  role: string[]; // Daftar peran yang memiliki akses, batas scope role terbatas 
  parentId?: mongoose.Types.ObjectId; // Referensi ke parent menu
  order: number; // Urutan menu
  createdAt: Date;
}

const menuItemSchema = new mongoose.Schema<MenuItemDocument>({
  label: { type: String, required: true },
  icon: { type: String },
  to: { type: String },
  url : {type: String},
  role: { type: [String], required: true, index: true }, // Daftar role
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", default: null },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const MenuItemModel = mongoose.model<MenuItemDocument>("MenuItem", menuItemSchema);
export default MenuItemModel;
