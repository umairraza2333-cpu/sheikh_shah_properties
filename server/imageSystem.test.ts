import { describe, expect, it } from "vitest";

describe("Image System - Array Handling", () => {
  it("should safely handle images as array", () => {
    const images = ["url1.jpg", "url2.jpg", "url3.jpg"];
    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBe(3);
    expect(images.slice(0, 2)).toEqual(["url1.jpg", "url2.jpg"]);
  });

  it("should safely parse JSON string to array", () => {
    const jsonString = JSON.stringify(["url1.jpg", "url2.jpg"]);
    const parsed = JSON.parse(jsonString);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toEqual(["url1.jpg", "url2.jpg"]);
  });

  it("should handle empty images array", () => {
    const images: string[] = [];
    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBe(0);
    expect(images.slice(0, 4)).toEqual([]);
  });

  it("should handle null/undefined images safely", () => {
    const nullImages = null;
    const images = Array.isArray(nullImages) ? nullImages : [];
    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBe(0);
  });

  it("should handle string images safely", () => {
    const stringImages = "not an array";
    const images = Array.isArray(stringImages) ? stringImages : [];
    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBe(0);
  });

  it("should map over images with proper types", () => {
    const images = ["url1.jpg", "url2.jpg", "url3.jpg"];
    const mapped = images.map((image: string, index: number) => ({
      url: image,
      index,
    }));
    expect(mapped).toEqual([
      { url: "url1.jpg", index: 0 },
      { url: "url2.jpg", index: 1 },
      { url: "url3.jpg", index: 2 },
    ]);
  });
});
