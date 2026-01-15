"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./style.css";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { loginUser } from "@/services/authService";
import { ResponseData } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";
import { Tooltip } from "primereact/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/uers/userInfo";
import { useAuth } from "@/components/AuthProvider";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();
  const toast = useRef<Toast | null>(null);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [error, setError] = useState({
    userNameError: "",
    passwordError: "",
  });

  const handleFormChang = async (e: any) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userName, password } = formData;
    if (!userName || !password) {
      showError("กรุณากรอกข้อมูลให้ครบถ้วน");
      if (!userName) {
        setError((prev) => ({
          ...prev,
          userNameError: TextMessage.USERNAME_EMPTY,
        }));
      }
      if (!password) {
        setError((prev) => ({
          ...prev,
          passwordError: TextMessage.PASSWORD_EMPTY,
        }));
      }
      return;
    }
    try {
      const response: ResponseData = await loginUser(userName, password);
      if (response.status === 200) {
        const userData = await getUserInfo();
        setUser(userData);
        showSuccess(response.message);
        setError({ userNameError: "", passwordError: "" });
        if (userData.role === "admin") {
          router.push("/admin/");
        } else {
          router.push("/users/account");
        }
      } else {
        showError(response.message);
      }
    } catch (err: any) {
      showError(err.message || "พบข้อผิดพลาดในระบบ");
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
      <div className=" min-h-screen w-full">
        <Toast ref={toast} />
        <div className="container mx-auto mt-10 ">
          <h1 className="text-5xl mb-2 text-center  text-white">LOGIN</h1>
          <h5 className="text-xl mb-3 text-center  text-white">
            มาทำงานของคุณต่อกันเถอะ!
          </h5>
          <hr style={{ color: "white", opacity: "40%" }} />
        </div>
        {/* div ครอบ form */}
        <form onSubmit={handleSubmit}>
          <div className="container mx-auto mt-10 flex flex-col gap-10">
            {" "}
            {/* form */}
            <div
              style={{
                backgroundColor: "#3A4B62",
                border: "1px solid #868B93",
              }}
              className="p-6 rounded-4xl"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-white">
                  USERNAME / ชื่อผู้ใช้
                </label>
                <InputText
                  onChange={(e) => {
                    handleFormChang(e);
                    if (e.target.value.trim() !== "") {
                      setError({ ...error, userNameError: "" });
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value.trim()) {
                      setError((prev) => ({
                        ...prev,
                        userNameError: TextMessage.USERNAME_EMPTY,
                      }));
                    }
                  }}
                  minLength={0}
                  name="userName"
                  value={formData.userName}
                  className={`!bg-[#d9d9d929]  !text-white  ${error.userNameError ? "!border-red-400" : "!border-0"
                    }`}
                  id="username"
                  aria-describedby="username-help"
                  tooltipOptions={{
                    position: "right",
                    disabled: !error.userNameError,
                  }}
                  tooltip={`${error.userNameError}`}
                />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#3A4B62",
                border: "1px solid #868B93",
              }}
              className="p-6 rounded-4xl"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white">
                  PASSWORD / รหัสผ่าน
                </label>
                <InputText
                  onChange={(e) => {
                    handleFormChang(e);
                    if (e.target.value.trim() !== "") {
                      setError({ ...error, passwordError: "" });
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value.trim()) {
                      setError((prev) => ({
                        ...prev,
                        passwordError: TextMessage.PASSWORD_EMPTY,
                      }));
                    }
                  }}
                  minLength={8}
                  name="password"
                  value={formData.password}
                  type="password"
                  className={`!bg-[#d9d9d929]  !text-white  ${error.passwordError ? "!border-red-400" : "!border-0"
                    }`}
                  id="password"
                  aria-describedby="username-help"
                  tooltipOptions={{
                    position: "right",
                    disabled: !error.passwordError,
                  }}
                  tooltip={`${error.passwordError}`}
                />
              </div>
            </div>
            <div className="text-right">
              <Link
                href=""
                className="underline mr-2 transition duration-200  text-gray-300 hover:text-white"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            {" "}
            {/* button */}
            <button
              className="bg-[#f8f0f0c4] py-5 px-15 rounded-full text-2xl transition  duration-400 cursor-pointer  hover:bg-[#f8f0f08e] hover:scale-90"
              type="submit"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
