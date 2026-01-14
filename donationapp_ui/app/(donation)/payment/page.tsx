"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { generatePromptPayQR } from "@/libs/utils/promptpay";
import { checkStatement, getPaymentInfoBySlip ,getPaymentInfo} from "@/services/client/paymentService";


import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import BlockUI from "@/libs/BlockUi";
import { paymentInfo } from "@/constants/models";


export default function PaymentPreviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<paymentInfo | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [donateBy, setDonateBy] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [wordDonate, setWordDonate] = useState<string | null>(null);
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");
 
  const toast = useRef<Toast>(null);

  const minAmount = useMemo(() => Number(data?.minDonation ?? 0), [data?.minDonation]);

  // โหลดข้อมูล streamer
  const loadMe = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("t");
      const rawData = await getPaymentInfo(t ?? "");
      if (!rawData) throw new Error("ลิงก์ไม่ถูกต้อง หรือ สตรีมเมอร์ยังไม่ตั้งค่า");
      setData(rawData);
    } catch (e: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: e?.message || "เกิดข้อผิดพลาด",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    setIsAmountValid(amount === "" || Number(amount) >= (data?.minDonation ?? 0));
  }, [amount, data?.minDonation]);

  useEffect(() => {
    if (!data?.promtpayNo) return;
    const qrAmount = amount === "" ? minAmount : Number(amount);
    if (!qrAmount || qrAmount < minAmount) {
      setQrImage(null);
      return;
    }
    const timer = setTimeout(() => {
      generatePromptPayQR(data.promtpayNo, qrAmount)
        .then(setQrImage)
        .catch(() => setQrImage(null));
    }, 500);
    return () => clearTimeout(timer);
  }, [amount, data?.promtpayNo, minAmount]);

  const onSubmitDonation = async () => {
    if (!slipFile) {
      setErr("กรุณาแนบสลิปการโอน");
      return;
    }

    setSubmitting(true);
    setErr("");
    setOkMsg("");

    try {
      const slip = await getPaymentInfoBySlip(slipFile);
      const slipInfo = slip?.data;

      const params = new URLSearchParams(window.location.search);
      const token = params.get("t");

      const result = await checkStatement({
        token: token ?? '',
        payload: slipInfo.payload,
        transRef: slipInfo.transRef,
        date: slipInfo.date,
        amount: slipInfo.amount.amount,
        amountSelect: Number(amount),
        receiver: slipInfo?.receiver?.account?.name?.th,
        messageDetails: details,
        sender: donateBy,
      });

      if (result.success) {
        setOkMsg(result.message);
        toast.current?.show({
          severity: "success",
          summary: "สำเร็จ",
          detail: result.message,
          life: 3000,
        });

        // fetch ข้อมูลใหม่จาก API แทนการรีเซ็ต state
        await loadMe();

        // รีเซ็ต input fields ที่ผู้ใช้กรอก
        setDonateBy("");
        setAmount("");
        setDetails("");
        setSlipFile(null);
      } else {
        setErr(result.message);
        toast.current?.show({
          severity: "error",
          summary: "ล้มเหลว",
          detail: result.message,
          life: 3000,
        });
      }

    } catch (e: any) {
      setErr(e?.message || "เกิดข้อผิดพลาด");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: e?.message || "เกิดข้อผิดพลาด",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Toast ref={toast} />
      <BlockUI loading={submitting} message="กำลังส่งข้อมูล..." />

      <div className="flex max-w-7xl mx-auto h-full pb-10">
        <div className="flex-1 pt-16 pl-6">
          {loading ? (
            <div className="text-white/70 text-sm">กำลังโหลดข้อมูล...</div>
          ) : !data ? (
            <div className="text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm">
              ไม่พบข้อมูล
            </div>
          ) : (
            <div className="flex justify-center gap-8">
              <div className="w-[320px]">
                <div
                  className={`rounded-md border border-white/10 bg-gradient-to-b from-[#1a1f2f] via-[#0b1020] to-black shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden`}
                >
                  <div className="p-4 text-center space-y-3">
                    <div className="text-[12px] text-white/80 leading-snug">
                      {data?.wordDonate ?? data.bankUsername }
                      {minAmount ? <div className="text-white/60 mt-1">โดเนทขั้นต่ำ {data.minDonation} บาท</div> : null}
                    </div>

                    <div className="mx-auto w-[170px] h-[170px] bg-white rounded-sm flex items-center justify-center overflow-hidden">
                      {qrImage ? (
                        <img src={qrImage} alt="PromptPay QR" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-black text-[12px] px-3 text-center">ไม่สามารถสร้าง QR ได้</div>
                      )}
                    </div>

                    <div className="text-left text-[12px] text-white/80 space-y-1 pt-1">
                      <div>
                        ชื่อผู้รับ : <span className="text-white">{data.bankUsername}</span>
                      </div>
                      <div>
                        เลขผู้รับ : <span className="text-white">{data.promtpayNo}</span>
                      </div>
                    </div>

                    <div className="text-left space-y-2 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[12px] text-white/80">จำนวนเงิน :</div>
                          <input
                            value={amount}
                            onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, '');  
                            setAmount(onlyNumbers)}}
                            min={data?.minDonation}
                            maxLength={10}
                            placeholder={`เช่น ${data?.minDonation || 20}`}
                            className="w-full h-8 rounded bg-white/10 border border-white/10 px-3 text-[12px] outline-none"
                          />
                          {!isAmountValid && <div className="text-[11px] text-red-300 mt-1">ต้องไม่น้อยกว่า {data?.minDonation} บาท</div>}
                        </div>

                        <div>
                          <div className="text-[12px] text-white/80">ชื่อผู้โดเนท :</div>
                          <input
                            value={donateBy}
                            maxLength={50}
                            onChange={(e) => setDonateBy(e.target.value)}
                            className="w-full h-8 rounded bg-white/10 border border-white/10 px-3 text-[12px] outline-none"
                            placeholder="เช่น minorda kub"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-[12px] text-white/80">ข้อความ :</div>
                        <input
                          value={details}
                          minLength={50}
                          onChange={(e) => setDetails(e.target.value)}
                          className="w-full h-8 rounded bg-white/10 border border-white/10 px-3 text-[12px] outline-none"
                          placeholder="ข้อความโดเนท"
                        />

                        <div>
                          <div className="text-[12px] mt-2 mb-1 text-white/80">แนบสลิปการโอน :</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                            className="w-full text-[12px] file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[12px] file:bg-white/90 file:text-black text-white/80"
                          />
                          {!slipFile && <div className="text-[11px] text-red-300 mt-1">กรุณาแนบสลิปการโอนเงิน</div>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onSubmitDonation}
                        disabled={submitting || !donateBy || !amount || !isAmountValid || !slipFile}
                        className="w-full h-9 rounded bg-white/90 text-black text-[13px] font-medium hover:bg-white disabled:opacity-50 disabled:hover:bg-white/90 transition"
                      >
                        {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
