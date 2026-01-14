"use client";

import Manubars from "@/components/Menubar_users";
import BlueBox from "@/components/blueBox";
import { InputTextarea } from 'primereact/inputtextarea';
import { Slider } from "primereact/slider";
import { useRef, useState, useEffect } from "react";
import "./style.css";
import { Button } from "primereact/button";
import { FileUpload } from 'primereact/fileupload';



export default function voice() {
    const [testMessage, setTestMessage] = useState("");
    const [name, setName] = useState("เสียงอยู่ใสเสียง")
    const [statusVoice, setStatusVoice] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        console.log(audio.duration)
        const onLoaded = () => {
            setDuration(audio.duration);
        };

        const onTime = () => {
            setCurrent(audio.currentTime);
        };

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("timeupdate", onTime);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("timeupdate", onTime);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            setPlaying(true);
        } else {
            audio.pause();
            setPlaying(false);
        }
    };

    const onFileSelect = (e: any) => {
        const file = e.files[0];
        console.log(e)
        console.log("ไฟล์ที่เลือก:", file);
    };

    return (

        <div className="min-h-full text-white">
            <FileUpload mode="basic" name="audio[]" auto={false} accept=".wav" onSelect={onFileSelect} maxFileSize={50000000} ref={fileUploadRef} style={{ display: 'none' }} />
            <div className="flex max-w-7xl mx-auto h-full pb-10">
                {/* menubar side */}
                <div className="pt-20 pr-6">
                    <Manubars />
                </div>
                <div className="flex-1 pt-16 ">
                    <BlueBox bgFrom="rgb(53,69,96)" bgVia="hsl(220,30%,10%)" bgTo="hsl(214,32%,5%)" className="grid grid-cols-7 pb-20 gap-5">
                        <div className="col-span-4 flex flex-row ">
                            < div className="flex flex-col items-center justify-center mr-3"><i
                                onClick={togglePlay}
                                style={{ fontSize: "2rem" }}
                                className={`
                                         pi ${playing === true ? "pi-pause-circle" : "pi-play-circle"} cursor-pointer 
                                      text-white transition-all duration-200 hover:text-green-600   hover:scale-110`}
                            ></i></div>
                            <div className="w-full flex flex-col">
                                <span className="bg-white  text-black font-semibold max-w-fit px-3 rounded-t-lg cursor-default">sound</span>
                                <InputTextarea style={{ borderRadius: "0px 0px 1rem 1rem" }} className="w-full  !text-white !border-0 !bg-[linear-gradient(to_right,#45527F_14%,#3A4B62_46%,#3A4B62_70%,#45527F_100%)] " autoResize value={testMessage} onChange={(e) => setTestMessage(e.target.value)} rows={5} cols={20} />
                            </div>
                        </div>
                        <div className="col-span-3 ">
                            <BlueBox className="mt-6 flex flex-col  h-[9rem]">
                                <div className="flex flex-row justify-between"> <span className="font-semibold">pick your preferred version</span> <span className="bg-[#005EFF] px-2 py-0.5 cursor-pointer font-semibold rounded-[5px]">Regenerate</span></div>
                                <div className="flex flex-row mt-4">
                                    <div className="pt-1"><span className={`py-0.5 px-2.5 border-amber-200 border-6 rounded-full  ${statusVoice === true ? "bg-green-400" : "bg-red-400 "} `}></span></div>
                                    <div className="mx-5"><i
                                        onClick={togglePlay}
                                        style={{ fontSize: "2rem" }}
                                        className={`
                                         pi ${playing === true ? "pi-pause-circle" : "pi-play-circle"} cursor-pointer 
                                      text-white transition-all duration-200 hover:text-green-600   hover:scale-110`}
                                    ></i></div>
                                    <div className="pt-2 w-70">
                                        {/* audio logic */}
                                        <audio
                                            ref={audioRef}
                                            src="/test.mp3"
                                            preload="metadata"

                                        />
                                        <Slider
                                            value={current}
                                            max={duration}
                                            onChange={(e) => {
                                                if (audioRef.current && typeof e.value === "number") {
                                                    audioRef.current.currentTime = e.value;
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </BlueBox>
                        </div>
                    </BlueBox>
                    <BlueBox bgFrom="#11131F" bgVia="#11131F" bgTo="#11131F" className="-mt-12  relative z-10 shadow-xl">
                        <div className="font-extrabold text-2xl text-gray-300">File Voice</div>
                        <BlueBox onClick={() => fileUploadRef.current?.getInput()?.click()} bgFrom="#1e293b" bgVia="#1e293b" bgTo="#1e293b" className="my-5 py-15 flex justify-center items-center gap-3 hadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:brightness-125 hover:border-white/40 hover:-translate-y-1 hover:shadow-indigo-500/20">
                            <i style={{ fontSize: "20px", padding: "10px", borderRadius: "10px", fontWeight: "bold" }} className="pi pi-plus cursor-pointer bg-[#327ad8]"></i> <div className="font-semibold"> อัปโหลดไฟล์เสียง </div>
                        </BlueBox>
                        {/* loop ใส่ */}
                        <div className="flex flex-row text-gray-500 items-center p-3 rounded-xl transition-colors duration-200 hover:bg-white/10">
                            <div className="text-left flex-1 ml-1 font-medium text-gray-300">{name}</div>
                            <div className="text-center flex-1">
                                <i className="pi pi-verified text-green-400 mr-2"></i>
                                <span className="text-sm">ผ่านการตรวจสอบ</span>
                            </div>
                            <div className="text-right flex-1 grid grid-cols-2 gap-4">
                                <span className="text-center font-semibold px-1 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white cursor-pointer transition-all duration-150 hover:bg-green-600 hover:border-green-500 text-sm">
                                    <i className="pr-2 pi pi-arrow-up-right"></i>Use
                                </span>
                                <span className="text-center font-semibold px-1 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white cursor-pointer transition-all duration-150 hover:bg-red-500 hover:border-red-400 text-sm">
                                    <i className="pr-2 pi pi-trash"></i>Delete
                                </span>
                            </div>

                        </div>
                    </BlueBox>
                </div>
            </div>
        </div>
    );
}