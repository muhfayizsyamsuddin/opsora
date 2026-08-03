/**
 * @openapi
 * /attendances:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get all attendance records
 *     description: Retrieve attendance records with pagination, search, employee filter, and attendance status filter.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PRESENT
 *             - LATE
 *             - ABSENT
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - checkIn
 *             - createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @openapi
 * /attendances:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Create attendance
 *     description: Create a new attendance record. Requires ADMIN or MANAGER role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       201:
 *         description: Attendance created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /attendances/{id}:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get attendance by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /attendances/{id}:
 *   patch:
 *     tags:
 *       - Attendance
 *     summary: Update attendance
 *     description: Update an attendance record. Requires ADMIN or MANAGER role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttendanceRequest'
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /attendances/{id}:
 *   delete:
 *     tags:
 *       - Attendance
 *     summary: Delete attendance
 *     description: Delete an attendance record. Requires ADMIN role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Attendance deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */