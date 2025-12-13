import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

const VALID_CATEGORIES = ["chill", "spicy", "unhinged", "hotseat"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

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
  const lang = searchParams.get("lang") || "es";
  const categoriesParam = searchParams.get("categories") || searchParams.get("category") || "spicy";
  const mode = searchParams.get("mode");

  const requestedCategories = categoriesParam.split(",").map((c) => c.trim());
  const validCategories: Category[] = requestedCategories.filter((c) =>
    VALID_CATEGORIES.includes(c as Category)
  ) as Category[];

  const categories: Category[] = validCategories.length > 0 ? validCategories : ["spicy"];

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("sip-n-spill");
    const questionsCollection = db.collection("questions");

    let query;
    if (mode === "hotseat") {
      query = { lang: lang, category: "hotseat" };
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
      mode: mode || "standard"
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
