"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageProcessor() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processImage = async (file: File) => {
    try {
      setIsLoading(true);
      setResult("");

      const formData = new FormData();
      formData.append("image", file);
      formData.append(
        "prompt",
        `You are an AI vision system with exceptional attention to detail. Analyze this image 
   and create a comprehensive, detailed description that captures every significant visual element.
   
   Thoroughly observe and integrate:
   - Primary subject: identity, pose, expression, clothing, distinctive features
   - Environmental details: setting, furniture, decorative elements, plants, textures
   - Spatial dynamics: depth, perspective, positioning, scale relationships
   - Light characteristics: direction, intensity, shadows, reflections, time of day
   - Color nuances: primary palette, subtle tones, color interactions, gradients
   - Atmospheric elements: mood, energy, emotional quality, environmental feeling
   - Textural qualities: surface details, material properties, patterns
   - Compositional subtleties: balance, focus points, visual flow, framing
   
   Combine these observations into 2-3 flowing, connected sentences. Maintain natural 
   language while being specific and detailed. Focus on visual elements that build a 
   complete scene. Move from main elements to subtle details, creating a rich but 
   coherent description.
   
   Provide only the detailed description - no style instructions or technical terms.`
      );

      const response = await fetch("/api/generate/stream", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process image");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        setResult((prev) => prev + text);
      }
    } catch (error: any) {
      console.error("Error processing image:", error);
      setResult(error.message || "Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        await processImage(file);
      }
    },
  });

  const resetAll = () => {
    setResult("");
    setPreview(null);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Image Analysis</h2>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-white hover:bg-gray-100 
            text-gray-800 rounded-lg transition-colors 
            flex items-center gap-2 border border-gray-200
            shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 h-[600px]">
        <div className="col-span-1 h-full">
          <div
            {...getRootProps()}
            className={`h-full border-2 border-dashed rounded-lg 
              flex flex-col items-center justify-center
              transition-colors cursor-pointer
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
              bg-opacity-90 backdrop-blur-sm`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="h-full w-full p-4 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-white text-lg mb-2 font-medium bg-gray-800 bg-opacity-75 px-4 py-2 rounded-lg">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-gray-200 text-sm mt-2">
                  Supported formats: PNG, JPG, JPEG, GIF
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 h-full">
          <textarea
            value={result}
            readOnly
            className="w-full h-full p-4 border rounded-lg 
              resize-none focus:outline-none focus:ring-2 focus:ring-blue-500
              text-white text-base bg-gray-800 bg-opacity-90
              shadow-lg border-gray-700"
            placeholder="Generated text will appear here..."
            style={{
              lineHeight: "1.5",
            }}
          />
        </div>
      </div>
    </div>
  );
}
