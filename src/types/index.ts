// ===== RAKSHAK PORTAL — TYPE DEFINITIONS =====

export type UserRole = 'investigator' | 'sr_investigator' | 'supervisor' | 'analyst' | 'admin';

export interface User {
  id: string;
  name: string;
  badgeNumber: string;
  role: UserRole;
  department: string;
  station: string;
  state: string;
  avatar?: string;
}

export type EntityType = 'person' | 'phone' | 'vehicle' | 'location' | 'organization' | 'case' | 'financial';

export type NetworkRole = 'coordinator' | 'money-man' | 'logistics' | 'recruiter' | 'communicator' | 'unknown';

export interface Entity {
  id: string;
  type: EntityType;
  label: string;
  aliases?: string[];
  attributes: Record<string, string | number | boolean>;
  networkRole?: NetworkRole;
  networkRoleConfidence?: number;
  importanceScore?: number;
  betweennessScore?: number;
  caseIds?: string[];
  locationId?: string;
  createdAt: string;
  lastSeen?: string;
  flagged?: boolean;
  verifiedBy?: string;
}

export interface Person extends Entity {
  type: 'person';
  attributes: {
    name: string;
    age?: number;
    gender?: string;
    phone?: string;
    address?: string;
    state?: string;
    district?: string;
    policeStation?: string;
    aadhaarHash?: string;
    nationality?: string;
    occupation?: string;
    knownAssociates?: string[];
  };
}

export interface PhoneEntity extends Entity {
  type: 'phone';
  attributes: {
    number: string;
    maskedNumber: string;
    carrier?: string;
    registeredName?: string;
    imei?: string;
  };
}

export interface VehicleEntity extends Entity {
  type: 'vehicle';
  attributes: {
    registration: string;
    make?: string;
    model?: string;
    color?: string;
    year?: number;
    ownerName?: string;
  };
}

export interface LocationEntity extends Entity {
  type: 'location';
  attributes: {
    name: string;
    lat: number;
    lng: number;
    state: string;
    district: string;
    policeStation?: string;
    locationType?: 'hideout' | 'meeting-point' | 'crime-scene' | 'residence' | 'transit';
  };
}

export interface CaseEntity extends Entity {
  type: 'case';
  attributes: {
    firNumber: string;
    title: string;
    description: string;
    status: 'active' | 'closed' | 'pending' | 'under-investigation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    policeStation: string;
    district: string;
    state: string;
    filedDate: string;
    ipcSections: string[];
  };
}

export type RelationshipType =
  | 'CALLED'
  | 'OWNS_VEHICLE'
  | 'KNOWS_PERSON'
  | 'ASSOCIATED_WITH'
  | 'APPEARED_IN'
  | 'ACCUSED_IN'
  | 'WITNESS_IN'
  | 'USED_PHONE'
  | 'PRESENT_AT'
  | 'FINANCIAL_TXN'
  | 'MEMBER_OF'
  | 'SIBLING_OF'
  | 'SPOUSE_OF'
  | 'EMPLOYED_BY'
  | 'ORGANIZED_BY'
  | 'RESIDES_AT';

export type VerificationStatus = 'verified' | 'unverified' | 'rejected' | 'uncertain' | 'ai-hypothesis';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  confidence: number; // 0.0 - 1.0
  evidenceSources: EvidenceSource[];
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  timestamp?: string;
  notes?: string;
  flagContradiction?: boolean;
  contradictionNote?: string;
  hashFingerprint?: string;
}

export interface EvidenceSource {
  id: string;
  type: 'fir' | 'cdr' | 'cctv' | 'witness' | 'financial' | 'digital' | 'field-report' | 'intercept';
  title: string;
  documentId: string;
  timestamp: string;
  addedBy: string;
  excerpt?: string;
  pageRef?: string;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityId?: string;
  entityType?: EntityType;
  timestamp: string;
  ipAddress?: string;
  reason?: string;
  sessionId: string;
}

export interface InvestigationPath {
  nodes: Entity[];
  edges: Relationship[];
  totalConfidence: number;
  length: number;
}

export interface CommunityCluster {
  id: string;
  name: string;
  memberIds: string[];
  bridgeNodeIds: string[];
  cohesionScore: number;
  suspicionLevel: 'low' | 'medium' | 'high';
  discoveredAt: string;
}

export interface CopilotQuery {
  id: string;
  query: string;
  language: 'en' | 'hi';
  response: CopilotResponse;
  timestamp: string;
}

export interface CopilotResponse {
  text: string;
  entities: Entity[];
  relationships: Relationship[];
  evidenceCount: number;
  confidenceNote: string;
  isHypothesis: boolean;
  sourcesUsed: string[];
}

export interface GeoMovement {
  entityId: string;
  entityLabel: string;
  path: Array<{ lat: number; lng: number; timestamp: string; location: string }>;
}

export interface TemporalSnapshot {
  period: string; // 'YYYY-MM'
  entityIds: string[];
  relationshipIds: string[];
  newEntities: string[];
  newRelationships: string[];
}

export interface NetworkStats {
  totalEntities: number;
  totalRelationships: number;
  avgConfidence: number;
  verifiedRelationships: number;
  flaggedContradictions: number;
  bridgeNodes: number;
  communities: number;
  activeCases: number;
}

export interface FilterState {
  entityTypes: EntityType[];
  states: string[];
  dateRange: { from: string; to: string } | null;
  confidenceMin: number;
  verificationStatus: VerificationStatus[];
  searchQuery: string;
}
