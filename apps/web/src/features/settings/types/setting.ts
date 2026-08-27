export type CompanySettings = {
  name?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type SystemSettings = {
  theme?: "light" | "dark";
  currency?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
};

export type Settings = {
  company: CompanySettings;
  system: SystemSettings;
};

export type UpdateSettingsInput = {
  company?: CompanySettings;
  system?: SystemSettings;
};