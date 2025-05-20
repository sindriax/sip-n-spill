import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import questionsEn from "../data/questions_en.json";
import questionsEs from "../data/questions_es.json";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("sip-n-spill");
    const collection = db.collection("questions");

    await collection.deleteMany({});

    const docs = [
      ...questionsEn.map((q) => ({ text: q, lang: "en" })),
      ...questionsEs.map((q) => ({ text: q, lang: "es" })),
    ];

    await collection.insertMany(docs);
    console.log("✅ Questions inserted successfully!");
  } catch (err) {
    console.error("❌ Failed to seed questions:", err);
  } finally {
    await client.close();
  }
}

seed();
