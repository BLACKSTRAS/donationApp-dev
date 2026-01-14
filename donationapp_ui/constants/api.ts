/**
 * Base URL สำหรับเรียก Backend API
 * ต้องตั้ง NEXT_PUBLIC_API_URL ใน Vercel / .env
 */
export const API_BASEURL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error(
      "❌ NEXT_PUBLIC_API_URL is not defined. Please set it in environment variables."
    );
  }

  return url;
})();
