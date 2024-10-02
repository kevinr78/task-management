import mongoose, { mongo } from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 2,
  },
  description: {
    type: String,
    required: true,
    min: 5,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: [],
});

export default mongoose.model("Project", ProjectSchema);
