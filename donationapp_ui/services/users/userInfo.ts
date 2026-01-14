import { DonationRes, UserInfoInterface } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";
import { API_BASEURL } from "@/constants/api";

/* =====================================================
   Get User Info (สำคัญที่สุด)
   ===================================================== */
export async function getUserInfo(): Promise<UserInfoInterface> {
  const response = await fetch(`${API_BASEURL}/api/user/getUserInfo`, {
    method: "GET",
    credentials: "include", // 🔑 cookie
    cache: "no-store", // 🔴 ห้าม cache
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}

/* =====================================================
   Donate History
   ===================================================== */
export async function getDonateHistory(tableOption: DonationRes) {
  if (!tableOption) return;

  const payload = {
    page: tableOption.page ?? 1,
    total: tableOption.total ?? 0,
    totalPages: tableOption.totalPages ?? 1,
    items: tableOption.items ?? [],
    limit: tableOption.limit ?? 10,
    pageSize: tableOption.pageSize,
  };

  try {
    const res = await fetch(`${API_BASEURL}/api/histories/donateHistory`, {
      method: "POST",
      credentials: "include",
      cache: "no-store", // 🔴
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(TextMessage.SYSYTEM_FAULD);
    return (await res.json()) as DonationRes;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* =====================================================
   User Detail
   ===================================================== */
export async function getUserDetailById(): Promise<any> {
  const response = await fetch(`${API_BASEURL}/api/account/getUserDetailById`, {
    method: "GET",
    credentials: "include",
    cache: "no-store", // 🔴
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}

/* =====================================================
   Update Contact
   ===================================================== */
export async function updateUserContact(email?: string, telephone?: string) {
  const payload = {
    ...(email && { email }),
    ...(telephone && { telephone }),
  };

  const response = await fetch(`${API_BASEURL}/api/account/contact`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store", // 🔴
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}

/* =====================================================
   Update Personal
   ===================================================== */
export async function updatePersonalByUserId(
  firstName?: string,
  lastName?: string,
  title?: string,
  birthDay?: Date,
  idCard?: string
) {
  const payload = {
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(title && { title }),
    ...(birthDay && { birthDay }),
    ...(idCard && { idCard }),
  };

  const response = await fetch(`${API_BASEURL}/api/account/personal`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store", // 🔴
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}

/* =====================================================
   Update Address
   ===================================================== */
export async function updateAddressByUserId(
  address?: string,
  province?: string,
  subDistrict?: string,
  zipcode?: string
) {
  const payload = {
    ...(address && { address }),
    ...(province && { province }),
    ...(subDistrict && { subDistrict }),
    ...(zipcode && { zipcode }),
  };

  const response = await fetch(`${API_BASEURL}/api/account/address`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store", // 🔴
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}

/* =====================================================
   Update Payment
   ===================================================== */
export async function updatePaymentByUserId(
  promtPayType?: number,
  promtPayNo?: string,
  bankType?: number,
  bankNo?: string,
  bankUsername?: string
) {
  const payload = {
    ...(promtPayType !== undefined && { promtPayType }),
    ...(promtPayNo && { promtPayNo }),
    ...(bankType !== undefined && { bankType }),
    ...(bankNo && { bankNo }),
    ...(bankUsername && { bankUsername }),
  };

  const response = await fetch(`${API_BASEURL}/api/account/payment`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store", // 🔴
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}

/* =====================================================
   Upload Avatar
   ===================================================== */
export async function uploadUserProfile(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(`${API_BASEURL}/api/account/upload/avatar`, {
    method: "POST",
    credentials: "include",
    cache: "no-store", // 🔴
    body: formData,
  });

  if (!response.ok) {
    throw new Error(TextMessage.SYSYTEM_FAULD);
  }

  return response.json();
}
