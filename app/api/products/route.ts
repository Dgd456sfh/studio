
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { Readable } from "stream";

export const runtime = "nodejs";

// GET: Fetch products
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Upload image to Cloudinary
function uploadToCloudinary(
  buffer: Buffer
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ai-product-studio" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

// POST: Upload product
export async function POST(request: NextRequest) {
  let uploadedPublicId: string | null = null;

  try {
    await connectDB();

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const price = Number(formData.get("price"));
    const userId = String(formData.get("userId") || "");
    const image = formData.get("image");

    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Enter a valid name and price" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please select a product image" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "File must be an image" },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image must be under 5 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadedImage = await uploadToCloudinary(buffer);
    uploadedPublicId = uploadedImage.public_id;

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product uploaded successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST product error:", error);

    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup error:", cleanupError);
      }
    }

    return NextResponse.json(
      { success: false, message: "Product upload failed. Check server logs." },
      { status: 500 }
    );
  }
}