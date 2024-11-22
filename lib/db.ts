import { MongoClient, ObjectId } from 'mongodb';

// Ensure the required environment variable is available
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri: string = process.env.MONGODB_URI;
const options: Record<string, unknown> = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the Node.js global object to include a custom MongoDB client promise type
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // Use a global variable in development mode for Hot Module Replacement (HMR)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // Create a new client in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Define the interface for PositionComment
export interface PositionComment {
  _id?: ObjectId; // Optional MongoDB ObjectId
  documentId: string;
  startOffset: number;
  endOffset: number;
  comment: string;
}

export default clientPromise;
