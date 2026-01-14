import { ResponseData } from "@/constants/models";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;
export async function registerUser(username: string, email: string, password: string): Promise<ResponseData> {
    const payload = {
        username: username,
        email: email,
        password: password
    }
    const response = await fetch(`${API_BASEURL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: "include",
    }
    )
    return response.json();
}

export async function loginUser(username: string, password: string): Promise<ResponseData> {
    const payload = {
        username: username,
        password: password
    }
    const response = await fetch(`${API_BASEURL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: "include",
    }
    )
    return response.json();
}

export async function logoutUser(): Promise<void> {
    try {
        await fetch(`${API_BASEURL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.warn("Backend logout failed, force client logout", error);
    } finally {
        handleLogout();
    }
}


const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};