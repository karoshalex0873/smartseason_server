INSERT INTO "roles" ("id", "name", "createdAt")
SELECT 'role-admin', 'Admin', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM "roles"
    WHERE "name" = 'Admin'
);

INSERT INTO "roles" ("id", "name", "createdAt")
SELECT 'role-agent', 'Agent', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM "roles"
    WHERE "name" = 'Agent'
);
