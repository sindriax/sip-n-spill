import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import questionsEn from "../data/questions_en.json";
import questionsEs from "../data/questions_es.json";

type Category = "chill" | "spicy" | "unhinged";
type CategorizedQuestions = Record<Category, string[]>;

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("sip-n-spill");
    const collection = db.collection("questions");

    await collection.deleteMany({});

    const enQuestions = questionsEn as CategorizedQuestions;
    const esQuestions = questionsEs as CategorizedQuestions;

    const docs: { text: string; lang: string; category: Category }[] = [];

    for (const category of ["chill", "spicy", "unhinged"] as Category[]) {
      for (const question of enQuestions[category]) {
        docs.push({ text: question, lang: "en", category });
      }
    }

    for (const category of ["chill", "spicy", "unhinged"] as Category[]) {
      for (const question of esQuestions[category]) {
        docs.push({ text: question, lang: "es", category });
      }
    }

    await collection.insertMany(docs);

    const stats = {
      en: {
        chill: enQuestions.chill.length,
        spicy: enQuestions.spicy.length,
        unhinged: enQuestions.unhinged.length,
      },
      es: {
        chill: esQuestions.chill.length,
        spicy: esQuestions.spicy.length,
        unhinged: esQuestions.unhinged.length,
      },
    };

    console.log("✅ Questions inserted successfully!");
    console.log("\n📊 Question Stats:");
    console.log(`   English - Chill: ${stats.en.chill}, Spicy: ${stats.en.spicy}, Unhinged: ${stats.en.unhinged}`);
    console.log(`   Spanish - Chill: ${stats.es.chill}, Spicy: ${stats.es.spicy}, Unhinged: ${stats.es.unhinged}`);
    console.log(`   Total: ${docs.length} questions`);
  } catch (err) {
    console.error("❌ Failed to seed questions:", err);
  } finally {
    await client.close();
  }
}

seed();
