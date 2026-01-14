import { DonationRes, UserInfoInterface } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;

export async function uploadVoiceRef(file: File): Promise<any> {
    try {
        const formData = new FormData;
        formData.append("voice", file);
        const response = await fetch(`${API_BASEURL}/voiceTraining/upload/voice`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        throw new Error(TextMessage.SYSYTEM_FAULD)
    }
}

export async function getListVoice(): Promise<any> {
    try {
        const response = await fetch(`${API_BASEURL}/voiceTraining/getListVoice`, {
            method: "GET",
            credentials: "include"
        });
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}

export async function useVoiceModel(modelId: number): Promise<any> {
    try {
        const payload = {
            modelId: modelId ?? ''
        }
        const response = await fetch(`${API_BASEURL}/voiceTraining/useVoiceModel`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: "include"
        })
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        console.error(err);
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}

export async function deleteVoiceModel(modelId: number): Promise<any> {
    try {
        const payload = {
            modelId: modelId ?? ''
        }
        const response = await fetch(`${API_BASEURL}/voiceTraining/deleteVoiceModel`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: "include"
        })
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        console.error(err);
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}

export async function getVoiceIsUse(): Promise<any> {
    try {
        const response = await fetch(`${API_BASEURL}/voiceTraining/getVoiceIsUse`, {
            method: "GET",
            credentials: "include"
        });
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}
