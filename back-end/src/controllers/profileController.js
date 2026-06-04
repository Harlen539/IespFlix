import { profiles } from "../data/profiles.js";

export function getProfiles(req, res) {
  res.json(profiles);
}
