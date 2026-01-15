"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Manubars from "../../../../components/Menubar_users";
import BlueBox from "@/components/blueBox";
import { getUserDetailById } from "@/services/Uers/userInfo";
import { TextMessage } from "@/constants/textMessage";
import {
  addWordFilter,
  addWordForDonat,
  deleteWordFilter,
  upDateMinAmout,
} from "@/services/Uers/payment";
import { Toast } from "primereact/toast";
import BlockUI from "@/libs/BlockUi";
import ConfirmDialog from "@/libs/ConformDialog";

/** -----------------------------
 * Mock Storage Keys
 * ------------------------------*/
const LS_SETTING_KEY = "mockPaymentSetting";
const SECRET = 9137;
/** -----------------------------
 * SYSTEM BAD WORDS (Mock)
 * ------------------------------*/
const SYSTEM_BAD_WORDS = [
  "ควาย",
  "โง่",
  "ส้นตีน",
  "เหี้ย",
  "บ้า",
  "ไอ้เวร",
  "สารเลว",
  "ปัญญาอ่อน",
  "เลว",
  "ไร้ค่า",
];

export function encryptId(id: number): string {
  const encrypted = id ^ SECRET;
  return encrypted.toString(36).padStart(6, "0");
}

function buildPublicUrl(token: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return origin ? `${origin}/payment?t=${token}` : "";
}

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [welcomeText, setWelcomeText] = useState("");
  const [theme, setTheme] = useState<string>("theme1");
  const [minAmount, setMinAmount] = useState<string>("20");

  const [wordInput, setWordInput] = useState("");
  const [wordFilters, setWordFilters] = useState<string[]>([]);

  const [publicUrl, setPublicUrl] = useState<string>("");
  const toast = useRef<Toast | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [okMsg, setOkMsg] = useState<string>("");

  const [openSystemWords, setOpenSystemWords] = useState(false);
  const [wordFilterSystem, setWordFilterSystem] = useState<string[]>([]);

  /* Confirm Dialog */
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const themeOptions = useMemo(
    () => [
      { id: "theme1", label: "Theme 1" },
      { id: "theme2", label: "Theme 2" },
    ],
    []
  );

  const fetchUserDetail = async (): Promise<any> => {
    try {
      const result = await getUserDetailById();
      console.log(result);
      const streamerId = result?.userDetail?.streamerId;
      const data = {
        streamerId: result?.userDetail?.streamerId,
        minAmount: result?.userDetail?.minDonation,
        words: result?.userDetail?.words,
        wordDonate: result?.userDetail?.wordDonate,
        wordFilterSystem: result?.userDetail?.wordFilterSystem,
      };
      return data;
    } catch (error) {
      console.error(TextMessage.SYSYTEM_FAULD, error);
      return null;
    }
  };

  const loadMe = async () => {
    setLoading(true);
    setErrorMsg("");
    setOkMsg("");
    try {
      const steamerDetails = await fetchUserDetail();
      const steamerId = steamerDetails?.streamerId;
      const minAmount = steamerDetails?.minAmount;
      const words = steamerDetails?.words;
      const wordsFilterSystem = steamerDetails?.wordFilterSystem;
      const constWordDonate = steamerDetails?.wordDonate;
      const formattedAmount = minAmount ? minAmount.replace(/\.00$/, "") : "";
      console.log("steamer Id is :", steamerId);

      if (!steamerId) throw new Error("steamer not found");

      const idEncrypt = await encryptId(steamerId);
      console.log(idEncrypt);
      const rawURL = buildPublicUrl(idEncrypt);
      setMinAmount(formattedAmount ?? "1");
      setWordFilters(words ?? []);
      setPublicUrl(rawURL ?? "");
      console.log(wordsFilterSystem);
      setWordFilterSystem(wordsFilterSystem ?? SYSTEM_BAD_WORDS);
      setWelcomeText(constWordDonate ?? "");
    } catch (e: any) {
      setErrorMsg(e?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const onSubmitMinAmout = async () => {
    setErrorMsg("");
    setOkMsg("");

    const amount = Number(minAmount);

    // ---- validation ก่อน ----
    if (!minAmount) {
      const msg = "กรุณากรอกจำนวนเงินขั้นต่ำ";
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      const msg = "จำนวนเงินต้องมากกว่า 0";
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    // ---- เริ่มบันทึก ----
    setSaving(true);

    try {
      const response = await upDateMinAmout(amount);
      console.log(response);

      const msg = "บันทึกการตั้งค่ายอดเงินขั้นต่ำ สำเร็จ";
      setOkMsg(msg);
      showSuccess(msg);
    } catch (e: any) {
      const msg = e?.message || "เกิดข้อผิดพลาดในการบันทึก";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setSaving(false);
      await loadMe();
    }
  };

  const onSubmitWordFilter = async () => {
    setErrorMsg("");
    setOkMsg("");

    const word = wordInput.trim().toLowerCase();
    if (!word) return;

    setSaving(true);
    try {
      const response = await addWordFilter(word);
      console.log(response);

      const msg = "บันทึกคำกรองสำเร็จ";
      setOkMsg(msg);
      showSuccess(msg);
      setWordInput("");
    } catch (e: any) {
      const msg = e?.message || "เกิดข้อผิดพลาดในการบันทึกคำกรอง";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setSaving(false);
      await loadMe();
    }
  };

  const onSubmitWordDonate = async () => {
    setErrorMsg("");
    setOkMsg("");
    const word = welcomeText.trim().toLowerCase();
    if (!word) return;

    setSaving(true);
    try {
      const response = await addWordForDonat(word);
      console.log(response);

      const msg = "บันทึกข้อความ สำเร็จ";
      setOkMsg(msg);
      showSuccess(msg);
      setWordInput("");
    } catch (e: any) {
      const msg = e?.message || "เกิดข้อผิดพลาดในการบันทึก";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setSaving(false);
      await loadMe();
    }
  };

  const onDeleteWordFilter = async (word: string) => {
    setErrorMsg("");
    setOkMsg("");
    if (!word) return;
    setSaving(true);
    try {
      await deleteWordFilter(word);
      const msg = `ลบคำ ${word} สำเร็จ`;
      setOkMsg(msg);
      showSuccess(msg);
    } catch (e: any) {
      const msg = e?.message || "เกิดข้อผิดพลาดในการบันทึกคำกรอง";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setSaving(false);
      await loadMe();
    }
  };

  const onPreview = () => {
    window.open("/users/donate/payment-preview", "_blank");
  };

  const copyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setOkMsg("คัดลอกลิงก์แล้ว");
    } catch {
      setErrorMsg("คัดลอกลิงก์ไม่สำเร็จ (ลองคัดลอกเอง)");
    }
  };

  const showError = (errorMessage?: string) => {
    toast.current?.show({
      severity: "error",
      summary: "พบข้อผิดพลาด",
      detail: errorMessage ?? "ติดต่อผู้ดูแลระบบ",
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
    <div className="min-h-screen text-white">
      <ConfirmDialog
        open={openConfirmDelete}
        title="ยืนยันการลบคำ"
        message={`คุณต้องการลบคำว่า "${selectedWord}" ใช่หรือไม่`}
        danger
        confirmText="ลบ"
        cancelText="ยกเลิก"
        onCancel={() => {
          setOpenConfirmDelete(false);
          setSelectedWord(null);
        }}
        onConfirm={async () => {
          if (!selectedWord) return;
          await onDeleteWordFilter(selectedWord);
          setOpenConfirmDelete(false);
          setSelectedWord(null);
        }}
      />
      <BlockUI
        loading={loading || saving}
        message={loading ? "กำลังโหลดข้อมูล..." : "กำลังบันทึก..."}
      />
      <div className="flex max-w-6xl mx-auto h-full pb-10">
        <div className="pt-20 pr-6">
          <Manubars />
        </div>
        <Toast ref={toast} />
        <div className="flex-1 pt-16 pl-6 space-y-6">
          <section className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl p-6 space-y-4 max-w-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] shadow-[0_0_60px_rgba(0,0,0,0.55)] overflow-hidden">
              <h2 className="text-sm font-semibold underline underline-offset-4">
                ตั้งค่า หน้ารับเงิน
              </h2>

              {loading ? (
                <div className="text-[13px] text-white/70">
                  กำลังโหลดข้อมูล...
                </div>
              ) : null}

              {!!errorMsg ? (
                <div className="text-[13px] text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {errorMsg}
                </div>
              ) : null}

              {!!okMsg ? (
                <div className="text-[13px] text-emerald-200 bg-emerald-500/10 border border-emerald-400/20 rounded-xl px-4 py-3">
                  {okMsg}
                </div>
              ) : null}

              <div className="space-y-1">
                <label className="text-sm text-white/90">ข้อความ</label>
                <textarea
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  className="w-full h-28 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-[13px] resize-none outline-none"
                  placeholder="ใส่ข้อความต้อนรับ หรือคำอธิบายสำหรับผู้ที่จะโอนเงินให้คุณ"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm text-white/90">ลิงก์หน้ารับเงิน</span>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl bg-black/40 px-4 py-3 text-[13px] border border-white/10 truncate">
                    {publicUrl || "ยังไม่มีลิงก์ (กดบันทึกการตั้งค่าก่อน)"}
                  </div>
                  <button
                    type="button"
                    onClick={copyLink}
                    disabled={!publicUrl}
                    className="w-40 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 px-3 py-2 text-[13px] outline-none"
                  >
                    คัดลอกลิงก์
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onSubmitWordDonate}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 transition text-[13px]"
              >
                <span className="pi pi-wallet" />
                {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="rounded-2xl p-6 space-y-4 max-w-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] shadow-[0_0_60px_rgba(0,0,0,0.55)] overflow-hidden">
              <h2 className="text-sm font-semibold underline underline-offset-4">
                ตัวกรอกข้อความ
              </h2>

              {/* ✅ NEW: ระบบกรองคำหยาบ (กดเปิดดูได้) */}
              <div className="space-y-1">
                <label className="text-sm text-white/90">
                  คำที่กรอกโดยระบบ
                </label>

                <button
                  type="button"
                  onClick={() => setOpenSystemWords(true)}
                  className="w-full text-left rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 text-white/70 hover:bg-white/10 transition"
                >
                  (ระบบ) คำหยาบ/คำต้องห้ามที่ถูกกรองอัตโนมัติ
                  <span className="ml-2 text-white/40">(คลิกเพื่อดู)</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/90">
                  ตั้งค่าข้อความของคุณเอง
                </label>
                <div className="flex gap-2">
                  <input
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSubmitWordFilter;
                    }}
                    className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none"
                    placeholder="คำใหม่ที่ต้องการจะเพิ่ม"
                  />
                  <button
                    type="button"
                    onClick={onSubmitWordFilter}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[13px]"
                  >
                    เพิ่มค่าใหม่
                  </button>
                </div>

                {wordFilters.length ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {wordFilters.map((w, idx) => (
                      <div
                        key={`${w}-${idx}`} // เพิ่ม index เพื่อ uniqueness
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[12px]"
                      >
                        <span className="text-white/85">{w}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWord(w);
                            setOpenConfirmDelete(true);
                          }}
                          className="text-white/60 hover:text-white"
                          aria-label="remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[12px] text-white/50 pt-2">
                    ยังไม่มีคำที่เพิ่ม
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-4 max-w-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] shadow-[0_0_60px_rgba(0,0,0,0.55)] overflow-hidden">
              <h2 className="text-sm font-semibold underline underline-offset-4">
                ตั้งค่ายอดเงินขั้นต่ำ
              </h2>

              <div className="space-y-1">
                <label className="text-sm text-white/90">
                  ยอดขั้นต่ำที่ต้องการรับ (บาท)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-[13px] border border-white/10 outline-none     
                    placeholder:text-white/70
                    placeholder:text-[13px]"
                    placeholder="เช่น 20"
                  />
                  <button
                    type="button"
                    onClick={onSubmitMinAmout}
                    disabled={saving || loading}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[13px] disabled:opacity-50 disabled:hover:bg-white/10"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ✅ MODAL: SYSTEM BAD WORDS */}
      {openSystemWords && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpenSystemWords(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#0b1020] border border-white/15 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                คำที่ระบบกรองอัตโนมัติ
              </h3>
              <button
                onClick={() => setOpenSystemWords(false)}
                className="text-white/50 hover:text-white"
                aria-label="close"
              >
                ✕
              </button>
            </div>

            <div className="text-[12px] text-white/60 mb-3">
              ข้อความโดเนทที่มีคำเหล่านี้ ระบบอาจปิดบังหรือไม่แสดงผล
            </div>

            <div className="flex flex-wrap gap-2">
              {wordFilterSystem.map((word) => (
                <span
                  key={word}
                  className="px-3 py-1 rounded-full text-[12px] bg-red-500/10 border border-red-400/20 text-red-300"
                >
                  {word}
                </span>
              ))}
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setOpenSystemWords(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[13px]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
