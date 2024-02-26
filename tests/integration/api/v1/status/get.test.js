test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.active_connections).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const parsedDbVersion = parseFloat(
    responseBody.dependencies.database.version,
  );
  expect(responseBody.dependencies.database.version).toEqual(parsedDbVersion);

  const parsedMaxConnections = parseInt(
    responseBody.dependencies.database.max_connections,
  );
  expect(responseBody.dependencies.database.max_connections).toEqual(
    parsedMaxConnections,
  );
  expect(parsedMaxConnections).toBeGreaterThan(0);

  const parsedActiveConnections = parseInt(
    responseBody.dependencies.database.active_connections,
  );
  expect(parsedActiveConnections).toBeGreaterThan(0);
  expect(responseBody.dependencies.database.active_connections).toEqual(
    parsedActiveConnections,
  );
});
