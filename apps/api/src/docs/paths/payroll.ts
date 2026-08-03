/**
 * @openapi
 * /payrolls:
 *   get:
 *     tags:
 *       - Payroll
 *     summary: Get all payroll records
 *     description: Retrieve payroll records with pagination, filtering, and sorting.
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
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: year
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
 *             - month
 *             - year
 *             - baseSalary
 *             - bonus
 *             - deduction
 *             - totalSalary
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
 *         description: Payroll records retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /payrolls:
 *   post:
 *     tags:
 *       - Payroll
 *     summary: Generate payroll
 *     description: Generate a payroll record for an employee. Requires ADMIN role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePayrollRequest'
 *     responses:
 *       201:
 *         description: Payroll generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payroll'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /payrolls/{id}:
 *   get:
 *     tags:
 *       - Payroll
 *     summary: Get payroll by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Payroll retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /payrolls/{id}:
 *   delete:
 *     tags:
 *       - Payroll
 *     summary: Delete payroll
 *     description: Delete a payroll record. Requires ADMIN role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Payroll deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */