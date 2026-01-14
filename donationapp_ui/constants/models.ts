export interface ResponseData {
    status: number,
    message: string,
    user?: any,
    token?: string,
}
export type listMonth =
    | "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun"
    | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

export type listDay = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type objectData = {
    total: number;
    count: number;
}

export type DonationLite = {
    donate_at: string;
    donate_details: string | null;
    amout: number;
};

export interface DonationHistoryChartProps {
    donations: DonationLite[];
    range: RangeKey;
    onChangeRange: (r: RangeKey) => void;
}

export type RangeKey = "7d" | "30d" | "1y" | "all";

export type ChartRow = {
    label: string;
    total: number;
    count: number;
};

export interface UserInfoInterface {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    role: string
}

export type DonationRow = {
    donate_id: number;
    donate_at: string | null;
    donate_by: string | null;
    donate_details: string | null;
    amout: string; // pg numeric -> string
    payment_type: string;
    status: string;
};

export type DonationRes = {
    page?: number;
    limit?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    items?: DonationRow[];
    sortBy?: string,
    sortDir?: string,
};

export interface StreamerDetail {
    streamerId: number,
    userId: number,
    userName: string,
    email: string,
    phoneNumber?: string,
    title?: string,
    firstName?: string,
    lastName?: string,
    address?: string,
    subDistrict?: string,
    distric?: string
    province?: string,
    zipcode?: string,
    promtPayType?: number,
    promtPayNumber?: string,
    promtPayNo?: string,
    bankType?: number,
    bankNo?: string,
    bankUsername?: string,
    role?: string,
    creatDate?: string,
    totalDonate?: string,
    idCard?: string,
    birthDay?: any,
    imageUser?: string,
}

export type FormContact = {
    email?: string,
    phoneNumber?: string;
}

export type FormPersonal = {
    title?: string,
    firstName?: string,
    lastName?: string,
    birthDay?: string,
    idCard?: string,
}

export type FormAddress = {
    address?: string,
    subDistrict?: string,
    distric?: string,
    province?: string,
    zipcode?: string,
}

export type FormPayment = {
    promtPayType?: number,
    promtPayNumber?: string,
    promtPayNo?: string,
    bankType?: number,
    bankNo?: string,
    bankUsername?: string,
}


export type voicemodel = {
    modelId: number,
    modelName: string,
    steamerId?: string,
    status: number,
    remark?: string,
    configPath:string,
}

export type listVoicemodel = {
    listVoice : voicemodel[],
}

export type paymentInfo = {
  wordDonate:string,
  promtpayNo: string;
  bankNo: string;
  bankUsername: string;
  minDonation: number;
};

export interface SlipVerifyResponse {
  payload: string;
  transRef: string;
  date: string; 
  amount: number;
  fee: number;
  ref1: string;
  ref2: string;
  ref3: string;
  sender: string;
  receiver: string;
}

export type CheckStatementResult = {
  success: boolean;
  message: string;
  amount?: number;
  transRef?: string;
  date?: string;
};



export type WidgetConfig = {
  theme: {
    bg: string;
    accent: string;
    name: string;
  };
  position: {
    x: string;
    y: string;
  };
  duration: number;
  sound: {
    enabled: boolean;
    volume: number;
  };
};

export type WidgetType = 0 | 1 | 2;

export interface SettingDetails {
    displayDonateStatus?:boolean,
    widgetStatus?:boolean,
    typeSettingDonate?:number,
    widgetToken?:string
}

