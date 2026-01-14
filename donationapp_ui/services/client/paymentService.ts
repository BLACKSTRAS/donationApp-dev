import { CheckStatementResult, paymentInfo, SlipVerifyResponse } from "@/constants/models";
import { TextMessage } from "@/constants/textMessage";

const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL;

export const getPaymentInfo = async (token: string): Promise<paymentInfo | null> => {
  try {
    const response = await fetch(`${API_BASEURL}/paymentInfo/getPaymentInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const rawData = await response.json();
    return rawData?.result ?? null;
  } catch {
    return null;
  }
};

export async function getPaymentInfoBySlip(
    slip: File
): Promise<any> {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY_CHK_SLP; /* เอาจาก MeMark */
    const formData = new FormData;
    formData.append("file", slip);
    try {
        const response = await fetch('https://api.thunder.in.th/v1/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey ?? ''}`
            },
            body: formData
        }
        )
        if (response.status !== 200) {
            throw new Error(TextMessage.SYSYTEM_FAULD);
        }
        return response.json();
    } catch (err) {
        console.error(err);
        throw new Error(TextMessage.SYSYTEM_FAULD);
    }
}

export async function checkStatement(params: {
  token: string;
  payload: string;
  transRef: string;
  date: string;
  amount: number;
  amountSelect: number;
  receiver: string;
  messageDetails:string;
  sender:string; 
}): Promise<CheckStatementResult> {
  try {
    const response = await fetch(`${API_BASEURL}/paymentInfo/checkStatement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await response.json(); 
   

    if (!data.result?.success) { 
      throw new Error(data.message || TextMessage.SYSYTEM_FAULD);
    }

    return data.result; 
  } catch (err: any) {
    throw new Error(err?.message || TextMessage.SYSYTEM_FAULD);
  }
}
