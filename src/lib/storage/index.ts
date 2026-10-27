import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  mimeType: string;
}

export class StorageService {
  private s3Client: S3Client | null = null;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET || "";
    this.publicUrl = process.env.STORAGE_PUBLIC_URL || "";

    const endpoint = process.env.STORAGE_ENDPOINT;
    const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
    const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: "auto",
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  isRemoteConfigured(): boolean {
    return Boolean(this.s3Client && this.bucket);
  }

  /**
   * Uploads a buffer or file to Cloudflare R2 / S3 or local public storage in development.
   */
  async uploadFile(params: {
    buffer: Buffer;
    fileName: string;
    mimeType: string;
    folder?: string;
  }): Promise<UploadResult> {
    const extension = path.extname(params.fileName);
    const baseName = path.basename(params.fileName, extension).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueKey = `${params.folder || "products"}/${baseName}_${Date.now()}${extension}`;

    if (this.isRemoteConfigured() && this.s3Client) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: uniqueKey,
          Body: params.buffer,
          ContentType: params.mimeType,
        })
      );

      const url = this.publicUrl
        ? `${this.publicUrl.replace(/\/$/, "")}/${uniqueKey}`
        : `https://${this.bucket}.r2.cloudflarestorage.com/${uniqueKey}`;

      return {
        url,
        key: uniqueKey,
        sizeBytes: params.buffer.length,
        mimeType: params.mimeType,
      };
    }

    // Local filesystem fallback for development
    const localDir = path.join(process.cwd(), "public", "uploads", params.folder || "products");
    await fs.mkdir(localDir, { recursive: true });

    const localFileName = `${baseName}_${Date.now()}${extension}`;
    const localFilePath = path.join(localDir, localFileName);
    await fs.writeFile(localFilePath, params.buffer);

    return {
      url: `/uploads/${params.folder || "products"}/${localFileName}`,
      key: uniqueKey,
      sizeBytes: params.buffer.length,
      mimeType: params.mimeType,
    };
  }
}

export const storageService = new StorageService();
