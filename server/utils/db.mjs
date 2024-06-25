// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:300720@localhost:5432/BuildCreatingDataAPI ",
});

export default connectionPool;
