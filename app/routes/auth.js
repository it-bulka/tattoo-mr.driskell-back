const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
  me,
} = require("../controllers/auth");
const { authenticate } = require("../middleware/authenticate");

router.route("/register").post(register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, me);

module.exports = router;
