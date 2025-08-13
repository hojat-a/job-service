export interface IJob {
  id: string;
  externalId: string;
  title: string;
  city?: string | null;
  state?: string | null;
  remote: boolean;
  jobType?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string | null;
  companyName: string;
  companyIndustry?: string | null;
  experience?: number | null;
  skills?: string[] | null;
  postedDate: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any> | null;
}
