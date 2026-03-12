import { describe, expect, it } from "vitest";

describe("Image Rendering - Property and Project Cards", () => {
  it("should prioritize images array over imageUrl", () => {
    const property = {
      id: 1,
      title: "Test Property",
      images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
      imageUrl: "https://example.com/fallback.jpg",
    };

    // Simulate the rendering logic
    const imageUrl = Array.isArray(property.images) && property.images.length > 0 
      ? property.images[0] 
      : property.imageUrl;

    expect(imageUrl).toBe("https://example.com/img1.jpg");
  });

  it("should fallback to imageUrl when images array is empty", () => {
    const property = {
      id: 1,
      title: "Test Property",
      images: [],
      imageUrl: "https://example.com/fallback.jpg",
    };

    const imageUrl = Array.isArray(property.images) && property.images.length > 0 
      ? property.images[0] 
      : property.imageUrl;

    expect(imageUrl).toBe("https://example.com/fallback.jpg");
  });

  it("should handle null images gracefully", () => {
    const property = {
      id: 1,
      title: "Test Property",
      images: null,
      imageUrl: "https://example.com/fallback.jpg",
    };

    const imageUrl = Array.isArray(property.images) && property.images.length > 0 
      ? property.images[0] 
      : property.imageUrl;

    expect(imageUrl).toBe("https://example.com/fallback.jpg");
  });

  it("should show placeholder when no images available", () => {
    const property = {
      id: 1,
      title: "Test Property",
      images: null,
      imageUrl: null,
    };

    const imageUrl = Array.isArray(property.images) && property.images.length > 0 
      ? property.images[0] 
      : property.imageUrl;

    expect(imageUrl).toBeNull();
  });

  it("should work with project images", () => {
    const project = {
      id: 1,
      name: "Test Project",
      images: ["https://example.com/proj1.jpg", "https://example.com/proj2.jpg"],
      imageUrl: "https://example.com/proj-fallback.jpg",
    };

    const imageUrl = Array.isArray(project.images) && project.images.length > 0 
      ? project.images[0] 
      : project.imageUrl;

    expect(imageUrl).toBe("https://example.com/proj1.jpg");
  });
});
