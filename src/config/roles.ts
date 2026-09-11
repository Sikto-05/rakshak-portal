import type { UserRole } from '../types';

export interface RolePermissions {
  canViewMaskedPhones: boolean;
  canViewUnmaskedPhones: boolean;
  canVerifyRelationships: boolean;
  canManageUsers: boolean;
  canViewAuditLog: boolean;
  canExportData: boolean;
  canAssignCases: boolean;
  canDeleteEntities: boolean;
  canAccessAllCases: boolean;
  canViewFinancials: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  investigator: {
    canViewMaskedPhones: true,
    canViewUnmaskedPhones: false,
    canVerifyRelationships: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canExportData: false,
    canAssignCases: false,
    canDeleteEntities: false,
    canAccessAllCases: false,
    canViewFinancials: false,
  },
  sr_investigator: {
    canViewMaskedPhones: true,
    canViewUnmaskedPhones: true,
    canVerifyRelationships: true,
    canManageUsers: false,
    canViewAuditLog: false,
    canExportData: true,
    canAssignCases: false,
    canDeleteEntities: false,
    canAccessAllCases: false,
    canViewFinancials: true,
  },
  supervisor: {
    canViewMaskedPhones: true,
    canViewUnmaskedPhones: true,
    canVerifyRelationships: true,
    canManageUsers: false,
    canViewAuditLog: true,
    canExportData: true,
    canAssignCases: true,
    canDeleteEntities: false,
    canAccessAllCases: true,
    canViewFinancials: true,
  },
  analyst: {
    canViewMaskedPhones: true,
    canViewUnmaskedPhones: false,
    canVerifyRelationships: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canExportData: true,
    canAssignCases: false,
    canDeleteEntities: false,
    canAccessAllCases: true,
    canViewFinancials: false,
  },
  admin: {
    canViewMaskedPhones: true,
    canViewUnmaskedPhones: true,
    canVerifyRelationships: true,
    canManageUsers: true,
    canViewAuditLog: true,
    canExportData: true,
    canAssignCases: true,
    canDeleteEntities: true,
    canAccessAllCases: true,
    canViewFinancials: true,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  investigator: 'Investigator',
  sr_investigator: 'Sr. Investigator',
  supervisor: 'Supervisor',
  analyst: 'Analyst',
  admin: 'Admin',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  investigator: 'bg-blue-900 text-blue-300 border-blue-700',
  sr_investigator: 'bg-indigo-900 text-indigo-300 border-indigo-700',
  supervisor: 'bg-purple-900 text-purple-300 border-purple-700',
  analyst: 'bg-teal-900 text-teal-300 border-teal-700',
  admin: 'bg-amber-900 text-amber-300 border-amber-700',
};

export const DEMO_CREDENTIALS: Array<{
  username: string;
  password: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  department: string;
  station: string;
  state: string;
}> = [
  {
    username: 'inv.sharma',
    password: 'rakshak@2024',
    name: 'Sub-Inspector Rajesh Sharma',
    role: 'investigator',
    badgeNumber: 'UP-4521',
    department: 'Crime Investigation Unit',
    station: 'Hazratganj PS',
    state: 'Uttar Pradesh',
  },
  {
    username: 'si.verma',
    password: 'rakshak@2024',
    name: 'Inspector Priya Verma',
    role: 'sr_investigator',
    badgeNumber: 'MH-7834',
    department: 'Organized Crime Wing',
    station: 'Colaba PS',
    state: 'Maharashtra',
  },
  {
    username: 'supt.khan',
    password: 'rakshak@2024',
    name: 'Dy. SP Farhan Khan',
    role: 'supervisor',
    badgeNumber: 'DL-1102',
    department: 'Special Task Force',
    station: 'STF HQ Delhi',
    state: 'Delhi',
  },
  {
    username: 'analyst.nair',
    password: 'rakshak@2024',
    name: 'Smt. Kavitha Nair',
    role: 'analyst',
    badgeNumber: 'KL-3345',
    department: 'Intelligence Bureau',
    station: 'State Intelligence Office',
    state: 'Kerala',
  },
  {
    username: 'admin.sys',
    password: 'rakshak@2024',
    name: 'System Administrator',
    role: 'admin',
    badgeNumber: 'SYS-0001',
    department: 'IT & Systems',
    station: 'Central Command',
    state: 'Delhi',
  },
];
