"use client";

import React, { useEffect, useRef, useState } from "react";
import Manubars from "@/components/Menubar_users";
import Image from "next/image";
import BlueBox from "@/components/blueBox";
import { StreamerDetail } from "@/constants/models";
import {
  getUserDetailById,
  updateAddressByUserId,
  updatePaymentByUserId,
  updatePersonalByUserId,
  updateUserContact,
  uploadUserProfile,
} from "@/services/Uers/userInfo";
import { TextMessage } from "@/constants/textMessage";
import { formatDate } from "@/libs/formatType";
import {
  FormContact,
  FormAddress,
  FormPayment,
  FormPersonal,
} from "@/constants/models";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import BlockUI from "@/libs/BlockUi";

const emptyContact: FormContact = {
  email: "",
  phoneNumber: "",
};

const emptyPersonal: FormPersonal = {
  title: "",
  firstName: "",
  lastName: "",
  birthDay: "",
  idCard: "",
};

const emptyAddress: FormAddress = {
  address: "",
  subDistrict: "",
  distric: "",
  province: "",
  zipcode: "",
};

const emptyPayment: FormPayment = {
  promtPayType: 0,
  promtPayNo: "",
  bankType: 0,
  bankNo: "",
  bankUsername: "",
};

const AccountPage = () => {
  const [userDetail, setUserDetail] = useState<StreamerDetail>();
  const [formContact, setFormContact] = useState<FormContact>(emptyContact);
  const [formPersonal, setFormPersonal] = useState<FormPersonal>(emptyPersonal);
  const [formAddress, setFormAddress] = useState<FormAddress>(emptyAddress);
  const [formPayment, setFormPayment] = useState<FormPayment>(emptyPayment);
  const [loading, setLoading] = useState(false);
  const fileUploadRef = useRef<FileUpload>(null);
  const toast = useRef<Toast | null>(null);
  const router = useRouter();

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await getUserDetailById();
      setUserDetail(data.userDetail);
    } catch (error) {
      console.error(TextMessage.SYSYTEM_FAULD, error);
      showError(TextMessage.SYSYTEM_FAULD);
    } finally {
      setLoading(false);
    }
  };

  const submitContact = async (email?: string, telephone?: string) => {
    try {
      setLoading(true);
      await updateUserContact(email, telephone);
      showSuccess(TextMessage.UPDATE_SUCCESS);
      await fetchUserDetail();
    } catch {
      showError(TextMessage.SYSYTEM_FAULD);
    } finally {
      setLoading(false);
    }
  };

  const submitPersonal = async (
    firstName?: string,
    lastName?: string,
    title?: string,
    birthDay?: Date,
    idCard?: string
  ) => {
    try {
      setLoading(true);
      await updatePersonalByUserId(
        firstName,
        lastName,
        title,
        birthDay,
        idCard
      );
      showSuccess(TextMessage.UPDATE_SUCCESS);
      await fetchUserDetail();
    } catch {
      showError(TextMessage.SYSYTEM_FAULD);
    } finally {
      setLoading(false);
    }
  };

  const submitAddress = async (
    address?: string,
    province?: string,
    subDistrict?: string,
    zipcode?: string
  ) => {
    try {
      setLoading(true);
      await updateAddressByUserId(address, province, subDistrict, zipcode);
      showSuccess(TextMessage.UPDATE_SUCCESS);
      await fetchUserDetail();
    } catch {
      showError(TextMessage.SYSYTEM_FAULD);
    } finally {
      setLoading(false);
    }
  };

  const submitPayment = async (
    promtPayType?: number,
    promtPayNo?: string,
    bankType?: number,
    bankNo?: string,
    bankUsername?: string
  ) => {
    if (promtPayNo?.trim()) {
      const length = promtPayNo.trim().length;
      if (length < 10 || length > 13) {
        showError(
          "กรุณากรอกเบอร์มือถือหรือเลขบัตรประชาชนให้ถูกต้อง (10–13 หลัก)"
        );
        return;
      }
      if (!bankUsername?.trim()) {
        showError("กรุณากรอกชื่อผู้ใช้บัญชี");
        return;
      }
    }
    try {
      setLoading(true);
      await updatePaymentByUserId(
        promtPayType,
        promtPayNo,
        bankType,
        bankNo,
        bankUsername
      );
      showSuccess(TextMessage.UPDATE_SUCCESS);
      await fetchUserDetail();
    } catch {
      showError(TextMessage.SYSYTEM_FAULD);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  useEffect(() => {
    if (!userDetail) return;
    setFormContact({
      email: userDetail.email ?? "",
      phoneNumber: userDetail.phoneNumber ?? "",
    });

    setFormPersonal({
      title: userDetail.title ?? "",
      firstName: userDetail.firstName ?? "",
      lastName: userDetail.lastName ?? "",
      birthDay: userDetail.birthDay ? userDetail.birthDay.split("T")[0] : "",
      idCard: userDetail.idCard ?? "",
    });

    setFormAddress({
      address: userDetail.address ?? "",
      subDistrict: userDetail.subDistrict ?? "",
      distric: userDetail.distric ?? "",
      province: userDetail.province ?? "",
      zipcode: userDetail.zipcode ?? "",
    });

    setFormPayment({
      promtPayType: userDetail.promtPayType ?? 0,
      promtPayNo: userDetail.promtPayNo ?? "",
      bankType: userDetail.bankType ?? 0,
      bankNo: userDetail.bankNo ?? "",
      bankUsername: userDetail.bankUsername ?? "",
    });
  }, [userDetail]);

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
  /* อัปโหลดภาพ */

  const openFileDialog = () => {
    const input =
      fileUploadRef.current?.getInput?.() ||
      (fileUploadRef.current as any)?.fileInput;

    input?.click();
  };

  const uploadHandler = async (event: FileUploadSelectEvent) => {
    const file = event.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      await uploadUserProfile(file);
    } catch (err) {
      console.error("fauild to upload:", err);
      showError("อัปโหลดรูปไม่สำเร็จ");
    } finally {
      fileUploadRef.current?.clear();
      await fetchUserDetail();
      setLoading(false);
    }
  };
  return (
    <>
      <BlockUI loading={loading} message="กรุณารอสักครู่..." />
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        name="avatar"
        accept="image/*"
        maxFileSize={1000000}
        customUpload
        onSelect={uploadHandler}
        className="hidden"
        multiple={false}
      />
      <Toast ref={toast} />
      <div className="min-h-screen text-white">
        <div className="flex max-w-7xl mx-auto h-full pb-12">
          <div className="pt-20 pr-6">
            <Manubars />
          </div>

          <div className="flex-1 pt-16 pl-6 space-y-10">
            <section className="flex gap-6">
              <div
                className="flex-1 rounded-3xl p-8 relative
    bg-gradient-to-b from-[#182a5c] via-[#0b173a] to-[#070c1a]
    border border-cyan-400/25
    shadow-[0_0_70px_-18px_rgba(34,211,238,0.28)]
    backdrop-blur-lg"
              >
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div
                    className="relative w-40 h-40 rounded-full overflow-hidden
        border-4 border-cyan-400
        shadow-[0_0_35px_rgba(34,211,238,0.45)]"
                  >
                    <Image
                      src={`http://localhost:8000/images/profiles/${
                        userDetail?.imageUser || "avatar1.avif"
                      }`}
                      alt="profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div
                    onClick={openFileDialog}
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full
        bg-white/90 text-[#0b173a]
        border border-white/60
        shadow-[0_0_20px_rgba(255,255,255,0.45)]
        flex items-center justify-center
        hover:bg-cyan-400 hover:text-white
        transition-all cursor-pointer active:scale-95"
                  >
                    <i className="pi pi-images text-[1.1rem]" />
                  </div>
                </div>

                <div className="mt-20 flex flex-col items-center text-center">
                  <div className="flex pt-3 items-center gap-2">
                    <h1 className="text-[28px] font-bold tracking-wide text-white drop-shadow-md">
                      {userDetail?.userName || ""}
                    </h1>
                  </div>

                  <p className="text-cyan-300/85 mt-2 tracking-wider text-[13px]">
                    {userDetail?.email || ""}
                  </p>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent my-8" />

                  <div className="grid grid-cols-2 gap-6 w-full px-10">
                    <div>
                      <div className="text-white/45 text-[11px] uppercase tracking-tight mb-2">
                        ยอดรับบริจาคทั้งหมด
                      </div>
                      <div style={{alignItems:"center"}} className="text-[22px] font-bold flex  justify-center gap-3 text-cyan-300">
                        <i className="pi pi-credit-card text-[18px]" />
                        <span>{userDetail?.totalDonate}</span>
                      </div>
                    </div>

                    <div className="border-l border-white/10 px-6">
                      <div className="text-white/45 text-[11px] uppercase tracking-tight mb-2">
                        เข้าร่วมกับเราตั้งแต่
                      </div>
                      <div className="text-[20px] font-semibold text-white/90">
                        {formatDate(userDetail?.creatDate || "")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <BlueBox
                className="w-80 rounded-2xl p-6
    bg-white/[0.045]
    border border-white/15
    shadow-[0_0_45px_rgba(0,0,0,0.45)]
    backdrop-blur-md"
              >
                <h2 className="text-[12px] font-semibold tracking-wide underline underline-offset-4 mb-5 text-white">
                  จัดการบัญชี
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-white/45 text-[11px] mb-1">ชื่อผู้ใช้</p>
                    <div className="flex gap-1.5 text-[13px] text-white/90">
                      <span>{userDetail?.title || "นาย"}</span>
                      <span>{userDetail?.firstName || "ชื่อจริง"}</span>
                      <span>{userDetail?.lastName || "นามสกุล"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/45 text-[11px] mb-1">
                        วันเดือนปีเกิด
                      </p>
                      <p className="text-[13px] text-white/85">
                        {formatDate(userDetail?.birthDay) || "วัน / เดือน / ปี"}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/45 text-[11px] mb-1">
                        เลขบัตรประชาชน
                      </p>
                      <p className="text-[13px] text-white/85">
                        {userDetail?.idCard || "เลขบัตรประชาชน"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/45 text-[11px] mb-1">ที่อยู่</p>
                    <p className="text-[12px] text-white/80 leading-relaxed">
                      {`${userDetail?.address || "-"} ${
                        userDetail?.subDistrict || "-"
                      } ${userDetail?.distric || "-"} ${
                        userDetail?.province || "-"
                      } ${userDetail?.zipcode || "-"}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {["อีเมล", "เบอร์โทรศัพท์"].map((label) => (
                      <div key={label}>
                        <p className="text-white/45 text-[11px] mb-2">
                          {label}
                        </p>
                        <span
                          className="inline-flex items-center gap-1.5
              bg-white/5 border border-white/15
              px-2.5 py-1 rounded-full
              text-[10px] text-white/65"
                        >
                          <i
                            className="pi pi-info-circle"
                            style={{ color: "#FFD700", fontSize: "1rem" }}
                          />
                          ยังไม่ยืนยัน
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      className="w-full flex items-center justify-center gap-2
          bg-[#3a4862] hover:bg-[#445472]
          active:scale-[0.99]
          transition-all rounded-xl py-2.5
          text-[13px] text-white/90
          border border-white/15"
                    >
                      <span className="pi pi-cog text-[14px]" />
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>
                </div>
              </BlueBox>
            </section>

            <section className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl p-6 space-y-6 border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-transparent shadow-[0_0_70px_-20px_rgba(0,209,255,0.18)] backdrop-blur-md overflow-hidden">
                  <h2 className="text-[12px] font-semibold tracking-wide text-white underline underline-offset-4">
                    ตั้งค่าอีเมลและเบอร์โทรศัพท์มือถือ
                  </h2>

                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] text-white/70">อีเมล</label>
                      <input
                        onChange={(e) =>
                          setFormContact((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        value={formContact.email}
                        className="w-full rounded-xl bg-black/30 px-4 py-3 text-[13px] text-white/85
          border border-white/15 outline-none transition-all
          focus:border-cyan-400/60 focus:bg-cyan-400/10
          placeholder:text-white/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] text-white/70">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        onChange={(e) => {
                          const onlyNumbers = e.target.value.replace(/\D/g, "");
                          setFormContact((prev) => ({
                            ...prev,
                            phoneNumber: onlyNumbers,
                          }));
                        }}
                        minLength={10}
                        maxLength={10}
                        value={formContact.phoneNumber || ""}
                        className="w-full rounded-xl bg-black/30 px-4 py-3 text-[13px] text-white/85
          border border-white/15 outline-none transition-all
          focus:border-cyan-400/60 focus:bg-cyan-400/10
          placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      submitContact(formContact.email, formContact.phoneNumber)
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
      bg-white/10 hover:bg-white/15 active:scale-[0.99]
      text-[13px] border border-white/15 transition-all"
                  >
                    <span className="pi pi-wallet"></span>
                    บันทึกการตั้งค่า
                  </button>
                </div>

                <div className="rounded-2xl p-6 space-y-6 border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-transparent shadow-[0_0_70px_-20px_rgba(0,209,255,0.18)] backdrop-blur-md overflow-hidden">
                  <h2 className="text-[12px] font-semibold tracking-wide text-white underline underline-offset-4">
                    ตั้งค่าข้อมูลผู้ใช้งาน
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      ["คำนำหน้า", "title"],
                      ["ชื่อจริง", "firstName"],
                      ["นามสกุล", "lastName"],
                    ].map(([label, key]) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[12px] text-white/70">
                          {label}
                        </label>
                        <input
                          value={(formPersonal as any)[key] ?? ""}
                          onChange={(e) =>
                            setFormPersonal((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl bg-black/30 px-4 py-3 text-[13px] text-white/85
            border border-white/15 outline-none transition-all
            focus:border-cyan-400/60 focus:bg-cyan-400/10
            placeholder:text-white/30"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] text-white/70">
                      วัน / เดือน / ปี เกิด
                    </label>
                    <input
                      type="date"
                      value={formPersonal.birthDay}
                      onChange={(e) =>
                        setFormPersonal((prev) => ({
                          ...prev,
                          birthDay: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl cursor-text
                     bg-black/30 px-4 py-3 text-[13px] text-white/85
                       border border-white/15 outline-none transition-all
                       focus:border-cyan-400/60 focus:bg-cyan-400/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] text-white/70">
                      เลขบัตรประจำตัวประชาชน
                    </label>
                    <input
                      maxLength={13}
                      minLength={13}
                      value={formPersonal.idCard ?? ""}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        setFormPersonal((prev) => ({
                          ...prev,
                          idCard: onlyNumbers,
                        }));
                      }}
                      className="w-full rounded-xl bg-black/30 px-4 py-3 text-[13px] text-white/85
        border border-white/15 outline-none transition-all
        focus:border-cyan-400/60 focus:bg-cyan-400/10
        placeholder:text-white/30"
                    />
                  </div>

                  <button
                    onClick={() =>
                      submitPersonal(
                        formPersonal.firstName,
                        formPersonal.lastName,
                        formPersonal.title,
                        formPersonal.birthDay
                          ? new Date(formPersonal.birthDay)
                          : undefined,
                        formPersonal.idCard
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
      bg-white/10 hover:bg-white/15 active:scale-[0.99]
      text-[13px] border border-white/15 transition-all"
                  >
                    <span className="pi pi-wallet"></span>
                    บันทึกการตั้งค่า
                  </button>
                </div>

                <div className="rounded-2xl p-6 space-y-6 border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-transparent shadow-[0_0_70px_-20px_rgba(0,209,255,0.18)] backdrop-blur-md overflow-hidden">
                  <h2 className="text-[12px] font-semibold tracking-wide text-white underline underline-offset-4">
                    ตั้งค่าข้อมูลที่อยู่
                  </h2>

                  <div className="space-y-1">
                    <label className="text-[12px] text-white/70">ที่อยู่</label>
                    <textarea
                      value={formAddress.address ?? ""}
                      onChange={(e) =>
                        setFormAddress((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full h-28 rounded-xl bg-black/30 px-4 py-3 text-[13px] text-white/85
        border border-white/15 outline-none resize-none transition-all
        focus:border-cyan-400/60 focus:bg-cyan-400/10
        placeholder:text-white/30"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      ["ตำบล / เขต", "subDistrict"],
                      ["จังหวัด", "province"],
                      ["รหัสไปรษณีย์", "zipcode"],
                    ].map(([label, key]) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[12px] text-white/70">
                          {label}
                        </label>
                        <input
                          value={(formAddress as any)[key] ?? ""}
                          onChange={(e) =>
                            setFormAddress((prev) => ({
                              ...prev,
                              [key]:
                                key === "zipcode"
                                  ? e.target.value.replace(/\D/g, "")
                                  : e.target.value,
                            }))
                          }
                          maxLength={key === "zipcode" ? 5 : undefined}
                          className="w-full rounded-xl bg-black/30 px-4 py-3 text-[13px] text-white/85
            border border-white/15 outline-none transition-all
            focus:border-cyan-400/60 focus:bg-cyan-400/10
            placeholder:text-white/30"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      submitAddress(
                        formAddress.address,
                        formAddress.province,
                        formAddress.subDistrict,
                        formAddress.zipcode
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
      bg-white/10 hover:bg-white/15 active:scale-[0.99]
      text-[13px] border border-white/15 transition-all"
                  >
                    <span className="pi pi-map-marker"></span>
                    บันทึกการตั้งค่า
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-2xl p-6 space-y-6 border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-transparent shadow-[0_0_80px_-20px_rgba(0,209,255,0.25)] backdrop-blur-md overflow-hidden">
                  <div>
                    <h2 className="text-[12px] font-semibold tracking-wide text-white underline underline-offset-4">
                      ตั้งค่าการรับเงิน
                    </h2>
                    <p className="text-[12px] text-white/55 mt-1">
                      จัดการช่องทางรับบริจาคของคุณ
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="group space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                          <span className="pi pi-phone text-xs"></span>
                        </div>
                        <h3 className="text-[12px] font-semibold uppercase tracking-widest text-blue-200/90">
                          พร้อมเพย์
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-5">
                        <div className="relative">
                          <label className="text-[12px] text-white/60 ml-1 mb-1.5 block">
                            ประเภทพร้อมเพย์
                          </label>
                          <select
                            value={String(formPayment.promtPayType)}
                            onChange={(e) =>
                              setFormPayment((prev) => ({
                                ...prev,
                                promtPayType: Number(e.target.value),
                              }))
                            }
                            className="w-full rounded-2xl bg-black/30 px-5 py-4 text-[13px] text-white/85
              border border-white/15 outline-none appearance-none cursor-pointer
              focus:border-emerald-400/60 focus:bg-emerald-400/10
              transition-all"
                          >
                            <option value="" className="bg-[#0b1020]">
                              เลือกประเภทพร้อมเพย์ของคุณ
                            </option>
                            <option value={1} className="bg-[#0b1020]">
                              เบอร์โทรศัพท์
                            </option>
                            <option value={2} className="bg-[#0b1020]">
                              หมายเลขบัตรประชาชน
                            </option>
                          </select>
                          <span className="absolute right-5 top-[42px] pi pi-chevron-down text-[10px] text-white/35 pointer-events-none"></span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[12px] text-white/60 ml-1 block">
                          ชื่อบัญชี
                        </label>
                        <input
                          onChange={(e) =>
                            setFormPayment((prev) => ({
                              ...prev,
                              bankUsername: e.target.value,
                            }))
                          }
                          value={formPayment.bankUsername ?? ""}
                          type="text"
                          placeholder="ระบุชื่อ-นามสกุล เจ้าของบัญชี"
                          className="w-full rounded-2xl bg-black/30 px-5 py-4 text-[13px] text-white/85
            border border-white/15 outline-none
            focus:border-emerald-400/60 focus:bg-emerald-400/10
            transition-all placeholder:text-white/30"
                        />
                         <label className=" text-[12px] mt-0.5 text-red-400 ml-3 block">
                          *หมายเหตุ ควรตั้งชื่อให้ตรงกับบัญชีรับเงินเท่านั้น
                        </label>
                      </div>

                      <div className="relative space-y-1.5">
                        <label className="text-[12px] text-white/60 ml-1 block">
                          หมายเลขพร้อมเพย์
                        </label>
                        <input
                          type="text"
                          placeholder="08X-XXX-XXXX หรือ เลขบัตรประชาชน"
                          value={formPayment.promtPayNo ?? ""}
                          maxLength={13}
                          minLength={10}
                          onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            setFormPayment((prev) => ({
                              ...prev,
                              promtPayNo: onlyNumbers,
                            }));
                          }}
                          className="w-full rounded-2xl bg-black/30 px-5 py-4 text-[13px] text-white/85
            border border-white/15 outline-none
            focus:border-blue-400/60 focus:bg-blue-400/10
            transition-all duration-300 placeholder:text-white/30"
                        />
                            <label className=" text-[12px] mt-0.5 text-red-400 ml-3 block">
                          *หมายเหตุ หมายเลขพร้อมเพย์ที่ใช้ต้องมีชื่อตรงกับชื่อบัญชีที่ตั้งค่า
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() =>
                        submitPayment(
                          formPayment.promtPayType,
                          formPayment.promtPayNo,
                          formPayment.bankType,
                          formPayment.bankNo,
                          formPayment.bankUsername
                        )
                      }
                      className="group relative w-full overflow-hidden rounded-2xl
        bg-gradient-to-r from-blue-600 to-blue-500
        px-6 py-4 text-white
        border border-blue-400/30
        shadow-[0_0_25px_rgba(59,130,246,0.35)]
        transition-all duration-300 hover:brightness-110 active:scale-[0.99]"
                    >
                      <div className="relative flex items-center justify-center gap-2">
                        <span className="pi pi-check-circle text-sm transition-transform group-hover:scale-110"></span>
                        <span className="text-[13px] font-bold tracking-wide">
                          บันทึกข้อมูลการรับเงิน
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
