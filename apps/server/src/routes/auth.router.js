import express from 'express';
import useZod from '../middleware/useZod';
import { activeUserEmailSchema, createUserSchema, forgotUserPasswordSchema, loginUserSchema, resetUserPasswordSchema } from '../lib/zod/user.zod';
import { activeEmail, create, forgotPassword, login, resetForgotPassword } from '../controllers/user.controller.js';
import csurf from 'csurf';
import authorization from '../middleware/useAuth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

/**
 * @swagger
 * /auth/csrf-token:
 *   get:
 *     summary: Get CSRF token
 *     description: Returns a CSRF token for form submissions
 *     responses:
 *       200:
 *         description: CSRF token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 */
router.get('/csrf-token', csrfProtection, (req, res) => {
  return res.json({ csrfToken: req.csrfToken() });
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/signup', useZod(createUserSchema), create);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Log in a user and return authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', useZod(loginUserSchema), login);

/**
 * @swagger
 * /auth/active-email:
 *   post:
 *     summary: Activate user email
 *     description: Activates a user account using the email verification token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email activated successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/active-email', useZod(activeUserEmailSchema), activeEmail);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', useZod(forgotUserPasswordSchema), forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets user password with token from email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', useZod(resetUserPasswordSchema), resetForgotPassword);

/**
 * @swagger
 * /auth/addAdmin:
 *   post:
 *     summary: Create admin user
 *     description: Creates a new admin user (restricted to superAdmin)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires superAdmin role
 */
router.post(
  '/addAdmin',
  useZod(createUserSchema),
  authorization(['superAdmin']),
  async (req, res, next) => {
    req.isAdminCreation = true;
    next();
  },
  create
);

router.post('/logout', (req, res) => {
  // on logout just remove the cookie from the client
  res.clearCookie(process.env.JWT_Cookie_Name);
  res.end();
});

export default router;
