// Load environment variables first
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server root directory
const envPath = join(__dirname, '.env');
const result = config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

console.log('✅ Environment variables loaded from:', envPath);

// Verify required environment variables
const requiredVars = ['OPENAI_API_KEY', 'MONGO_URI', 'PORT'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Export the environment variables
export default process.env;
