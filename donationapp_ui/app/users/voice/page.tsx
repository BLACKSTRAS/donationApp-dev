"use client";

import Manubars from "@/components/Menubar_users";
import BlueBox from "@/components/blueBox";
import { InputTextarea } from 'primereact/inputtextarea';
import { Slider } from "primereact/slider";
import { useRef, useState, useEffect } from "react";
import "./style.css";
import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import test from "node:test";
import { deleteVoiceModel, getListVoice, getVoiceIsUse, uploadVoiceRef, useVoiceModel } from "@/services/users/voiceTraining";
import { listVoicemodel, voicemodel } from "@/constants/models";
import ConfirmDialog from "@/libs/ConformDialog";



export default function voice() {
    const [testMessage, setTestMessage] = useState("");
    const [name, setName] = useState("เสียงอยู่ใสเสียง")
    const [playing, setPlaying] = useState(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const [loading, setLoading] = useState(false);
    const [listVoice, setListVoice] = useState<voicemodel[]>()


    /* confirm dialog */
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState<voicemodel | null>(null);


    useEffect(() => {
        fetchVoices();
    }, []);

    /* for test service tss */
    const togglePlay = async () => {
        const message = testMessage.trim();
        const voiceName = await getVoiceModel();
        console.log(voiceName)
        if (message === "" || !voiceName) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("text", message);
            formData.append("speed", "0.5");
            formData.append("ref_voice_name", voiceName)
            const res = await fetch("http://localhost:5000/tts", {
                method: "POST",
                body: formData,
            });
            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);

            const audio = new Audio(audioUrl);
            audio.play();
        } catch (err) {
            console.error("TTS error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVoices = async (): Promise<void> => {
        try {
            const voice = await getListVoice();
            setListVoice(voice?.result ?? []);
        } catch (error) {
            console.error("Failed to fetch voices:", error);
        }
    };

    const getVoiceModel = async (): Promise<string | null> => {
        try {
            const res = await getVoiceIsUse();
            return res.result ?? null;
        } catch (error) {
            console.error("Failed to fetch voice model:", error);
            return null;
        }
    };
    /* อัปโหลดไฟล์เสียงที่เลือก */
    const onFileSelect = async (e: FileUploadSelectEvent): Promise<void> => {
        const file = e.files?.[0];
        if (!file) {
            console.error("File not found");
            return;
        }
        console.log("ไฟล์ที่เลือก:", file);

        try {
            await uploadVoiceRef(file);
            await fetchVoices();
        } catch (error) {
            console.error("Failed to upload voice:", error);
        } finally {
            fileUploadRef.current?.clear();
        }
    };

    const handleDelete = async (item: voicemodel) => {
        const modelId = item.modelId;
        if (!modelId) return;
        try {
            const response = await deleteVoiceModel(modelId);
            console.log(response);
            await fetchVoices();
        } catch (err) {
            console.log('error is', err)
        }
    }

    const handleUse = async (item: voicemodel) => {
        const modelId = item.modelId;
        if (!modelId) return;
        console.log(modelId);
        try {
            await useVoiceModel(modelId);
            await fetchVoices();
        } catch (err) {
            console.log('error is', err)
        }
    }

    return (

        <div className="min-h-full text-white">
            <ConfirmDialog
                open={confirmOpen}
                title="ลบไฟล์เสียง"
                message={`คุณแน่ใจหรือไม่ว่าต้องการลบเสียง "${selectedVoice?.modelName}"`}
                danger
                confirmText="ลบ"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedVoice(null);
                }}
                onConfirm={async () => {
                    if (!selectedVoice) return;
                    await handleDelete(selectedVoice);
                    setConfirmOpen(false);
                    setSelectedVoice(null);
                }}
            />
            <FileUpload
                mode="basic"
                name="voice"
                auto={false} accept=".wav"
                onSelect={onFileSelect}
                maxFileSize={50000000}
                ref={fileUploadRef}
                style={{ display: 'none' }} />
            <div className="flex max-w-7xl mx-auto h-full pb-10">
                {/* menubar side */}
                <div className="pt-20 pr-6">
                    <Manubars />
                </div>
                <div className="flex-1 pt-16 ">
                    <BlueBox bgFrom="rgb(53,69,96)" bgVia="hsl(220,30%,10%)" bgTo="hsl(214,32%,5%)" className="grid grid-cols-7 pb-20 gap-5">
                        <div className="col-span-7 flex flex-row ">
                            <div className="flex flex-col items-center justify-center mr-3">
                                {loading ? (
                                    <i
                                        className="pi pi-spinner pi-spin text-white"
                                        style={{ fontSize: "2rem" }}
                                    />
                                ) : (
                                    <i
                                        onClick={togglePlay}
                                        style={{ fontSize: "2rem" }}
                                        className={`
                pi ${playing ? "pi-pause-circle" : "pi-play-circle"}
                cursor-pointer text-white
                transition-all duration-200
                hover:text-green-600 hover:scale-110
            `}
                                    />
                                )}
                            </div>
                            <div className="w-full flex flex-col">
                                <span className="bg-white  text-black font-semibold max-w-fit px-3 rounded-t-lg cursor-default">sound</span>
                                <InputTextarea style={{ borderRadius: "0px 0px 1rem 1rem" }} className="w-full  !text-white !border-0 !bg-[linear-gradient(to_right,#45527F_14%,#3A4B62_46%,#3A4B62_70%,#45527F_100%)] " autoResize value={testMessage} onChange={(e) => setTestMessage(e.target.value)} rows={5} cols={20} />
                            </div>
                        </div>
                        <div className="col-span-7 ">
                            <div className=" col-span-7 flex flex-col mt-5 ">
                            <div className="font-extrabold text-xl text-gray-300">ข้อกำหนด</div>
                            <BlueBox bgFrom="#1e293b" bgVia="#1e293b" bgTo="#1e293b" className="my-5">
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                    <li>
                                        <span className="text-red-400 font-medium">ข้อกำหนดสำคัญ:</span>
                                        ไฟล์เสียงต้องมีข้อความว่าประกอบด้วย
                                        <span className="italic text-gray-300">
                                            “ข้าพเจ้ายินยอมให้ใช้งานไฟล์เสียงนี้สำหรับการอ่านข้อความโดเนทบนเว็บไซต์ donate.app”
                                        </span>
                                    </li>
                                    <li>รองรับเฉพาะไฟล์เสียงนามสกุล <span className="font-medium">.wav</span> เท่านั้น</li>
                                    <li>ขนาดไฟล์ต้องไม่เกิน <span className="font-medium">50 MB</span></li>
                                    <li>
                                        โปรดตรวจสอบให้แน่ใจว่าไฟล์เสียงดังกล่าว
                                        <span className="font-medium">ไม่มีลิขสิทธิ์</span>
                                        หรือคุณเป็นผู้มีสิทธิ์ในการใช้งานไฟล์เสียงนั้นอย่างถูกต้อง
                                    </li>
                                </ul>
                            </BlueBox>
                            </div>

                            <div className="col-span-7 flex flex-col mt-5 ">
                            <div className="font-extrabold text-xl text-gray-300">วิธีการแปลงไฟล์เสียง</div>
                            <BlueBox bgFrom="#1e293b" bgVia="#1e293b" bgTo="#1e293b" className="my-5">
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                                                        <li>
                                        <span className="text-red-400 font-medium">ข้อกำหนดสำคัญ:</span>
                                        ไฟล์เสียงต้องมีข้อความว่าประกอบด้วย
                                        <span className="italic text-gray-300">
                                            “ข้าพเจ้ายินยอมให้ใช้งานไฟล์เสียงนี้สำหรับการอ่านข้อความโดเนทบนเว็บไซต์ donate.app”
                                        </span>
                                    </li>
                                    <li>
                                        <span className="font-medium">ขั้นตอนที่ 1:</span>
                                        
                                        <span >
                                            เข้าไปที่เว็บไซต์ <a href="https://online-audio-converter.com/th/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">https://online-audio-converter.com/th/</a>
                                        </span>
                                    </li>
                                    <li> <span className="font-medium">ขั้นตอนที่ 2:</span> คลิกปุ่ม &quot;เลือกไฟล์&quot; เพื่อเลือกไฟล์เสียงของคุณ (รองรับ mp3, m4a, flac, ogg และรูปแบบอื่น ๆ) </li>
                                    <li> <span className="font-medium">ขั้นตอนที่ 3:</span> เลือกรูปแบบเอาต์พุตเป็น <span className="font-bold text-white">.wav </span><span>เเละปรับคุณภาพเสียง ให้เป็น สูงสุด</span></li>
                                    <li>
                                        <span className="font-medium">ขั้นตอนที่ 4:</span>
                                        คลิกปุ่ม &quot;แปลง&quot; และรอให้การแปลงเสร็จสิ้น จากนั้นดาวน์โหลดไฟล์ .wav ที่แปลงแล้ว
                                    </li>
                                </ul>
                            </BlueBox>
                            </div>
                        </div>

                    </BlueBox>
                    <BlueBox bgFrom="#11131F" bgVia="#11131F" bgTo="#11131F" className="-mt-12  relative z-10 shadow-xl">
                        <div className="font-extrabold text-2xl text-gray-300">File Voice</div>
                        <BlueBox onClick={() => fileUploadRef.current?.getInput()?.click()} bgFrom="#1e293b" bgVia="#1e293b" bgTo="#1e293b" className="my-5 py-15 flex justify-center items-center gap-3 hadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:brightness-125 hover:border-white/40 hover:-translate-y-1 hover:shadow-indigo-500/20">
                            <i style={{ fontSize: "20px", padding: "10px", borderRadius: "10px", fontWeight: "bold" }} className="pi pi-plus cursor-pointer bg-[#327ad8]"></i> <div className="font-semibold"> อัปโหลดไฟล์เสียง </div>
                        </BlueBox>
                        {/* loop ใส่ */}
                        {listVoice?.map((item) => (
                            <div key={item.modelId} className="flex flex-row text-gray-500 items-center p-3 rounded-xl transition-colors duration-200 hover:bg-white/10">
                                <div className="text-left flex-1 ml-1 font-medium text-gray-300">
                                    {item?.modelName}</div>
                                <div className="text-center flex-1">
                                    {item.status === 1 ? (
                                        <>
                                            <i className="pi pi-verified text-green-400 mr-2"></i>
                                            <span className="text-sm text-green-400">ผ่านการตรวจสอบ</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="pi pi-times-circle text-red-400 mr-2"></i>
                                            <span className="text-sm text-red-400">ยังไม่ผ่านการตรวจสอบ</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-right flex-1 grid grid-cols-2 gap-4">
                                    {/* USE */}
                                    <button
                                        type="button"
                                        disabled={item.status === 0}
                                        onClick={() => handleUse(item)}
                                        className={`
                                        text-center font-semibold px-1 py-2 rounded-md text-sm
                                        transition-all duration-150
                                        flex items-center justify-center
                                        ${item.status === 1
                                                ? "bg-gray-700/50 border border-gray-600 text-white hover:bg-green-600 hover:border-green-500 cursor-pointer"
                                                : "bg-gray-800/40 border border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                                            }
                                    `}
                                    >
                                        <i className="pr-2 pi pi-arrow-up-right"></i>
                                        Use
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedVoice(item);
                                            setConfirmOpen(true);
                                        }}
                                        className="
                                        text-center font-semibold px-1 py-2 rounded-md text-sm
                                       bg-gray-700/50 border border-gray-600 text-white
                                       hover:bg-red-500 hover:border-red-400
                                        "
                                    >
                                        <i className="pr-2 pi pi-trash"></i>
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

                    </BlueBox>
                </div>
            </div>
        </div>
    );
}