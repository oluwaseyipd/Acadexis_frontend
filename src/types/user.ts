export interface UserProfile {
  first_name: string;
  last_name: string;
  identification_number: string;
  level: string;
  department: string | null;
  department_name: string | null;
  faculty: string | null;
  faculty_name: string | null;
  university: string | null;
  university_name: string | null;
  avatar: string | null;
  avatar_url: string | null;
}

export type UserRole = "student" | "lecturer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  university: string;
  university_name: string | null;
  name: string;
  profile: UserProfile;
}

export interface AuthUserMapped extends AuthUser {
  profile: UserProfile & {
    firstName: string;
    lastName: string;
    email: string;
    identificationNumber: string;
    department: string | null;
    departmentName: string | null;
    faculty: string | null;
    facultyName: string | null;
    university: string | null;
    universityName: string | null;
    avatarUrl: string | null;
  };
}
