"use client";

import { InputText } from "primereact/inputtext";
import "./style.css";
import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { loginUser } from "@/services/authService";
import { ResponseData } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Login() {
  const router = useRouter();
  const toast = useRef<Toast | null>(null);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [error, setError] = useState({
    userNameError: "",
    passwordError: "",
  });

  const auth = useAuth();
  if (!auth) return null;
  const { refreshUser, user, loading } = auth;

  useEffect(() => {
    if (!loading && user) {
      router.replace("/users/account");
    }
  }, [user, loading, router]);

  const handleFormChang = (e: any) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  /* =====================================================
     🔴 FIXED LOGIN LOGIC (FINAL)
     ===================================================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { userName, password } = formData;

    if (!userName || !password) {
      showError("กรุณากรอกข้อมูลให้ครบถ้วน");

      setError({
        userNameError: !userName ? TextMessage.USERNAME_EMPTY : "",
        passwordError: !password ? TextMessage.PASSWORD_EMPTY : "",
      });

      return;
    }

    try {
      const response: ResponseData = await loginUser(userName, password);

      if (response.status === 200) {
        showSuccess(response.message);
        setError({ userNameError: "", passwordError: "" });

        // 🔴 sync auth state จาก backend (จุดเดียว)
        await refreshUser();

        // 🔴 refresh RSC
        router.refresh();

        // 🔴 redirect หลัง state พร้อม
        setTimeout(() => {
          router.push("/users/account");
        }, 300);
      } else {
        showError(response.message);
      }
    } catch (err: any) {
      showError(err?.message || "พบข้อผิดพลาดในระบบ");
    }
  };

  const showError = (errorMessage?: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage ?? "",
      life: 3000,
    });
  };

  const showSuccess = (sucessMessage?: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: sucessMessage ?? "",
      life: 3000,
    });
  };

  return (
    <>
      <div className="min-h-screen w-full">
        <Toast ref={toast} />

        <div className="container mx-auto mt-10">
          <h1 className="text-5xl mb-2 text-center text-white">LOGIN</h1>
          <h5 className="text-xl mb-3 text-center text-white">
            มาทำงานของคุณต่อกันเถอะ!
          </h5>
          <hr style={{ color: "white", opacity: "40%" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="container mx-auto mt-10 flex flex-col gap-10">
            {/* USERNAME */}
            <div
              className="p-6 rounded-4xl"
              style={{
                backgroundColor: "#3A4B62",
                border: "1px solid #868B93",
              }}
            >
              <label className="text-white">USERNAME / ชื่อผู้ใช้</label>
              <InputText
                name="userName"
                value={formData.userName}
                onChange={(e) => {
                  handleFormChang(e);
                  if (e.target.value.trim()) {
                    setError((prev) => ({
                      ...prev,
                      userNameError: "",
                    }));
                  }
                }}
                className={`!bg-[#d9d9d929] !text-white ${
                  error.userNameError ? "!border-red-400" : "!border-0"
                }`}
                tooltip={error.userNameError}
              />
            </div>

            {/* PASSWORD */}
            <div
              className="p-6 rounded-4xl"
              style={{
                backgroundColor: "#3A4B62",
                border: "1px solid #868B93",
              }}
            >
              <label className="text-white">PASSWORD / รหัสผ่าน</label>
              <InputText
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleFormChang(e);
                  if (e.target.value.trim()) {
                    setError((prev) => ({
                      ...prev,
                      passwordError: "",
                    }));
                  }
                }}
                className={`!bg-[#d9d9d929] !text-white ${
                  error.passwordError ? "!border-red-400" : "!border-0"
                }`}
                tooltip={error.passwordError}
              />
            </div>

            <div className="text-right">
              <Link
                href="#"
                className="underline mr-2 text-gray-300 hover:text-white"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              type="submit"
              className="bg-[#f8f0f0c4] py-5 px-15 rounded-full text-2xl transition duration-400 hover:bg-[#f8f0f08e] hover:scale-90"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
