import express from "express";
import * as profileController from "../controllers/profileController.js";
import authenticateToken from "../services/authenticateToken.js";

const router = express.Router();

router.post(
  "/create-profile",
  authenticateToken,
  profileController.createProfile,
);
router.delete(
  "/delete-profile/:profileId",
  authenticateToken,
  profileController.deleteProfile,
);
router.put(
  "/update-profile/:profileId",
  authenticateToken,
  profileController.updateProfile,
);
router.get(
  "/read-profile/:profileId",
  authenticateToken,
  profileController.readProfile,
);
router.get("/search", authenticateToken, profileController.searchProfiles);
router.get("/all/:userId", authenticateToken, profileController.getAllProfiles);
router.get(
  "/:userId/:profileId",
  authenticateToken,
  profileController.getProfileById,
);

export default router;
