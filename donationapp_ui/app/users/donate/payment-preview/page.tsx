"use client";

import React, { useEffect, useMemo, useState } from "react";
import Manubars from "@/components/Menubar_users";
import { generatePromptPayQR } from "@/libs/utils/promptpay";

/** -----------------------------
 * Mock Storage Keys
 * ------------------------------*/
const LS_SETTING_KEY = "mockPaymentSetting";
const LS_DONATE_KEY = "mockDonateHistories";

/** -----------------------------
 * Types
 * ------------------------------*/
type SettingMeRes = {
  steamer_id?: number;

  theam_setting_details?: string | null;
  word_filter?: string[] | null;
  min_amout?: number | null;
  text_with_donate?: string | null;

  qr_url?: string | null;
  promtpay_no?: string | null;
  bank_username?: string | null;

  public_token?: string | null;
  public_url?: string | null;
};

type DonationRow = {
  donate_id: number;
  donate_at: string; // ISO
  donate_by: string;
  donate_details: string;
  amout: number;
  payment_type: string;
  status: string; // SUCCESS
};

function fmtMoney(v: any) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "";
  return n.toFixed(0);
}

function readSetting(): SettingMeRes {
  try {
    const raw = localStorage.getItem(LS_SETTING_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readDonateList(): DonationRow[] {
  try {
    const raw = localStorage.getItem(LS_DONATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDonateList(arr: DonationRow[]) {
  localStorage.setItem(LS_DONATE_KEY, JSON.stringify(arr));
}

function nextDonateId(existing: DonationRow[]) {
  const maxId = existing.reduce((m, x) => Math.max(m, x.donate_id || 0), 0);
  return maxId + 1;
}

export default function PaymentPreviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SettingMeRes | null>(null);
  const [err, setErr] = useState("");

  // ฟอร์ม “หน้าบ้าน” (พรีวิว)
  const [donateBy, setDonateBy] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);

  // สำหรับ debug/โชว์ประวัติ (ช่วยให้เช็คว่า save ได้จริง)
  const [history, setHistory] = useState<DonationRow[]>([]);

  const minAmount = useMemo(() => {
    const n = Number(data?.min_amout);
    return Number.isFinite(n) ? n : 0;
  }, [data?.min_amout]);

  const amountNum = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const isAmountValid = amountNum >= minAmount;

  const loadMe = async () => {
    setLoading(true);
    setErr("");
    setOkMsg("");
    try {
      // ---- MOCK LOAD (แทน fetch) ----
      const d = readSetting();

      // ถ้ายังไม่เคยตั้งค่าเลย ให้โชว์ error แบบบอกทาง
      if (!d || !Object.keys(d).length) {
        throw new Error("ยังไม่มีข้อมูลตั้งค่า (กลับไปหน้าตั้งค่าก่อน)");
      }

      // ถ้ามี token ในลิงก์ ให้เช็คว่าตรงกัน (จำลอง public link)
      const params = new URLSearchParams(window.location.search);
      const t = params.get("t");
      if (t && d.public_token && t !== d.public_token) {
        throw new Error("ลิงก์ไม่ถูกต้อง (token ไม่ตรง)");
      }

      setData(d);
      setHistory(readDonateList());
    } catch (e: any) {
      setErr(e?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  const theme = data?.theam_setting_details ?? "theme1";
  const headerText =
    data?.text_with_donate?.trim() || "โดเนทสนับสนุนฉันได้เลย 💙";

  const receiverName = data?.bank_username || "ฐานิศร นาคเทวี";
  const promptpayNo = "1139600223847";

  useEffect(() => {
    if (!promptpayNo) return;

    generatePromptPayQR(promptpayNo, amountNum || undefined)
      .then(setQrImage)
      .catch(() => setQrImage(null));
  }, [promptpayNo, amountNum]);

  const cardBg =
    theme === "theme2"
      ? "bg-gradient-to-b from-[#1a1f2f] via-[#0b1020] to-black"
      : "bg-gradient-to-b from-[#0e1b44] via-[#09101f] to-black";

  const onSubmitDonation = async () => {
    setSubmitting(true);
    setErr("");
    setOkMsg("");
    try {
      // ---- MOCK SAVE DONATION (แทน fetch POST) ----
      const list = readDonateList();

      const row: DonationRow = {
        donate_id: nextDonateId(list),
        donate_at: new Date().toISOString(),
        donate_by: donateBy.trim(),
        donate_details: details.trim(),
        amout: amountNum,
        payment_type: "PROMPTPAY",
        status: "SUCCESS",
      };

      const next = [row, ...list];
      writeDonateList(next);
      setHistory(next);

      setOkMsg("บันทึกโดเนทสำเร็จ (Mock)");
      setDonateBy("");
      setAmount("");
      setDetails("");
    } catch (e: any) {
      setErr(e?.message || "เกิดข้อผิดพลาดในการบันทึกโดเนท");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="flex max-w-7xl mx-auto h-full pb-10">
        <div className="pt-20 pr-6">
          <Manubars />
        </div>

        <div className="flex-1 pt-16 pl-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">Payment Preview</h1>
              {/*              <p className="text-white/60 text-sm">
                พรีวิวหน้ารับเงินจาก “ค่าที่ตั้งไว้” (localStorage)
              </p> */}
            </div>

            <button
              onClick={() => window.close()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[13px]"
            >
              ปิด
            </button>
          </div>

          {loading ? (
            <div className="text-white/70 text-sm">กำลังโหลดข้อมูล...</div>
          ) : err ? (
            <div className="text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm">
              {err}
            </div>
          ) : (
            <div className="flex items-start gap-8">
              {/* การ์ดหน้าบ้าน */}
              <div className="w-[320px]">
                {!!okMsg ? (
                  <div className="mb-3 text-[13px] text-emerald-200 bg-emerald-500/10 border border-emerald-400/20 rounded-xl px-4 py-3">
                    {okMsg}
                  </div>
                ) : null}

                <div
                  className={`rounded-md border border-white/10 ${cardBg} shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden`}
                >
                  <div className="p-4 text-center space-y-3">
                    <div className="text-[12px] text-white/80 leading-snug">
                      {headerText}
                      {minAmount ? (
                        <div className="text-white/60 mt-1">
                          โดเนทขั้นต่ำ {fmtMoney(minAmount)} บาท
                        </div>
                      ) : null}
                    </div>

                    <div className="mx-auto w-[170px] h-[170px] bg-white rounded-sm flex items-center justify-center overflow-hidden">
                      {qrImage ? (
                        <img
                          src={qrImage}
                          alt="PromptPay QR"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-black text-[12px] px-3 text-center">
                          ไม่สามารถสร้าง QR ได้
                        </div>
                      )}
                    </div>

                    <div className="text-left text-[12px] text-white/80 space-y-1 pt-1">
                      <div>
                        ชื่อผู้รับ :{" "}
                        <span className="text-white">{receiverName}</span>
                      </div>
                      <div>
                        เลขผู้รับ :{" "}
                        <span className="text-white">{promptpayNo}</span>
                      </div>
                      {/* <div className="opacity-70">ธนาคาร : -</div> */}
                    </div>

                    <div className="text-left space-y-2 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[12px] text-white/80">
                            จำนวนเงิน :
                          </div>
                          <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-8 rounded bg-white/10 border border-white/10 px-3 text-[12px] outline-none"
                            placeholder="เช่น 20"
                            type="number"
                          />
                          {!isAmountValid && (
                            <div className="text-[11px] text-red-300 mt-1">
                              ต้องไม่น้อยกว่า {fmtMoney(minAmount)} บาท
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-[12px] text-white/80">
                            ข้อความ :
                          </div>
                          <input
                            value={details}
                            maxLength={50}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full h-8 rounded bg-white/10 border border-white/10 px-3 text-[12px] outline-none"
                            placeholder="ข้อความโดเนท"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onSubmitDonation}
                        disabled={
                         true
                        }
                        className="w-full h-9 rounded bg-white/90 text-black text-[13px] font-medium hover:bg-white disabled:opacity-50 disabled:hover:bg-white/90 transition"
                      >
                        {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
                      </button>

                      {!!err ? (
                        <div className="text-[12px] text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-3 py-2">
                          {err}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug panel */}
              {/* <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold mb-3">
                  ข้อมูลที่โหลดจาก Mock
                </div>

                <div className="text-[13px] text-white/75 space-y-2">
                  <div>
                    Theme: <span className="text-white">{theme}</span>
                  </div>
                  <div>
                    Text: <span className="text-white">{headerText}</span>
                  </div>
                  <div>
                    Min Amount:{" "}
                    <span className="text-white">
                      {fmtMoney(minAmount) || "-"}
                    </span>
                  </div>
                  <div>
                    Word Filters:{" "}
                    <span className="text-white">
                      {Array.isArray(data?.word_filter) &&
                      data.word_filter.length
                        ? data.word_filter.join(", ")
                        : "-"}
                    </span>
                  </div>
                  <div>
                    PromptPay: <span className="text-white">{promptpayNo}</span>
                  </div>
                  <div>
                    Receiver: <span className="text-white">{receiverName}</span>
                  </div>
                  <div>
                    QR URL:{" "}
                    <span className="text-white break-all">
                      {data?.qr_url || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold mb-2">
                    ประวัติโดเนท (Mock)
                  </div>
                  {history.length ? (
                    <div className="space-y-2">
                      {history.slice(0, 8).map((h) => (
                        <div
                          key={h.donate_id}
                          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[12px] text-white/80"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-white">{h.donate_by}</div>
                            <div className="text-white/70">
                              {fmtMoney(h.amout)} บาท
                            </div>
                          </div>
                          <div className="text-white/60 mt-1">
                            {h.donate_details || "-"}
                          </div>
                          <div className="text-white/40 mt-1">
                            {new Date(h.donate_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[12px] text-white/50">
                      ยังไม่มีประวัติ
                    </div>
                  )}
                </div>

                <div className="text-[12px] text-white/50 mt-6">
                  * หน้านี้เป็น preview (mock) แต่ปุ่ม “ยืนยัน” จะบันทึก
                  donation ลง localStorage จริง
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
