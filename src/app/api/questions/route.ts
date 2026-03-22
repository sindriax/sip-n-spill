import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import { validateQueryParams } from "../../lib/validation";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI environment variable is not defined.");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI) {
  console.error(
    "MongoDB URI is not defined. API route will not be able to connect to DB."
  );
} else {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    clientPromise = client.connect();
  }
}

export async function GET(req: NextRequest) {
  if (!MONGODB_URI || !clientPromise) {
    console.error("MongoDB URI not defined or client promise not initialized.");
    return NextResponse.json(
      {
        message:
          "Server configuration error: Database connection not configured.",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const { lang, categories, mode } = validateQueryParams(searchParams);

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("sip-n-spill");
    const questionsCollection = db.collection("questions");

    let query;
    if (mode === "hotseat") {
      query = { lang: lang, category: "hotseat" };
    } else if (mode === "date") {
      query = { lang: lang, category: "date" };
    } else if (mode === "classic") {
      // Classic mode: all standard questions (excluding hotseat and date)
      query = { lang: lang, category: { $nin: ["hotseat", "date"] } };
    } else if (categories.length === 1) {
      query = { lang: lang, category: categories[0] };
    } else {
      query = { lang: lang, category: { $in: categories } };
    }

    const questionsFromDb = await questionsCollection
      .find(query)
      .project({ text: 1, _id: 0 })
      .toArray();

    const questionsTextArray = questionsFromDb.map((qDoc) => qDoc.text);

    return NextResponse.json({
      questions: questionsTextArray,
      categories: mode === "hotseat" ? ["hotseat"] : categories,
      mode: mode || "standard",
    });
  } catch (error) {
    console.error("Failed to fetch questions from MongoDB:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        message: "Failed to load questions from database.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
