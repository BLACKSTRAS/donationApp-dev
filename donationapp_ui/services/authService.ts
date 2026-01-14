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
  const payload = { username, email, password };

  const response = await fetch(`${API_BASEURL}/api/auth/register`, {
    method: "POST",
    credentials: "include", // ⭐ cookie ข้ามโดเมน
    cache: "no-store", // 🔴 ห้าม cache (สำคัญมาก)
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Register failed");
  }

  return data;
}

/* =====================================================
   Login
   ===================================================== */
export async function loginUser(
  username: string,
  password: string
): Promise<ResponseData> {
  const payload = { username, password };

  const response = await fetch(`${API_BASEURL}/api/auth/login`, {
    method: "POST",
    credentials: "include", // ⭐ สำคัญที่สุด
    cache: "no-store", // 🔴 ห้าม cache
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
}

/* =====================================================
   Logout
   ===================================================== */
export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASEURL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      cache: "no-store", // 🔴 ปิด cache
    });
  } catch (error) {
    console.warn("⚠ Backend logout failed, force client logout", error);
  } finally {
    handleClientLogout();
  }
}

/* =====================================================
   Client-side cleanup
   ===================================================== */
const handleClientLogout = () => {
  // ล้าง client state
  localStorage.clear();
  sessionStorage.clear();

  /**
   * ❗ หมายเหตุ:
   * cookie token เป็น httpOnly → JS ลบไม่ได้
   * บรรทัดนี้มีไว้เผื่อ dev / legacy เท่านั้น
   */
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
