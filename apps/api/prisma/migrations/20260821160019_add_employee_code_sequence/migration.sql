CREATE SEQUENCE IF NOT EXISTS "employee_code_seq"
START WITH 1
INCREMENT BY 1
MINVALUE 1;

SELECT setval(
  '"employee_code_seq"',
  COALESCE(
    (
      SELECT MAX(
        CAST(
          SUBSTRING("employeeCode" FROM 5)
          AS BIGINT
        )
      )
      FROM "Employee"
      WHERE "employeeCode" IS NOT NULL
    ),
    1
  ),
  EXISTS (
    SELECT 1
    FROM "Employee"
    WHERE "employeeCode" IS NOT NULL
  )
);