import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export async function generatePromptPayQR(
  promptpayNo: string,
  amount?: number
): Promise<string> {
  const payload = generatePayload(promptpayNo, {
    amount: amount,
  });

  // return เป็น base64 image
  return await QRCode.toDataURL(payload);
}