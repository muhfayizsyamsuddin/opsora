/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics
 *     description: Retrieve overall system statistics for the dashboard. Requires ADMIN role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStatistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */