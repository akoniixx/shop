export interface InputDataType {
  prefix?: {
    id: number;
    label: string;
    value: string;
  } | null;
  firstname?: string | null;
  lastname?: string | null;
  nickname?: string | null;
  email?: string | null;
  tel?: string | null;
  role?: {
    id: number;
    label: string;
    value: string;
  } | null;
  file?: any | null;
  isActive?: boolean;
}
export interface UserShopTypes {
  userShopId: string;
  nametitle: string;
  firstname: string;
  lastname: string;
  nickname: string;
  telephone: string;
  secondtelephone: string;
  email: string;
  isActive: boolean;
  statusApprove: null | string; // Assuming it can be a string if not null
  isDelete: boolean;
  isPrimary: boolean;
  primaryId: null | string; // Assuming it can be a string if not null
  position: string;
  idCard: string;
  createDate: string; // Date as ISO string, could also use Date type if you prefer to work with Date objects
  updateDate: string; // Date as ISO string, could also use Date type
  updateBy: string;
  lastLogin: null | string; // Assuming it can be a string if not null, could also use Date type
  notiStatus: boolean;
  profileImage: null | string; // Assuming it can be a string URL if not null
}
