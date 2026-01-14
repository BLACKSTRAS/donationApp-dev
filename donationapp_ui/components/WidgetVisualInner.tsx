"use client";

import { WidgetConfig } from "@/constants/models";
import { useState } from "react";



const WidgetVisualInner = ({ type, data, isLarge = false }: any) => {
    const [config, setConfig] = useState<WidgetConfig>({
        theme: {
            bg: "rgba(0,0,0,0.55)",
            accent: "#00D1FF",
            name: "#FFE082",
        },
        position: {
            x: "50%",
            y: "20%",
        },
        duration: 4200,
        sound: {
            enabled: true,
            volume: 0.8,
        },
    });
    return (
        <>
            <div className="absolute inset-0" style={{ background: config.theme.bg }} />
            <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#00D1FF]/10 blur-3xl" />
            <div className="relative z-10 w-full flex justify-center px-5">
                {type === 0 && (
                    <div className="flex flex-col items-center text-center">
                        <div
                            className={`${isLarge ? "h-14 w-14" : "h-12 w-12"
                                } rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70`}
                        >
                            <span
                                className={`pi pi-user ${isLarge ? "text-[18px]" : "text-[16px]"
                                    }`}
                            />
                        </div>

                        <div
                            className={`mt-2 font-semibold ${isLarge ? "text-[12px]" : "text-[11px]"
                                }`}
                            style={{ color: config.theme.name }}
                        >
                            {data.profileName || "—"}
                        </div>

                        <div
                            className={`mt-1 font-extrabold leading-none ${isLarge ? "text-[28px]" : "text-[18px]"
                                }`}
                            style={{ color: config.theme.accent }}
                        >
                            {data.amountText || "—"}
                        </div>

                        <div
                            className={`mt-1 line-clamp-2 ${isLarge ? "text-[12px]" : "text-[10px]"
                                }`}
                            style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                            {data.messageText || "—"}
                        </div>
                    </div>
                )}

                {type === 1 && (
                    <div className="flex items-center gap-4">
                        <div
                            className={`${isLarge ? "h-16 w-16" : "h-14 w-14"
                                } rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70`}
                        >
                            <span
                                className={`pi pi-user ${isLarge ? "text-[20px]" : "text-[18px]"
                                    }`}
                            />
                        </div>

                        <div className="min-w-0 text-left">
                            <div
                                className="text-[11px] font-semibold truncate"
                                style={{ color: config.theme.name }}
                            >
                                {data.profileName || "—"}
                            </div>

                            <div
                                className={`font-extrabold leading-none ${isLarge ? "text-[30px]" : "text-[22px]"
                                    }`}
                                style={{ color: config.theme.accent }}
                            >
                                {data.amountText || "—"}
                            </div>

                            <div
                                className="mt-1 text-[10px] truncate"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                {data.messageText || "—"}
                            </div>
                        </div>
                    </div>
                )}

                {type === 2 && (
                    <div
                        className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 w-full max-w-[420px] ${isLarge ? "px-5 py-4" : "px-4 py-3"
                            }`}
                    >
                        <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 shrink-0">
                            <span className="pi pi-user text-[14px]" />
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                            <div
                                className="text-[11px] font-semibold truncate"
                                style={{ color: config.theme.name }}
                            >
                                {data.profileName || "—"}
                                <span
                                    className="ml-2 font-extrabold"
                                    style={{ color: config.theme.accent }}
                                >
                                    {data.amountText || "—"}
                                </span>
                            </div>

                            <div
                                className="mt-0.5 text-[10px] truncate"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                {data.messageText || "—"}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};

export default WidgetVisualInner;
