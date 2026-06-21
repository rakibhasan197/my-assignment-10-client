import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("StartupForge");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
   emailAndPassword: { 
    enabled: true, 
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: 'founder',
        required: true,
      },
      plan: {
        defaultValue: 'free'
      }
    },
  },
 
});
