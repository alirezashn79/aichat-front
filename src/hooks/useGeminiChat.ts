import {
  ChatSession,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  type Content,
  type GenerationConfig,
  type InlineDataPart,
  type Part,
} from "@google/generative-ai";

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_PUBLIC_GEMINI_PUBLIC_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
  safetySettings: safetySetting,
});

export default model;
// اکسپورت تایپ‌ها برای استفاده در فایل‌های دیگر

// utils/fileUtils.ts

// فانکشن کمکی برای تشخیص نوع تصویر از محتوای فایل
function getMimeTypeFromFile(file: File): string {
  // اگر مرورگر نوع فایل را تشخیص داده، از آن استفاده کن
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }

  // تشخیص بر اساس پسوند فایل
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    return "image/jpeg";
  } else if (fileName.endsWith(".png")) {
    return "image/png";
  } else if (fileName.endsWith(".gif")) {
    return "image/gif";
  } else if (fileName.endsWith(".webp")) {
    return "image/webp";
  } else if (fileName.endsWith(".bmp")) {
    return "image/bmp";
  }

  // پیش‌فرض
  return "image/jpeg";
}

// فانکشن کمکی برای اعتبارسنجی فایل تصویر
export function isValidImageFile(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
  ];

  const mimeType = getMimeTypeFromFile(file);
  return validTypes.includes(mimeType);
}

// تایپ بازگشتی تابع به InlineDataPart تغییر یافته است
export async function fileToBase64(
  imageFile: File
): Promise<InlineDataPart | null> {
  if (!imageFile) return null;

  // بررسی اعتبار فایل تصویر
  if (!isValidImageFile(imageFile)) {
    throw new Error(
      "فقط فایل‌های تصویری پشتیبانی می‌شوند (JPEG, PNG, GIF, WebP, BMP)"
    );
  }

  // تشخیص نوع صحیح فایل
  const correctMimeType = getMimeTypeFromFile(imageFile);

  console.log("File info:", {
    name: imageFile.name,
    size: imageFile.size,
    type: imageFile.type,
    detectedType: correctMimeType,
  });

  // خواندن فایل و تبدیل به Base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: correctMimeType,
    },
  };
}

import { useState, useRef } from "react";
interface UseGeminiChatOptions {
  initialHistory?: Content[];
  generationConfig?: GenerationConfig;
}

export function useGeminiChat(options: UseGeminiChatOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تاریخچه پیش‌فرض با تایپ Content[] تعریف می‌شود

  const chatRef = useRef<ChatSession>(
    model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "اسم تو هوش مصتوعی علیرضا هست. از این به بعد هر کس درباره تو پرسید اینو بگو",
            },
          ],
        },
        ...(options.initialHistory ? options.initialHistory : []),
      ],
      generationConfig: options.generationConfig || {},
    })
  );

  const sendMessage = async (
    text: string,
    file?: File | null,
    onStream?: (chunk: string) => void
  ) => {
    if (!text.trim()) {
      throw new Error("متن پیام نمی‌تواند خالی باشد");
    }

    setIsLoading(true);
    setError(null);

    try {
      // تایپ parts به Part[] تغییر یافته است
      const parts: Part[] = [{ text: text }];

      // اگر فایل وجود داشت، آن را به parts اضافه کن
      if (file) {
        if (!isValidImageFile(file)) {
          throw new Error("لطفاً فقط فایل‌های تصویری انتخاب کنید");
        }

        const imageData = await fileToBase64(file);
        if (imageData) {
          parts.push(imageData);
        }
      }

      // ارسال پیام
      const result = await chatRef.current.sendMessageStream(parts);

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;

        if (onStream) {
          onStream(accumulatedText);
        }
      }

      return accumulatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطای نامشخص";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    chatRef.current = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "اسم تو هوش مصتوعی علیرضا هست. از این به بعد هر کس درباره اسم تو پرسید اینو بگو",
            },
          ],
        },
        ...(options.initialHistory ? options.initialHistory : []),
      ],
      generationConfig: options.generationConfig || {},
    });
    setError(null);
  };

  return {
    sendMessage,
    resetChat,
    isLoading,
    error,
  };
}
