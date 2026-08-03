/**
 * @openapi
 * /reports/dashboard:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get dashboard report
 *     description: Retrieve dashboard summary report. Requires ADMIN or MANAGER role.
 *     responses:
 *       200:
 *         description: Dashboard report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardReport'
 */

/**
 * @openapi
 * /reports/attendance:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get attendance report
 *     description: Retrieve attendance report. Requires ADMIN or MANAGER role.
 *     responses:
 *       200:
 *         description: Attendance report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceReport'
 */

/**
 * @openapi
 * /reports/leaves:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get leave report
 *     description: Retrieve leave report. Requires ADMIN or MANAGER role.
 *     responses:
 *       200:
 *         description: Leave report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveReport'
 */

/**
 * @openapi
 * /reports/payroll:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get payroll report
 *     description: Retrieve payroll report. Requires ADMIN or MANAGER role.
 *     responses:
 *       200:
 *         description: Payroll report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PayrollReport'
 */

/**
 * @openapi
 * /reports/performance:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get performance report
 *     description: Retrieve performance report. Requires ADMIN or MANAGER role.
 *     responses:
 *       200:
 *         description: Performance report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerformanceReport'
 */