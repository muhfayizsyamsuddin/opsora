/**
 * @openapi
 * /leaves:
 *   get:
 *     tags:
 *       - Leave
 *     summary: Get all leave requests
 *     description: Retrieve leave requests with pagination, search, filtering, and sorting.
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
 *             - PENDING
 *             - APPROVED
 *             - REJECTED
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - startDate
 *             - endDate
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
 *         description: Leave requests retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @openapi
 * /leaves:
 *   post:
 *     tags:
 *       - Leave
 *     summary: Create leave request
 *     description: Create a new leave request. Requires ADMIN or MANAGER role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeaveRequest'
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /leaves/{id}:
 *   get:
 *     tags:
 *       - Leave
 *     summary: Get leave request by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Leave request retrieved successfully
 *       404:
 *         description: Leave request not found
 */

/**
 * @openapi
 * /leaves/{id}:
 *   patch:
 *     tags:
 *       - Leave
 *     summary: Update leave request
 *     description: Update a leave request. Requires ADMIN or MANAGER role.
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
 *             $ref: '#/components/schemas/UpdateLeaveRequest'
 *     responses:
 *       200:
 *         description: Leave updated successfully
 *       404:
 *         description: Leave request not found
 */

/**
 * @openapi
 * /leaves/{id}/approve:
 *   patch:
 *     tags:
 *       - Leave
 *     summary: Approve leave request
 *     description: Approve a pending leave request. Requires ADMIN or MANAGER role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Leave approved successfully
 *       404:
 *         description: Leave request not found
 */

/**
 * @openapi
 * /leaves/{id}/reject:
 *   patch:
 *     tags:
 *       - Leave
 *     summary: Reject leave request
 *     description: Reject a pending leave request. Requires ADMIN or MANAGER role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 *       404:
 *         description: Leave request not found
 */

/**
 * @openapi
 * /leaves/{id}:
 *   delete:
 *     tags:
 *       - Leave
 *     summary: Delete leave request
 *     description: Delete a leave request. Requires ADMIN role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Leave deleted successfully
 *       404:
 *         description: Leave request not found
 */