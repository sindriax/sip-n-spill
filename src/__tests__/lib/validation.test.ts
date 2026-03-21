import {
  sanitizeString,
  validateLanguage,
  validateCategories,
  validateMode,
  validateQueryParams,
  VALID_LANGUAGES,
  VALID_CATEGORIES,
} from "../../app/lib/validation";

describe("validation utilities", () => {
  describe("sanitizeString", () => {
    it("should trim whitespace", () => {
      expect(sanitizeString("  hello  ")).toBe("hello");
    });

    it("should respect maxLength", () => {
      expect(sanitizeString("hello world", 5)).toBe("hello");
    });

    it("should remove dangerous characters", () => {
      expect(sanitizeString("<script>alert('xss')</script>")).toBe(
        "scriptalert(xss)/script"
      );
      expect(sanitizeString("test'\"&<>")).toBe("test");
    });

    it("should handle empty strings", () => {
      expect(sanitizeString("")).toBe("");
    });
  });

  describe("validateLanguage", () => {
    it("should return valid languages", () => {
      expect(validateLanguage("en")).toBe("en");
      expect(validateLanguage("es")).toBe("es");
    });

    it("should default to es for invalid languages", () => {
      expect(validateLanguage("fr")).toBe("es");
      expect(validateLanguage("invalid")).toBe("es");
    });

    it("should default to es for null", () => {
      expect(validateLanguage(null)).toBe("es");
    });

    it("should be case insensitive", () => {
      expect(validateLanguage("EN")).toBe("en");
      expect(validateLanguage("ES")).toBe("es");
    });
  });

  describe("validateCategories", () => {
    it("should return valid single category", () => {
      expect(validateCategories("chill")).toEqual(["chill"]);
      expect(validateCategories("spicy")).toEqual(["spicy"]);
      expect(validateCategories("unhinged")).toEqual(["unhinged"]);
    });

    it("should return multiple valid categories", () => {
      expect(validateCategories("chill,spicy")).toEqual(["chill", "spicy"]);
      expect(validateCategories("chill, spicy, unhinged")).toEqual([
        "chill",
        "spicy",
        "unhinged",
      ]);
    });

    it("should filter out invalid categories", () => {
      expect(validateCategories("chill,invalid,spicy")).toEqual([
        "chill",
        "spicy",
      ]);
    });

    it("should default to spicy for null", () => {
      expect(validateCategories(null)).toEqual(["spicy"]);
    });

    it("should default to spicy for all invalid categories", () => {
      expect(validateCategories("invalid,notreal")).toEqual(["spicy"]);
    });

    it("should be case insensitive", () => {
      expect(validateCategories("CHILL,SPICY")).toEqual(["chill", "spicy"]);
    });
  });

  describe("validateMode", () => {
    it("should return valid modes", () => {
      expect(validateMode("classic")).toBe("classic");
      expect(validateMode("standard")).toBe("standard");
      expect(validateMode("hotseat")).toBe("hotseat");
    });

    it("should return null for invalid modes", () => {
      expect(validateMode("invalid")).toBeNull();
    });

    it("should return null for null input", () => {
      expect(validateMode(null)).toBeNull();
    });

    it("should be case insensitive", () => {
      expect(validateMode("HOTSEAT")).toBe("hotseat");
    });
  });

  describe("validateQueryParams", () => {
    it("should validate all parameters together", () => {
      const params = new URLSearchParams("lang=en&categories=chill,spicy&mode=hotseat");
      const result = validateQueryParams(params);

      expect(result.lang).toBe("en");
      expect(result.categories).toEqual(["chill", "spicy"]);
      expect(result.mode).toBe("hotseat");
    });

    it("should handle missing parameters with defaults", () => {
      const params = new URLSearchParams("");
      const result = validateQueryParams(params);

      expect(result.lang).toBe("es");
      expect(result.categories).toEqual(["spicy"]);
      expect(result.mode).toBeNull();
    });

    it("should handle category alias", () => {
      const params = new URLSearchParams("category=chill");
      const result = validateQueryParams(params);

      expect(result.categories).toEqual(["chill"]);
    });
  });

  describe("constants", () => {
    it("should have expected valid languages", () => {
      expect(VALID_LANGUAGES).toContain("en");
      expect(VALID_LANGUAGES).toContain("es");
    });

    it("should have expected valid categories", () => {
      expect(VALID_CATEGORIES).toContain("chill");
      expect(VALID_CATEGORIES).toContain("spicy");
      expect(VALID_CATEGORIES).toContain("unhinged");
      expect(VALID_CATEGORIES).toContain("hotseat");
    });
  });
});
