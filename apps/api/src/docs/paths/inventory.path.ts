/**
 * @openapi
 * /inventory/stock:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Get inventory stock
 *     description: Retrieve active product stock with pagination, search, and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum:
 *             - name
 *             - createdAt
 *           default: name
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: asc
 *     responses:
 *       200:
 *         description: Inventory stock retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryStockCollection'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /inventory/stock/{product_id}:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Get inventory stock by product
 *     description: Retrieve stock information for a specific product.
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product stock retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /inventory/movements:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Get inventory movements
 *     description: Retrieve inventory movements with pagination and filtering.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: movement_type
 *         schema:
 *           type: string
 *           enum:
 *             - IN
 *             - OUT
 *       - in: query
 *         name: reference_type
 *         schema:
 *           type: string
 *           enum:
 *             - PURCHASE
 *             - SALE
 *             - ADJUSTMENT
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *           default: createdAt
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *     responses:
 *       200:
 *         description: Inventory movements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryMovementCollection'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /inventory/movements/{id}:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Get inventory movement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inventory movement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @openapi
 * /inventory/adjustments:
 *   post:
 *     tags:
 *       - Inventory
 *     summary: Create inventory adjustment
 *     description: Adjust product stock and create an inventory movement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryAdjustmentRequest'
 *     responses:
 *       200:
 *         description: Inventory adjustment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */