export interface University {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  code: string;
}

export interface Faculty {
  id: string;
  name: string;
  university_id: string;
  universityId?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  faculty_id: string;
  university_id: string;
  facultyId?: string;
  universityId?: string;
}
