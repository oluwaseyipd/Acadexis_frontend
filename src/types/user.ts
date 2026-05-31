export interface UserProfile {
  first_name: string;
  last_name: string;
  identification_number: string;
  level: string;
  department: string | null;
  avatar: string | null;
  avatar_url: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  university: string;
  name: string;
  profile: UserProfile;
}

export interface AuthUserMapped extends AuthUser {
  profile: UserProfile & {
    firstName: string;
    lastName: string;
    identificationNumber: string;
    departmentId: string | null;
    universityId: string;
    avatarUrl: string | null;
  };
}
