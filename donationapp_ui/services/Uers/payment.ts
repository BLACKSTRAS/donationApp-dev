import { TextMessage } from "@/constants/textMessage";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;

export async function upDateMinAmout(
    minAmout?: number,
): Promise<any> {
    try {
        const payload = {
            minAmout:minAmout ?? 0
        };
        const response = await fetch(`${API_BASEURL}/payment/submitMinAmout`, {
            method: "PATCH",
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

export async function addWordFilter(
    wordFilter: string,
): Promise<any> {
    try {
        const payload = {
            wordFilter:wordFilter
        }
        const response = await fetch(`${API_BASEURL}/payment/addWordFilter`, {
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

export async function addWordForDonat(
    wordDonate: string,
): Promise<any> {
    try {
        const payload = {
            wordDonate:wordDonate
        }
        const response = await fetch(`${API_BASEURL}/payment/addWordForDonat`, {
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

export async function deleteWordFilter(
    wordFilter: string,
): Promise<any> {
    try {
        const payload = {
            wordFilter:wordFilter
        }
        const response = await fetch(`${API_BASEURL}/payment/deletWordFilter`, {
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