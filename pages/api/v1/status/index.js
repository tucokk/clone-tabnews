import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const serverVersion = await database.query("SHOW server_version;");
  const maxConnections = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const activeConnections = await database.query({
    text: "SELECT COUNT(*)::int active_connections FROM pg_stat_activity WHERE 1=1 AND state = 'active' AND datname = $1;",
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: parseFloat(serverVersion.rows[0].server_version),
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        active_connections: parseInt(
          activeConnections.rows[0].active_connections,
        ),
      },
    },
  });
}

export default status;
