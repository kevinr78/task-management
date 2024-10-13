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
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ref to User model
    },
  ],
  by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: [
    {
      taskId: String,
      taskTitle: String,
      username: String,
      assignedTo: mongoose.Schema.Types.ObjectId,
      completed: Boolean,
    },
  ],
});

export default mongoose.model("Project", ProjectSchema);
