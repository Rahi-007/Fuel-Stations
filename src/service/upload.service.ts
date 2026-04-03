import axios from "axios";
import { API_URLS } from "@/config/configURL";

export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

/**
 * Upload a file to the server
 * @param file File to upload
 * @param folder Optional folder name in Cloudinary
 * @returns UploadResponse with URL
 */
export async function uploadFile(
  file: File,
  folder?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder);
  }

  const { data } = await axios.post<UploadResponse>(
    API_URLS.upload.single(),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

/**
 * Upload multiple files
 * @param files Array of files
 * @param folder Optional folder name
 * @returns Array of UploadResponse
 */
export async function uploadMultipleFiles(
  files: File[],
  folder?: string
): Promise<UploadResponse[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  if (folder) {
    formData.append("folder", folder);
  }

  const { data } = await axios.post<UploadResponse[]>(
    API_URLS.upload.multiple(),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}