"use client";

import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./style.css";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { registerUser } from "@/services/authService";
import { ResponseData } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Register() {
  const router = useRouter();
  const toast = useRef<Toast | null>(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    checked: false,
  });

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const auth = useAuth();
  if (!auth) return null;
  const { refreshUser } = auth; // 🔴 ใช้ตัวนี้เท่านั้น

  const handleFormChang = (e: any) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  /* =====================================================
     🔴 FIXED SUBMIT LOGIC (FINAL)
     ===================================================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.checked) {
      showError("กรุณายอมรับเงื่อนไขในการให้บริการและนโยบายความเป็นส่วนตัว");
      return;
    }

    const { userName, email, password, confirmPassword } = formData;
    const newErrors: any = {};

    if (!userName) newErrors.userName = TextMessage.USERNAME_EMPTY;
    if (!email) newErrors.email = TextMessage.EMAIL_EMPTY;
    if (!password) newErrors.password = TextMessage.PASSWORD_EMPTY;
    if (!confirmPassword)
      newErrors.confirmPassword = TextMessage.CONFIRM_PASSWORD_EMPTY;

    if (userName && (userName.length < 3 || userName.length > 15)) {
      newErrors.userName = "Username ต้องมีความยาวระหว่าง 3–15 ตัวอักษร";
    }

    const usernameRegex = /[a-zA-Z]/;
    if (userName && !usernameRegex.test(userName)) {
      newErrors.userName = "Username ต้องมีตัวอักษร a–z อย่างน้อย 1 ตัว";
    }

    if (password && password.length < 8) {
      newErrors.password = "Password ต้องมีอย่างน้อย 8 ตัวอักษร";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = TextMessage.CONFIRM_PASSWORD_INVALID;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response: ResponseData = await registerUser(
        userName,
        email,
        password
      );

      if (response.status === 201) {
        showSuccess(response.message);

        // 🔴 sync auth จาก backend (จุดเดียว)
        await refreshUser();

        // 🔴 refresh RSC
        router.refresh();

        setErrors({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // 🔴 redirect หลัง state พร้อม
        setTimeout(() => {
          router.push("/users/account");
        }, 300);
      } else {
        showError(response.message);
      }
    } catch {
      showError("พบข้อผิดพลาดในระบบ");
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
      <Toast ref={toast} />

      <div className="container mx-auto mt-10">
        <h1 className="text-5xl mb-2 text-center text-white">REGISTER</h1>
        <h5 className="text-xl mb-3 text-center text-white">
          มาเริ่มต้นสัมผัสประสบการณ์ใหม่กับเราสิ!
        </h5>
        <hr style={{ color: "white", opacity: "40%" }} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto mt-10 flex flex-col gap-10">
          {/* USERNAME */}
          <div
            className="p-6 rounded-4xl"
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
          >
            <label className="text-white">USERNAME / ชื่อผู้ใช้</label>
            <InputText
              name="userName"
              className={`!bg-[#d9d9d929] !text-white ${
                errors.userName ? "!border-red-400" : "!border-0"
              }`}
              onChange={handleFormChang}
            />
          </div>

          {/* EMAIL */}
          <div
            className="p-6 rounded-4xl"
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
          >
            <label className="text-white">EMAIL / อีเมล</label>
            <InputText
              type="email"
              name="email"
              className={`!bg-[#d9d9d929] !text-white ${
                errors.email ? "!border-red-400" : "!border-0"
              }`}
              onChange={handleFormChang}
            />
          </div>

          {/* PASSWORD */}
          <div
            className="p-6 rounded-4xl"
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
          >
            <label className="text-white">PASSWORD / รหัสผ่าน</label>
            <InputText
              type="password"
              name="password"
              className={`!bg-[#d9d9d929] !text-white ${
                errors.password ? "!border-red-400" : "!border-0"
              }`}
              onChange={handleFormChang}
            />
          </div>

          {/* CONFIRM */}
          <div
            className="p-6 rounded-4xl"
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
          >
            <label className="text-white">CONFIRM PASSWORD</label>
            <InputText
              type="password"
              name="confirmPassword"
              className={`!bg-[#d9d9d929] !text-white ${
                errors.confirmPassword ? "!border-red-400" : "!border-0"
              }`}
              onChange={handleFormChang}
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              checked={formData.checked}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  checked: e.checked ?? false,
                }))
              }
            />
            <span className="ml-2 text-white text-sm">
              ยอมรับ{" "}
              <span
                onClick={() => setShowTerms(true)}
                className="underline cursor-pointer text-blue-300"
              >
                เงื่อนไข
              </span>{" "}
              และ{" "}
              <span
                onClick={() => setShowPrivacy(true)}
                className="underline cursor-pointer text-blue-300"
              >
                นโยบายความเป็นส่วนตัว
              </span>
            </span>
          </div>
        </div>

        <div className="px-150 my-10">
          <Button
            type="submit"
            label="สร้างบัญชี"
            disabled={!formData.checked}
          />
        </div>
      </form>

      <Dialog
        header="เงื่อนไขในการให้บริการ"
        visible={showTerms}
        onHide={() => setShowTerms(false)}
      />
      <Dialog
        header="นโยบายความเป็นส่วนตัว"
        visible={showPrivacy}
        onHide={() => setShowPrivacy(false)}
      />
    </>
  );
}
