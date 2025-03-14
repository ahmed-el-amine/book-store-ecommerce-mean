import express from 'express';
import { userRoles } from '../database/models/user.model.js';
import useAuth from '../middleware/useAuth.middleware.js';
import {
  addAddress,
  changePassword,
  deleteAddress,
  getAllAddresses,
  getAllUsers,
  getNotifications,
  markAllAsRead,
  markAsRead,
  update,
  updateAddress,
} from '../controllers/user.controller.js';
import useZod from '../middleware/useZod.js';
import { addUserAddressSchema, updateUserSchema, updateUserAddressSchema, changeUserPasswordSchema } from '../lib/zod/user.zod.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *         - country
 *         - postalCode
 *       properties:
 *         _id:
 *           type: string
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         postalCode:
 *           type: string
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         message:
 *           type: string
 *         read:
 *           type: boolean
 *         type:
 *           type: string
 *           enum: [order, review, general]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 */

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (admin only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 */
router.get('/', useAuth([userRoles.user]), getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the profile of the currently authenticated user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', useAuth([userRoles.admin, userRoles.user]), async (req, res) => {
  res.json(req.user);
});

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update user profile
 *     description: Update the current user's profile information
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.patch('/me', useAuth([userRoles.admin, userRoles.user]), useZod(updateUserSchema), update);

/**
 * @swagger
 * /users/me/address:
 *   get:
 *     summary: Get all addresses
 *     description: Retrieve all addresses for the current user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
router.get('/me/address', useAuth([userRoles.admin, userRoles.user]), getAllAddresses);

/**
 * @swagger
 * /users/me/change-password:
 *   post:
 *     summary: Change password
 *     description: Change the current user's password
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or incorrect current password
 *       401:
 *         description: Unauthorized
 */
router.post('/me/change-password', useAuth([userRoles.admin, userRoles.user]), useZod(changeUserPasswordSchema), changePassword);

/**
 * @swagger
 * /users/me/address:
 *   post:
 *     summary: Add new address
 *     description: Add a new address for the current user
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/me/address', useAuth([userRoles.admin, userRoles.user]), useZod(addUserAddressSchema), addAddress);

/**
 * @swagger
 * /users/me/address/{id}:
 *   patch:
 *     summary: Update address
 *     description: Update an existing address
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.patch('/me/address/:id', useAuth([userRoles.admin, userRoles.user]), useZod(updateUserAddressSchema), updateAddress);

/**
 * @swagger
 * /users/me/address/{id}:
 *   delete:
 *     summary: Delete address
 *     description: Delete an existing address
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.delete('/me/address/:id', useAuth([userRoles.admin, userRoles.user]), deleteAddress);

/**
 * @swagger
 * /users/me/notifications:
 *   get:
 *     summary: Get notifications
 *     description: Retrieve all notifications for the current user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 */
router.get('/me/notifications', useAuth([userRoles.admin, userRoles.user]), getNotifications);

/**
 * @swagger
 * /users/me/notifications/{id}/read:
 *   post:
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.post('/me/notifications/:id/read', useAuth([userRoles.admin, userRoles.user]), markAsRead);

/**
 * @swagger
 * /users/me/notifications/readAll:
 *   post:
 *     summary: Mark all notifications as read
 *     description: Mark all notifications for the current user as read
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.post('/me/notifications/readAll', useAuth([userRoles.admin, userRoles.user]), markAllAsRead);

export default router;
