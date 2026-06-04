export interface UserProfile {
  first_name: string;
  last_name: string;
  identification_number: string;
  level: string;
  department: string | null;
  faculty: string | null;
  avatar: string | null;
  avatar_url: string | null;
}

export type UserRole = "student" | "lecturer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  university: string;
  name: string;
  profile: UserProfile;
}

export interface AuthUserMapped extends AuthUser {
  profile: UserProfile & {
    firstName: string;
    lastName: string;
    identificationNumber: string;
    department: string | null;
    faculty: string | null;
    university: string;
    avatarUrl: string | null;
  };
}
