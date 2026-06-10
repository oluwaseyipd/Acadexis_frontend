export interface ContactMessage {
  id?: string;
  subject: string;
  body: string;
  email: string;
  createdAt?: string;
}

export interface IssueReport {
  id?: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  createdAt?: string;
}
