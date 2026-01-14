"use client";

import Manubars from "@/components/Menubar_users";
import WidgetVisualInner from "@/components/WidgetVisualInner";
import { SettingDetails, WidgetType } from "@/constants/models";
import BlockUI from "@/libs/BlockUi";
import { getSettingDetails, previewWidget, saveSettingDetails } from "@/services/users/settingInfo";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

const WIDGET_OPTIONS: { id: WidgetType; label: string }[] = [
  { id: 0, label: "Main" },
  { id: 1, label: "Row" },
  { id: 2, label: "Notification" },
];

const Widgetspage = () => {
  const [profileName, setProfileName] = useState("ACDF");
  const [messageText, setMessageText] = useState("ให้น้ำกำลังใจ จากคนรู้ใจ");
  const [amountText, setAmountText] = useState("1000");

  const [widgetStatus, setWidgetStatus] = useState(false);
  const [donateAllTime, setDonateAllTime] = useState(false);
  const [draftWidget, setDraftWidget] = useState<WidgetType>(0);
  const [savedConfig, setSavedConfig] = useState<{
    type: WidgetType | null;
    allTime: boolean;
    status: boolean;
    token?: string;
    steamerId?: number;
  }>({ type: null, allTime: true, status: true });
  const previewDebounce = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [widgetUrl, setWidgetUrl] = useState<string>("")
  const toast = useRef<Toast | null>(null);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout | null>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const getSettingInfo = async () => {
    setLoading(true)
    try {
      const { result } = await getSettingDetails();
      const data = result as SettingDetails;
      const rawUrl = `http://localhost:8000/widgets/widget.html?token=${data?.widgetToken}`
      setWidgetUrl(rawUrl)
      setWidgetStatus(data?.widgetStatus ?? false)
      setDonateAllTime(data?.displayDonateStatus ?? false);
      setDraftWidget(data?.typeSettingDonate as WidgetType ?? 0);
      setSavedConfig(
        {
          type: data?.typeSettingDonate as WidgetType,
          allTime: data?.displayDonateStatus as boolean,
          status: data?.widgetStatus as boolean
        }
      )
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getSettingInfo();
  }, []);

  const onSaveSetting = async () => {
    setSaving(true)
    try {
      const response = await saveSettingDetails({ typeSettingDonate: draftWidget });
      console.log(response);
      showSuccess("บันทึกข้อมูลการตั้งค่าสำเร็จ")
    } catch (err) {
      showError(err as string)
    } finally {
      await getSettingInfo();
      setSaving(false);
    }
  }
  const debouncePreviewWidget = (
    profileName: string,
    amout: number,
    messageText: string,
    delay = 500
  ) => {
    if (previewDebounce.current) clearTimeout(previewDebounce.current);
    previewDebounce.current = setTimeout(async () => {
      setLoading(true)
      try {

        await previewWidget(
          profileName,
          amout,
          messageText
        );
        showSuccess("ส่งข้อมูล ตัวย่างสำเร็จ")
      } catch (err) {
        if (err instanceof Error) {
          showError(err.message);    
        }
      } finally {
        setLoading(false)
      }
    }, delay);
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

  const onToggleAndSave = (
    key: "widgetStatus" | "donateAllTime",
    currentValue: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const nextValue = !currentValue;
    setter(nextValue);
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]!);
    }

    debounceTimers.current[key] = setTimeout(async () => {
      try {
        setSavingKey(key);
        await saveSettingDetails({
          widgetStatus: key === "widgetStatus" ? nextValue : widgetStatus,
          displayDonateStatus: key === "donateAllTime" ? nextValue : donateAllTime,
        });
        showSuccess("บันทึกการตั้งค่าแล้ว");
      } catch (err) {
        showError("บันทึกการตั้งค่าไม่สำเร็จ");
        setter(currentValue);
      } finally {
        setSavingKey(null);
      }
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen text-white">
        <div className="flex max-w-7xl mx-auto h-full pb-10">
          <aside className="pt-20 pr-6">
            <Manubars />
          </aside>
          <Toast ref={toast} />
          <BlockUI loading={loading || saving} message={loading ? "กำลังโหลดข้อมูล..." : "กำลังบันทึก..."} />
          <main className="flex-1 pt-16 pl-6 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent shadow-[0_0_60px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="p-8">
                <header className="flex flex-col gap-4 mb-6">
                  <h2 className="text-[15px] font-semibold text-white/95">
                    ตั้งค่าการจัดการแจ้งเตือนโดเนท
                  </h2>
                  {widgetStatus ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] px-4 py-3 shadow-lg">
                        <div className="flex-1 truncate text-[13px] text-white/85">
                          {widgetUrl}
                        </div>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(widgetUrl);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-2 text-[13px] font-semibold transition-all"
                        >
                          <span className="pi pi-copy" />
                          {copied ? "คัดลอกแล้ว" : "คัดลอก"}
                        </button>
                      </div>

                      <p className="text-[11px] text-white/40 pl-2">
                        คัดลอกลิงก์นี้ไปใส่ในโปรแกรมไลฟ์สดของคุณ เช่น OBS
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-[12px] text-red-300">
                      ⚠️ Widget ถูกปิดอยู่ กรุณาเปิดใช้งานก่อนจึงจะสามารถใช้งาน URL ได้
                    </div>
                  )}
                </header>

                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div className="space-y-4">
                      {[
                        {
                          key: "widgetStatus",
                          label: "เปิดใช้งาน",
                          sub: "เปิด/ปิดการแสดงผลการแจ้งเตือน",
                          state: widgetStatus,
                          setter: setWidgetStatus,
                        },
                        {
                          key: "donateAllTime",
                          label: "โดเนทขึ้นจอ",
                          sub: "แสดงการโดเนทขึ้นจอ",
                          state: donateAllTime,
                          setter: setDonateAllTime,
                        },
                      ].map((t, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <div className="text-[13px] text-white/85">
                              {t.label}
                            </div>
                            <div className="text-[11px] text-white/45">
                              {t.sub}
                            </div>
                          </div>
                          <button
                            disabled={savingKey === t.key}
                            onClick={() =>
                              onToggleAndSave(
                                t.key as any,
                                t.state,
                                t.setter
                              )
                            }
                            className={`relative h-7 w-12 rounded-full border transition-all
                            ${savingKey === t.key ? "opacity-50 cursor-not-allowed" : ""}
                            ${t.state
                                ? "bg-[#00D1FF]/70 border-white/20"
                                : "bg-white/10 border-white/10"}
                             `}
                          >
                            <span
                              className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white transition-all
                            ${t.state ? "left-6" : "left-1"}
                          `}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="text-[12px] text-white/50">
                        Widgets (เลือกประเภทที่ต้องการใช้งาน)
                      </div>
                      {WIDGET_OPTIONS.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setDraftWidget(w.id)}
                          className={`w-full rounded-2xl border transition-all bg-gradient-to-br from-white/[0.1] to-white/[0.04] p-4 ${draftWidget === w.id
                            ? "border-[#00D1FF] shadow-[0_0_42px_rgba(0,209,255,0.3)]"
                            : "border-white/10"
                            }`}
                        >
                          <div className="relative h-[120px] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                            <WidgetVisualInner
                              type={w.id}
                              data={{ profileName, amountText, messageText }}
                            />
                          </div>
                          <div className="relative mt-4 flex items-center justify-between mx-16 gap-2">
                            <span className="text-[20px] font-semibold">
                              {w.label}
                            </span>

                            {/* Saved */}
                            {savedConfig.type === w.id &&
                              draftWidget === w.id && (
                                <span className="rounded-full bg-[#00D1FF]/20 text-[#00D1FF] px-3 py-1 text-[11px]">
                                  บันทึกแล้ว
                                </span>
                              )}

                            {/* Draft (ยังไม่บันทึก) */}
                            {draftWidget === w.id &&
                              savedConfig.type !== w.id && (
                                <span className="rounded-full bg-yellow-400/20 text-yellow-300 px-3 py-1 text-[11px] ">
                                  ยังไม่บันทึก
                                </span>
                              )}
                          </div>
                        </button>
                      ))}
                      {draftWidget !== savedConfig.type && (
                        <div className="text-center text-[11px] text-yellow-300 mb-2">
                          คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก
                        </div>
                      )}

                      <button
                        disabled={saving}
                        onClick={onSaveSetting}
                        className="w-full rounded-2xl bg-[#00D1FF] hover:bg-[#00C0EA] disabled:opacity-50 py-3 text-[14px] font-semibold text-black transition-all"
                      >
                        {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
                      </button>
                    </div>
                  </div>

                  <aside className="col-span-12 lg:col-span-5">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.04] p-6 space-y-5 shadow-xl">
                      <header>
                        <div className="text-[13px] font-semibold">
                          ลองทดสอบการแจ้งเตือน
                        </div>
                        <div className="text-[11px] text-white/40">
                          ดูตัวอย่างหน้าจอแจ้งเตือนแบบเรียลไทม์
                        </div>
                      </header>
                      <div className="space-y-4">
                        {[
                          {
                            label: "ชื่อผู้ใช้",
                            val: profileName,
                            set: setProfileName,
                          },
                          {
                            label: "ข้อความ",
                            val: messageText,
                            set: setMessageText,
                          },
                          {
                            label: "จำนวนเงิน",
                            val: amountText,
                            set: setAmountText,
                            isNumber: true, // เพิ่ม flag
                          },
                        ].map((f, i) => (
                          <div key={i} className="space-y-1.5">
                            <div className="text-[11px] text-white/40">{f.label}</div>
                            <input
                              value={f.val}
                              maxLength={50}
                              onChange={(e) => {
                                if (f.isNumber) {
                                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                                  f.set(onlyNumbers);
                                } else {
                                  f.set(e.target.value);
                                }
                              }}
                              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-[13px] outline-none focus:border-[#00D1FF]/60"
                            />
                          </div>
                        ))}
                        <div className="flex gap-6">
                          <div className="inline-flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${widgetStatus ? "bg-emerald-400" : "bg-red-400"
                                }`}
                            />
                            <span className="text-[12px] text-white/70">
                              {widgetStatus ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${donateAllTime ? "bg-emerald-400" : "bg-red-400"
                                }`}
                            />
                            <span className="text-[12px] text-white/70">
                              {donateAllTime ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                            </span>
                          </div>

                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-[12px]">
                        <div className="text-white/45 mb-2">
                          ตัวอย่างการแจ้งเตือน
                        </div>
                        <div className="font-semibold text-white/90">
                          {profileName || "—"}
                        </div>
                        <div className="text-white/70 mt-1">
                          {messageText || "—"}
                        </div>
                        <div className="font-semibold text-[#00D1FF] mt-1">
                          {amountText || "—"}
                        </div>
                      </div>
                      <button
                        disabled={!donateAllTime || !widgetStatus}
                        onClick={() => debouncePreviewWidget(profileName, Number(amountText.replace(/,/g, '')), messageText)}
                        className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px]
                        border border-white/10
                         ${donateAllTime
                            ? "bg-white/10 hover:bg-white/15 cursor-pointer"
                            : "bg-white/5 opacity-50 cursor-not-allowed"
                          }`}
                      >
                        <span className="pi pi-play" /> ทดลองการแจ้งเตือน
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </main>
        </div>

      </div>
    </>
  );
};

export default Widgetspage;
