
import { DonationRes, UserInfoInterface } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;

export async function getUserInfo(): Promise<UserInfoInterface> {
    const response = await fetch(`${API_BASEURL}/user/getUserInfo`, {
        method: "GET",
        credentials: "include",
    });

    if (response.status !== 200) {
        return null as unknown as UserInfoInterface;
    }
    return response.json();
}

export async function getDonateHistory(tableOption: DonationRes) {
    if (!tableOption) return;
    const data = tableOption;
    const payload = {
        page: data.page ?? 1,
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 1,
        items: data.items ?? [],
        limit: data.limit ?? 10,
        pageSize: data.pageSize
    }
    try {
        const res = await fetch(`${API_BASEURL}/histories/donateHistory`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: "include"
        })
        if (res.status !== 200) throw new Error(TextMessage.SYSYTEM_FAULD);

        return (await res.json()) as DonationRes;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getUserDetailById(): Promise<any> {
    try {
        const response = await fetch(`${API_BASEURL}/account/getUserDetailById`, {
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


export async function updateUserContact(email?: string, telephone?: string): Promise<any> {
    try {
        const payload = {
            ...(email !== undefined && { email }),
            ...(telephone !== undefined && { telephone }),
        };
        const response = await fetch(`${API_BASEURL}/account/contact`, {
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

export async function updatePersonalByUserId(
    firstName?: string,
    lastName?: string,
    title?: string,
    birthDay?: Date,
    idCard?: string): Promise<any> {
    try {
        const payload = {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(title !== undefined && { title }),
            ...(birthDay !== undefined && { birthDay }),
            ...(idCard !== undefined && { idCard }),
        };
        const response = await fetch(`${API_BASEURL}/account/personal`, {
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

export async function updateAddressByUserId(
    address?: string,
    province?: string,
    subDistrict?: string,
    zipcode?: string): Promise<any> {
    try {
        const payload = {
            ...(address !== undefined && { address }),
            ...(province !== undefined && { province }),
            ...(subDistrict !== undefined && { subDistrict }),
            ...(zipcode !== undefined && { zipcode }),
        };
        const response = await fetch(`${API_BASEURL}/account/address`, {
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

export async function updatePaymentByUserId(
    promtPayType?: number,
    promtPayNo?: string,
    bankType?: number,
    bankNo?: string,
    bankUsername?: string): Promise<any> {
    try {
        const payload = {
            ...(promtPayType !== undefined && { promtPayType }),
            ...(promtPayNo !== undefined && { promtPayNo }),
            ...(bankType !== undefined && { bankType }),
            ...(bankNo !== undefined && { bankNo }),
            ...(bankUsername !== undefined && { bankUsername }),
        };
        const response = await fetch(`${API_BASEURL}/account/payment`, {
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

export async function uploadUserProfile(file: File): Promise<any> {
    try {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await fetch(`${API_BASEURL}/account/upload/avatar`, {
            method: "POST",
            body: formData,
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