# Supabase Configuration

This project is connected to a remote Supabase instance. It is not configured for local Supabase development, and commands that require a local Supabase instance (such as `supabase db reset`) will not work.

## Connecting to the Database

To connect to the Supabase database, you will need to use the following connection string.

### Connection String

```
DATABASE_URL=postgresql://postgres.fdxtvftguhcjmcjbiomz:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**Note:** You will need to replace `YOUR_PASSWORD` with the actual database password.

### Connection Details

*   **Host:** `aws-0-ap-southeast-1.pooler.supabase.com`
*   **Port:** `5432`
*   **Database:** `postgres`
*   **User:** `postgres.fdxtvftguhcjmcjbiomz`
*   **Pool Mode:** `session`

### Node.js Example

To connect to the database from a Node.js application, you can use the `postgres` package.

1.  **Install the package:**
    ```bash
    npm install postgres
    ```

2.  **Create a `db.js` file:**
    ```javascript
    import postgres from 'postgres'

    const connectionString = process.env.DATABASE_URL
    const sql = postgres(connectionString)

    export default sql