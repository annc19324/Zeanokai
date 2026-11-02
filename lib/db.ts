import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_QHDLurXb21te@ep-hidden-art-aoaogril-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(connectionString);
