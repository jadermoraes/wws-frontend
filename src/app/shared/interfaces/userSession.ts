import { LabelValue } from "./labelValue";

export interface UserSession {
    email: string;
    role: 'admin' | 'user';
    firstName: string;
    lastName: string;
    profilePicture: string;
    userPreferences: LabelValue[];
  }
  