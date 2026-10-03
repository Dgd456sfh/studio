
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

type JsonObject = Record<string, unknown>;

function findImageUrl(value: unknown, depth = 0): string | null {
  if (depth > 8 || value === null || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findImageUrl(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  const obj = value as JsonObject;

  // Check likely image URL fields first.
  const urlKeys = [
    "secure_url",
    "secureUrl",
    "image_url",
    "imageUrl",
    "delivery_url",
    "deliveryUrl",
    "url",
    "uri",
  ];

  for (const key of urlKeys) {
    const candidate = obj[key];

    if (typeof candidate === "string") {
      try {
        const parsed = new URL(candidate);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
          return parsed.toString();
        }
      } catch {
        // Ignore malformed URLs.
      }
    }
  }

  // Search nested asset objects.
  for (const [key, child] of Object.entries(obj)) {
    if (key.toLowerCase().includes("error")) continue;

    const found = findImageUrl(child, depth + 1);
    if (found) return found;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary credentials are missing in .env.local.",
        },
        { status: 500 }
      );
    }

    let body: JsonObject;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    const prompt =
      typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Please enter an ad prompt." },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Prompt must be 1000 characters or less." },
        { status: 400 }
      );
    }

    const finalPrompt =
      `Create a professional commercial product advertisement image. ${prompt}. ` +
      "Premium product photography, studio lighting, polished composition, " +
      "realistic details, clean background, visually appealing brand campaign.";

    const credentials = Buffer.from(
      `${apiKey}:${apiSecret}`
    ).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v2/generate/${encodeURIComponent(cloudName)}/text_to_image`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          model: {
            mode: "auto",
            preference: "economy",
          },
          image_size: {
            aspect_ratio: "1:1",
            resolution: "1K",
          },
          target: {
            target_type: "managed_asset",
            public_id: `generated-ads/ad-${crypto.randomUUID()}`,
          },
        }),
        signal: AbortSignal.timeout(110000),
      }
    );

    const responseText = await response.text();

    let result: JsonObject;

    try {
      result = JSON.parse(responseText) as JsonObject;
    } catch {
      console.error(
        "Cloudinary returned a non-JSON response:",
        responseText.slice(0, 2000)
      );

      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary returned an unexpected response.",
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error(
        "Cloudinary generation failed:",
        JSON.stringify(result, null, 2)
      );

      const errorObj =
        result.error && typeof result.error === "object"
          ? (result.error as JsonObject)
          : {};

      const detail =
        (typeof errorObj.message === "string" && errorObj.message) ||
        (typeof result.message === "string" && result.message) ||
        "Image generation failed.";

      return NextResponse.json(
        {
          success: false,
          error:
            response.status === 402 || response.status === 403
              ? "Cloudinary image generation is unavailable or your allowance is exhausted. Check your add-on plan and usage."
              : detail,
        },
        {
          status:
            response.status === 401 ||
            response.status === 403 ||
            response.status === 429
              ? response.status
              : 502,
        }
      );
    }

    const data =
      result.data && typeof result.data === "object"
        ? (result.data as JsonObject)
        : {};

    const assets = Array.isArray(data.assets) ? data.assets : [];
    const asset = assets[0] as JsonObject | string | undefined;

    const imageUrl = findImageUrl(asset);

    if (!imageUrl) {
      console.error(
        "Cloudinary response has no recognized image URL:",
        JSON.stringify(result, null, 2)
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary returned an asset, but no recognized image URL. Check the terminal response details.",
        },
        { status: 502 }
      );
    }

    const publicId =
      asset && typeof asset === "object" &&
      typeof asset.public_id === "string"
        ? asset.public_id
        : null;

    return NextResponse.json({
      success: true,
      message: "Ad image generated successfully.",
      imageUrl,
      publicId,
    });
  } catch (error: unknown) {
    console.error("Cloudinary ad generation error:", error);

    if (
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        error.message.toLowerCase().includes("timeout"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Image generation took too long. Please try again.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to generate the image. Please check your connection and try again.",
      },
      { status: 500 }
    );
  }
}