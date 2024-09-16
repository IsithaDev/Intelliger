export type Image = {
  publicId: string;
  url: string;
};

export type Code =
  | "ERROR"
  | "SENDING_EMAIL_ERROR"
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_VERIFIED";
