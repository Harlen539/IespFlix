import { notifications } from "../data/notifications.js";

export function getNotifications(req, res) {
  res.json(notifications);
}
