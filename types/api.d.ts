declare namespace App.Data.Api.V1 {
export type IssueTokenData = {
email: string;
password: string;
device_name: string;
};
export type LoginData = {
email: string;
password: string;
};
export type MessageData = {
message: string;
};
export type RegisterData = {
name: string;
email: string;
password: string;
};
export type StoreTokenData = {
name: string;
};
export type TokenData = {
token: string;
token_type: string;
};
export type UserData = {
id: number;
name: string;
email: string;
email_verified_at: string | null;
created_at: string;
updated_at: string;
};
}
