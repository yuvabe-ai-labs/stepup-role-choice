export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "interviewed"
  | "hired";

export type OfferDecision = "pending" | "accepted" | "rejected";

export interface Application {
  id: string;
  status: ApplicationStatus;
  offer_decision: OfferDecision;
  applied_date: string;
  cover_letter: string;
  internship: Internship;
}

export interface Internship {
  id: string;
  title: string;
  description: string;
  duration: string;
  created_by: string;
  company_name: string;
  company_profile: CompanyProfile;
}

export interface CompanyProfile {
  id: string;
  full_name: string;
  email: string;
  unit: Unit;
}

export interface Unit {
  unit_name: string;
  avatar_url: string;
}

export interface MyApplicationsResponse {
  data: Application[];
  error: any;
}
