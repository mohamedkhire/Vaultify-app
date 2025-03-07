export interface PasswordVersion {
  value: string;
  createdAt: Date;
  name?: string;
  category?: string;
  tags?: string[];
  shared?: boolean;
}

export interface Password {
  id: number;
  name: string;
  category: string;
  currentVersion: PasswordVersion;
  history: PasswordVersion[];
  tags: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

