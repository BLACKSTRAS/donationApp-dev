import { ResponseData } from "@/constants/models";
import { API_BASEURL } from "@/constants/api";

/* =====================================================
   Register
   ===================================================== */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<ResponseData> {
  const payload = {
    username,
    email,
    password,
  };

  const response = await fetch(`${API_BASEURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // 🔑 cookie ข้ามโดเมน
  });

  return response.json();
}

/* =====================================================
   Login
   ===================================================== */
export async function loginUser(
  username: string,
  password: string
): Promise<ResponseData> {
  const payload = {
    username,
    password,
  };

  const response = await fetch(`${API_BASEURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // 🔑 cookie ข้ามโดเมน
  });

  return response.json();
}

/* =====================================================
   Logout
   ===================================================== */
export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASEURL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.warn(
      "⚠ Backend logout failed, force client logout",
      error
    );
  } finally {
    handleClientLogout();
  }
}

/* =====================================================
   Client-side cleanup
   ===================================================== */
const handleClientLogout = () => {
  localStorage.clear();
  sessionStorage.clear();

  // ลบ cookie ฝั่ง client (เผื่อกรณี fallback)
  document.cookie =
    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
