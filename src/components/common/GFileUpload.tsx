"use client";

import React, { useState, useCallback } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/global.utils";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { uploadFile } from "@/service/upload.service";
import { toast } from "sonner";

type IFormProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  folder?: string;
  className?: string;
  showPreview?: boolean;
};

function FormFileUpload<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  required,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  folder,
  className,
  showPreview = true,
}: IFormProps<T>) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(
    async (file: File | null, onChange: (value: string) => void) => {
      if (!file) {
        onChange("");
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      // Validate file type
      if (accept && !file.type.match(new RegExp(accept.replace("*", ".*")))) {
        toast.error(`File type not allowed. Accepted: ${accept}`);
        return;
      }

      setUploading(true);
      try {
        const result = await uploadFile(file, folder);
        onChange(result.url);
        toast.success("File uploaded successfully");
      } catch (error) {
        toast.error(String(error));
      } finally {
        setUploading(false);
      }
    },
    [maxSize, accept, folder]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value as string;
        const hasFile = !!value;

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label} {required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}

            <div className="space-y-3">
              {/* File input area */}
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input p-6 transition-colors",
                  "hover:border-primary/50 hover:bg-primary/5",
                  disabled && "pointer-events-none opacity-50",
                  hasFile && "border-solid border-primary/30"
                )}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Uploading...
                    </p>
                  </div>
                ) : hasFile ? (
                  <div className="flex flex-col items-center gap-3">
                    {showPreview && value.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                      <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                        <img
                          src={value}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute right-1 top-1 h-6 w-6"
                          onClick={() => field.onChange("")}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
                        <span className="text-sm font-medium">
                          File uploaded
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => field.onChange("")}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <p className="max-w-full truncate text-xs text-muted-foreground">
                      {value}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = accept;
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            handleFileChange(file, field.onChange);
                          }
                        };
                        input.click();
                      }}
                      disabled={disabled}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="mb-1 text-sm font-medium">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {accept === "image/*"
                        ? "PNG, JPG, GIF up to 5MB"
                        : `Files up to ${maxSize / 1024 / 1024}MB`}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = accept;
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            handleFileChange(file, field.onChange);
                          }
                        };
                        input.click();
                      }}
                      disabled={disabled}
                    >
                      Select File
                    </Button>
                  </>
                )}

                {/* Hidden file input for drag and drop */}
                <input
                  type="file"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  accept={accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(file, field.onChange);
                    }
                  }}
                  disabled={disabled || uploading}
                />
              </div>

              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}

const GFileUpload = {
  Form: FormFileUpload,
};

export default GFileUpload;