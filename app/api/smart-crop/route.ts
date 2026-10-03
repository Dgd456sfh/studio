
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Please upload an image." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const allowedSizes = [
      { width: 1080, height: 1080 },
      { width: 1080, height: 1350 },
      { width: 1200, height: 628 },
      { width: 1080, height: 1920 },
    ];

    const validSize = allowedSizes.some(
      (size) => size.width === width && size.height === height
    );

    if (!validSize) {
      return NextResponse.json(
        { error: "Please select a supported crop size." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    const uploaded: any = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "ai-product-studio/smart-crop",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      upload.end(buffer);
    });

    const croppedUrl = cloudinary.url(uploaded.public_id, {
      secure: true,
      transformation: [
        {
          width,
          height,
          crop: "fill",
          gravity: "auto",
        },
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });

    return NextResponse.json({
      originalUrl: uploaded.secure_url,
      croppedUrl,
      width,
      height,
    });
  } catch (error) {
    console.error("Smart crop error:", error);

    return NextResponse.json(
      { error: "Image cropping failed. Please try again." },
      { status: 500 }
    );
  }
}