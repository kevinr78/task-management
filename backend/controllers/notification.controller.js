import notificationModel from "../models/notification.model.js";
import createNewError from "../utils/Error.js";
import { getIO, connectedUsers } from "../socket.js/index.js";

const sendNotification = async (data, next) => {
  const { from, to, message, event } = data;
  if (from === "" || to === "" || message === "") {
    throw createNewError(401, "Error while sending notification");
  }
  const notification = new notificationModel({
    senderId: from,
    recipientId: to,
    message,
  });

  try {
    const savedNotification = await notification.save();
    const io = getIO();

    io.to(connectedUsers[to]).emit(event, message);
    return null;
  } catch (error) {
    return error;
  }
};

const removeTaskNotification = async (data) => {
  const { taskId, id } = data;
};

export { sendNotification, removeTaskNotification };
