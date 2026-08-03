/**
 * @openapi
 * /employees:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get all employees
 *     description: Retrieve employees with pagination, search and filtering.
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
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /employees:
 *   post:
 *     tags:
 *       - Employees
 *     summary: Create employee
 *     description: Create a new employee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Success
 *               data:
 *                 id: "2f1dde6e-7034-4c24-b0f8-08317ce427f4"
 *                 name: "Saya"
 *                 email: "saya@gmail.com"
 *                 position: "Senior Software Engineer"
 *                 salary: 15000000
 *                 hireDate: "2026-08-01T00:00:00.000Z"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /employees/{id}:
 *   patch:
 *     tags:
 *       - Employees
 *     summary: Update employee
 *     description: Update employee information.
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
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /employees/{id}:
 *   delete:
 *     tags:
 *       - Employees
 *     summary: Delete employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */