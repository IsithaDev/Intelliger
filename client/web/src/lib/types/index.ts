export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  gender: "male" | "female";
  dateOfBirth: Date;
  images?: {
    profile?: {
      publicId: string;
      url: string;
    };
    cover?: {
      publicId: string;
      url: string;
    };
  };
  role: "user" | "admin";
  email: {
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
