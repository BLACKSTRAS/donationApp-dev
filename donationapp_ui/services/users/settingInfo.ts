import { SettingDetails } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;


export async function getSettingDetails(): Promise<any> {
    try {
        const response = await fetch(`${API_BASEURL}/widgetSetting/getUserDetails`, {
            method: "GET",
            credentials: "include",
        });
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        console.error(err);
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}

export async function saveSettingDetails(
    payload: SettingDetails
): Promise<any> {
    try {
        const response = await fetch(`${API_BASEURL}/widgetSetting/saveSetting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: "include",
        });
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        console.error(err);
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}

export async function previewWidget(
    donateBy: string,
    amount: number,
    messageText: string
): Promise<any> {
    try {
        const response = await fetch(`${API_BASEURL}/widgetSetting/previewWidget`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                donate_by: donateBy,
                amount: amount,
                donate_details: messageText,
                soundUrl: "",
            }),
        });
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error(data?.message);
        }
        return data;
    } catch (err) {
        let errorMessage = TextMessage?.SYSYTEM_FAULD;
        if (err instanceof Error) {
            errorMessage = err.message;
        }

        throw new Error(errorMessage);
    }
}