/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */

import { NextRequest } from "next/server";

// Mock MongoDB before importing the route
jest.mock("mongodb", () => {
  const mockToArray = jest.fn();
  const mockProject = jest.fn(() => ({ toArray: mockToArray }));
  const mockFind = jest.fn(() => ({ project: mockProject }));
  const mockCollection = jest.fn(() => ({ find: mockFind }));
  const mockDb = jest.fn(() => ({ collection: mockCollection }));
  const mockConnect = jest.fn(() => Promise.resolve({ db: mockDb }));
  const mockMongoClient = jest.fn(() => ({ connect: mockConnect }));

  return {
    MongoClient: Object.assign(mockMongoClient, {
      prototype: { connect: mockConnect },
    }),
    ServerApiVersion: { v1: "1" },
    __mockToArray: mockToArray,
    __mockFind: mockFind,
    __mockCollection: mockCollection,
    __mockDb: mockDb,
  };
});

// Set environment variable before importing the route
process.env.MONGODB_URI = "mongodb://test:test@localhost:27017";

describe("GET /api/questions", () => {
  let GET: (req: NextRequest) => Promise<Response>;
  let mockToArray: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();

    // Re-import to get fresh mocks
    const mongodb = require("mongodb");
    mockToArray = mongodb.__mockToArray;

    // Default mock return value
    mockToArray.mockResolvedValue([
      { text: "Question 1" },
      { text: "Question 2" },
      { text: "Question 3" },
    ]);

    // Import the route handler
    const route = await import("../../app/api/questions/route");
    GET = route.GET;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return questions with default parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/questions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.questions).toHaveLength(3);
    expect(data.categories).toContain("spicy");
    expect(data.mode).toBe("standard");
  });

  it("should return questions for specified language", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?lang=en"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.questions).toBeDefined();
  });

  it("should return questions for specified category", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?categories=chill"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toContain("chill");
  });

  it("should return questions for multiple categories", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?categories=chill,spicy"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toContain("chill");
    expect(data.categories).toContain("spicy");
  });

  it("should return questions for hotseat mode", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?mode=hotseat"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mode).toBe("hotseat");
    expect(data.categories).toContain("hotseat");
  });

  it("should return questions for classic mode", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?mode=classic"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.questions).toBeDefined();
  });

  it("should handle invalid language gracefully", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?lang=invalid"
    );
    const response = await GET(request);
    const data = await response.json();

    // Should default to Spanish
    expect(response.status).toBe(200);
    expect(data.questions).toBeDefined();
  });

  it("should handle invalid category gracefully", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?categories=invalid"
    );
    const response = await GET(request);
    const data = await response.json();

    // Should default to spicy
    expect(response.status).toBe(200);
    expect(data.categories).toContain("spicy");
  });

  it("should sanitize potentially malicious input", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?lang=<script>alert('xss')</script>"
    );
    const response = await GET(request);

    // Should not crash and should return valid response
    expect(response.status).toBe(200);
  });

  it("should handle database errors gracefully", async () => {
    mockToArray.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost:3000/api/questions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toContain("Failed to load questions");
  });

  it("should handle empty results", async () => {
    mockToArray.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost:3000/api/questions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.questions).toHaveLength(0);
  });

  it("should support category alias parameter", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/questions?category=unhinged"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toContain("unhinged");
  });
});
