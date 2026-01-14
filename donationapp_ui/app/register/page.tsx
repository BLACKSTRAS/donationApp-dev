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
import { getUserInfo } from "@/services/users/userInfo";
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
  const { setUser } = auth;

  const handleFormChang = async (e: any) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

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
      if (response.status == 201) {
        showSuccess(response.message);
        const userData = await getUserInfo();
        setUser(userData);
        setErrors({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          router.push("/users/account");
        }, 3000);
      } else {
        showError(response.message);
      }
    } catch (error) {
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
  console.log(formData);

  return (
    <>
      <Toast ref={toast} />
      <div className="container mx-auto mt-10">
        <h1 className="text-5xl mb-2 text-center  text-white">REGISTER</h1>
        <h5 className="text-xl mb-3 text-center  text-white">
          มาเริ่มต้นสัมผัสประสบการณ์ใหม่กับเราสิ!
        </h5>
        <hr style={{ color: "white", opacity: "40%" }} />
      </div>
      {/* div ครอบ form */}
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto mt-10 flex flex-col gap-10">
          {" "}
          {/* form */}
          <div
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
            className="p-6 rounded-4xl"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-white">
                USERNAME / ชื่อผู้ใช้
              </label>
              <InputText
                onChange={(e) => {
                  handleFormChang(e);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, userName: "" }));
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      userName: TextMessage.USERNAME_EMPTY,
                    }));
                  }
                }}
                className={`!bg-[#d9d9d929]  !text-white  ${
                  errors.userName ? "!border-red-400" : "!border-0"
                }`}
                name="userName"
                id="userName"
                aria-describedby="username-help"
                tooltipOptions={{
                  position: "right",
                  disabled: !errors.userName,
                }}
                tooltip={`${errors.userName}`}
              />
            </div>
          </div>
          <div
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
            className="p-6 rounded-4xl"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white">
                EMAIL / อีเมล
              </label>
              <InputText
                onChange={(e) => {
                  handleFormChang(e);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      email: TextMessage.EMAIL_EMPTY,
                    }));
                  }
                }}
                type="email"
                className={`!bg-[#d9d9d929]  !text-white  ${
                  errors.email ? "!border-red-400" : "!border-0"
                }`}
                tooltipOptions={{ position: "right", disabled: !errors.email }}
                tooltip={`${errors.email}`}
                name="email"
                id="email"
                aria-describedby="username-help"
              />
            </div>
          </div>
          <div
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
            className="p-6 rounded-4xl"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-white">
                PASSWORD / รหัสผ่าน
              </label>
              <InputText
                onChange={(e) => {
                  handleFormChang(e);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      password: TextMessage.PASSWORD_EMPTY,
                    }));
                  }
                }}
                type="password"
                className={`!bg-[#d9d9d929]  !text-white  ${
                  errors.password ? "!border-red-400" : "!border-0"
                }`}
                tooltipOptions={{
                  position: "right",
                  disabled: !errors.password,
                }}
                tooltip={`${errors.password}`}
                name="password"
                id="password"
                aria-describedby="username-help"
              />
            </div>
          </div>
          <div
            style={{ backgroundColor: "#3A4B62", border: "1px solid #868B93" }}
            className="p-6 rounded-4xl"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-white">
                CONFIRM PASSWORD / ยืนยันรหัสผ่าน
              </label>
              <InputText
                onChange={(e) => {
                  handleFormChang(e);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: TextMessage.CONFIRM_PASSWORD_EMPTY,
                    }));
                  }
                }}
                type="password"
                className={`!bg-[#d9d9d929]  !text-white  ${
                  errors.confirmPassword ? "!border-red-400" : "!border-0"
                }`}
                tooltipOptions={{
                  position: "right",
                  disabled: !errors.confirmPassword,
                }}
                tooltip={`${errors.confirmPassword}`}
                name="confirmPassword"
                id="confirmPassword"
                aria-describedby="username-help"
              />
            </div>
          </div>
          <div className="flex align-items-center">
            <Checkbox
              inputId="ingredient1"
              name="check"
              checked={formData.checked}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  checked: e.checked ?? false,
                }))
              }
              tooltip={
                !formData.checked ? "กรุณายอมรับเงื่อนไขก่อนสมัคร" : undefined
              }
              tooltipOptions={{ position: "right" }}
            />
            <label htmlFor="ingredient1" className="ml-2 text-white text-sm">
              ฉันได้อ่านและยอมรับ{" "}
              <span
                onClick={() => setShowTerms(true)}
                className="underline cursor-pointer text-blue-300 hover:text-blue-400"
              >
                เงื่อนไขในการให้บริการ
              </span>{" "}
              และ{" "}
              <span
                onClick={() => setShowPrivacy(true)}
                className="underline cursor-pointer text-blue-300 hover:text-blue-400"
              >
                นโยบายความเป็นส่วนตัว
              </span>
            </label>
          </div>
        </div>
        <div className="px-150 my-10 flex flex-col gap-10  ">
          {" "}
          {/* button */}
          <Button
            type="submit"
            label="สร้างบัญชี"
            severity="secondary"
            disabled={!formData.checked}
          />
        </div>
      </form>

      <Dialog
        header="เงื่อนไขในการให้บริการ"
        visible={showTerms}
        style={{ width: "70vw", maxWidth: "800px" }}
        onHide={() => setShowTerms(false)}
        modal
        draggable={false}
      >
        <div className="text-sm text-gray-700 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            เมื่อผู้ใช้เข้าใช้งานระบบนี้ ถือว่าผู้ใช้ยอมรับและตกลงปฏิบัติตาม
            เงื่อนไขในการให้บริการทั้งหมด
          </p>

          <h4 className="font-semibold">1. การให้บริการ</h4>
          <p>
            ผู้ให้บริการขอสงวนสิทธิ์ในการแก้ไข ระงับ หรือยุติการให้บริการ
            โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
          </p>

          <h4 className="font-semibold">2. บัญชีผู้ใช้งาน</h4>
          <ul className="list-disc pl-5">
            <li>ต้องให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
            <li>ห้ามใช้งานในทางที่ผิดกฎหมาย</li>
          </ul>
        </div>
      </Dialog>

      <Dialog
        header="นโยบายความเป็นส่วนตัว (PDPA)"
        visible={showPrivacy}
        style={{ width: "70vw", maxWidth: "800px" }}
        onHide={() => setShowPrivacy(false)}
        modal
        draggable={false}
      >
        <div className="text-sm text-gray-700 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            นโยบายนี้จัดทำขึ้นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            (PDPA)
          </p>

          <h4 className="font-semibold">ข้อมูลที่เก็บรวบรวม</h4>
          <ul className="list-disc pl-5">
            <li>ชื่อ อีเมล เบอร์โทรศัพท์</li>
            <li>IP Address และ Log การใช้งาน</li>
          </ul>

          <h4 className="font-semibold">สิทธิของเจ้าของข้อมูล</h4>
          <ul className="list-disc pl-5">
            <li>ขอเข้าถึง แก้ไข หรือลบข้อมูล</li>
            <li>ถอนความยินยอมได้ตลอดเวลา</li>
          </ul>
        </div>
      </Dialog>
    </>
  );
}
