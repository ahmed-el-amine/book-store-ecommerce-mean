import express from 'express';
import User, { userRoles } from '../database/models/user.model.js';
import useAuth from '../middleware/useAuth.middleware.js';
const router = express.Router();

// Get all users
router.get('/', useAuth([userRoles.admin, userRoles.user]), async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from DB
    res.status(200).json(users); // Send as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
