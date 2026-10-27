import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/lib/auth/guard";
import { storageService } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    await requireStaffOrAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF are permitted." },
        { status: 400 }
      );
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 5MB size limit." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await storageService.uploadFile({
      buffer,
      fileName: file.name,
      mimeType: file.type,
      folder,
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
      sizeBytes: uploadResult.sizeBytes,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "File upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
