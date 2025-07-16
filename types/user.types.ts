export interface UserTypes {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  role?: string;
  image?: {
    public_id?: string | null;
    url?: string | null;
  };
}
