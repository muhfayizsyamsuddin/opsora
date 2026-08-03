/**
 * @openapi
 * /performance-reviews:
 *   get:
 *     tags:
 *       - Performance Review
 *     summary: Get all performance reviews
 *     description: Retrieve performance reviews with pagination, filtering, and sorting.
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
 *         name: employeeId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: reviewer
 *         schema:
 *           type: string
 *       - in: query
 *         name: score
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - reviewDate
 *             - score
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
 *         description: Performance reviews retrieved successfully
 */

/**
 * @openapi
 * /performance-reviews:
 *   post:
 *     tags:
 *       - Performance Review
 *     summary: Create performance review
 *     description: Create a new performance review. Requires ADMIN or MANAGER role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePerformanceReviewRequest'
 *     responses:
 *       201:
 *         description: Performance review created successfully
 */

/**
 * @openapi
 * /performance-reviews/{id}:
 *   get:
 *     tags:
 *       - Performance Review
 *     summary: Get performance review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Performance review retrieved successfully
 */

/**
 * @openapi
 * /performance-reviews/{id}:
 *   put:
 *     tags:
 *       - Performance Review
 *     summary: Update performance review
 *     description: Update an existing performance review. Requires ADMIN or MANAGER role.
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
 *             $ref: '#/components/schemas/UpdatePerformanceReviewRequest'
 *     responses:
 *       200:
 *         description: Performance review updated successfully
 */

/**
 * @openapi
 * /performance-reviews/{id}:
 *   delete:
 *     tags:
 *       - Performance Review
 *     summary: Delete performance review
 *     description: Delete a performance review. Requires ADMIN role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Performance review deleted successfully
 */