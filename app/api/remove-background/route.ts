
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

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

    const buffer = Buffer.from(await image.arrayBuffer());

    const uploaded: any = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "ai-product-studio/background-remover",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      upload.end(buffer);
    });

    const transparentUrl = cloudinary.url(uploaded.public_id, {
      secure: true,
      format: "png",
      transformation: [
        { effect: "background_removal" },
      ],
    });

    return NextResponse.json({
      originalUrl: uploaded.secure_url,
      transparentUrl,
    });
  } catch (error) {
    console.error("Background removal error:", error);

    return NextResponse.json(
      {
        error:
          "Background removal failed. Check your Cloudinary account and try again.",
      },
      { status: 500 }
    );
  }
}