// ===== RAKSHAK PORTAL — SYNTHETIC DATASET =====
// DISCLAIMER: All data is completely synthetic and de-identified.
// No real persons, cases, or criminal records are represented.
// For demonstration and evaluation purposes only.
// NOT connected to live CCTNS / ICJS / NAFIS systems.

import type {
  Entity, Relationship, CommunityCluster, TemporalSnapshot, NetworkStats,
  Person, PhoneEntity, VehicleEntity, LocationEntity, CaseEntity
} from '../types';

// ── LOCATIONS ──────────────────────────────────────────────────────────────
export const LOCATIONS: LocationEntity[] = [
  { id: 'LOC-001', type: 'location', label: 'Hazratganj, Lucknow', createdAt: '2023-01-15', attributes: { name: 'Hazratganj', lat: 26.8494, lng: 80.9446, state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Hazratganj PS', locationType: 'meeting-point' } },
  { id: 'LOC-002', type: 'location', label: 'Dharavi, Mumbai', createdAt: '2023-02-10', attributes: { name: 'Dharavi', lat: 19.0419, lng: 72.8528, state: 'Maharashtra', district: 'Mumbai', policeStation: 'Dharavi PS', locationType: 'hideout' } },
  { id: 'LOC-003', type: 'location', label: 'Paharganj, Delhi', createdAt: '2023-01-20', attributes: { name: 'Paharganj', lat: 28.6445, lng: 77.2101, state: 'Delhi', district: 'Central Delhi', policeStation: 'Paharganj PS', locationType: 'crime-scene' } },
  { id: 'LOC-004', type: 'location', label: 'Koramangala, Bengaluru', createdAt: '2023-03-05', attributes: { name: 'Koramangala', lat: 12.9279, lng: 77.6271, state: 'Karnataka', district: 'Bengaluru Urban', policeStation: 'Koramangala PS', locationType: 'residence' } },
  { id: 'LOC-005', type: 'location', label: 'Karkhana, Hyderabad', createdAt: '2023-02-28', attributes: { name: 'Karkhana', lat: 17.4647, lng: 78.4028, state: 'Telangana', district: 'Hyderabad', policeStation: 'Karkhana PS', locationType: 'meeting-point' } },
  { id: 'LOC-006', type: 'location', label: 'New Market, Bhopal', createdAt: '2023-04-11', attributes: { name: 'New Market', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', district: 'Bhopal', policeStation: 'Bhopal Kotwali PS', locationType: 'crime-scene' } },
  { id: 'LOC-007', type: 'location', label: 'Sector 14, Faridabad', createdAt: '2023-03-22', attributes: { name: 'Sector 14', lat: 28.4089, lng: 77.3178, state: 'Haryana', district: 'Faridabad', policeStation: 'NIT PS', locationType: 'hideout' } },
  { id: 'LOC-008', type: 'location', label: 'Chandni Chowk, Delhi', createdAt: '2023-01-08', attributes: { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2301, state: 'Delhi', district: 'North Delhi', policeStation: 'Chandni Chowk PS', locationType: 'transit' } },
  { id: 'LOC-009', type: 'location', label: 'Govandi, Mumbai', createdAt: '2023-05-15', attributes: { name: 'Govandi', lat: 19.0598, lng: 72.9157, state: 'Maharashtra', district: 'Mumbai', policeStation: 'Govandi PS', locationType: 'residence' } },
  { id: 'LOC-010', type: 'location', label: 'Aminabad, Lucknow', createdAt: '2023-02-07', attributes: { name: 'Aminabad', lat: 26.8556, lng: 80.9364, state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Aminabad PS', locationType: 'meeting-point' } },
  { id: 'LOC-011', type: 'location', label: 'Tilak Nagar, Delhi', createdAt: '2023-04-18', attributes: { name: 'Tilak Nagar', lat: 28.6388, lng: 77.0974, state: 'Delhi', district: 'West Delhi', policeStation: 'Tilak Nagar PS', locationType: 'hideout' } },
  { id: 'LOC-012', type: 'location', label: 'Andheri East, Mumbai', createdAt: '2023-06-01', attributes: { name: 'Andheri East', lat: 19.1136, lng: 72.8697, state: 'Maharashtra', district: 'Mumbai Suburban', policeStation: 'Andheri PS', locationType: 'transit' } },
];

// ── PERSONS ──────────────────────────────────────────────────────────────
export const PERSONS: Person[] = [
  // Network Alpha — Organised extortion ring
  { id: 'P-001', type: 'person', label: 'Mohammad Arif Sheikh', aliases: ['Md. Arif', 'M. Arif Sheikh', 'Arif Bhai'], createdAt: '2023-01-15', flagged: true, networkRole: 'coordinator', networkRoleConfidence: 0.87, importanceScore: 94, betweennessScore: 0.82, caseIds: ['C-001','C-002'], locationId: 'LOC-001', attributes: { name: 'Mohammad Arif Sheikh', age: 38, gender: 'M', phone: '+91-9876543210', address: 'Mohallah Khala, Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Hazratganj PS', nationality: 'Indian', occupation: 'Real Estate Agent' } },
  { id: 'P-002', type: 'person', label: 'Suresh Kumar Yadav', aliases: ['Suresh Bhai', 'SKY'], createdAt: '2023-01-20', flagged: true, networkRole: 'logistics', networkRoleConfidence: 0.79, importanceScore: 78, betweennessScore: 0.61, caseIds: ['C-001'], locationId: 'LOC-001', attributes: { name: 'Suresh Kumar Yadav', age: 34, gender: 'M', phone: '+91-9765432109', address: 'Yahiyaganj, Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Hazratganj PS', nationality: 'Indian', occupation: 'Transport Contractor' } },
  { id: 'P-003', type: 'person', label: 'Reshma Bano', aliases: ['Reshma', 'R. Bano'], createdAt: '2023-02-08', flagged: false, networkRole: 'communicator', networkRoleConfidence: 0.65, importanceScore: 55, betweennessScore: 0.43, caseIds: ['C-001'], locationId: 'LOC-010', attributes: { name: 'Reshma Bano', age: 28, gender: 'F', phone: '+91-9654321098', address: 'Aminabad, Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Aminabad PS', nationality: 'Indian', occupation: 'Housewife' } },
  { id: 'P-004', type: 'person', label: 'Vijay Prakash Mishra', aliases: ['Vijay Bhai', 'VP Mishra'], createdAt: '2023-01-28', flagged: true, networkRole: 'money-man', networkRoleConfidence: 0.91, importanceScore: 88, betweennessScore: 0.72, caseIds: ['C-001','C-003'], locationId: 'LOC-001', attributes: { name: 'Vijay Prakash Mishra', age: 45, gender: 'M', phone: '+91-9543210987', address: 'Nishatganj, Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Naka Hindola PS', nationality: 'Indian', occupation: 'Hawala Dealer' } },
  // Network Beta — Vehicle trafficking ring
  { id: 'P-005', type: 'person', label: 'Imran Hussain Qureshi', aliases: ['Imran Q', 'IHQ'], createdAt: '2023-03-05', flagged: true, networkRole: 'coordinator', networkRoleConfidence: 0.83, importanceScore: 85, betweennessScore: 0.76, caseIds: ['C-002','C-004'], locationId: 'LOC-002', attributes: { name: 'Imran Hussain Qureshi', age: 41, gender: 'M', phone: '+91-9432109876', address: 'Dharavi, Mumbai', state: 'Maharashtra', district: 'Mumbai', policeStation: 'Dharavi PS', nationality: 'Indian', occupation: 'Auto Parts Dealer' } },
  { id: 'P-006', type: 'person', label: 'Pradeep Nair', aliases: ['Pradeep', 'P. Nair'], createdAt: '2023-03-12', flagged: false, networkRole: 'logistics', networkRoleConfidence: 0.70, importanceScore: 62, betweennessScore: 0.48, caseIds: ['C-004'], locationId: 'LOC-004', attributes: { name: 'Pradeep Nair', age: 36, gender: 'M', phone: '+91-9321098765', address: 'Koramangala, Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban', policeStation: 'Koramangala PS', nationality: 'Indian', occupation: 'Driver' } },
  { id: 'P-007', type: 'person', label: 'Anita Desai', aliases: ['Anita D'], createdAt: '2023-04-01', flagged: false, importanceScore: 42, betweennessScore: 0.28, caseIds: ['C-004'], locationId: 'LOC-004', attributes: { name: 'Anita Desai', age: 31, gender: 'F', phone: '+91-9210987654', address: 'Koramangala, Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban', policeStation: 'Koramangala PS', nationality: 'Indian', occupation: 'Receptionist' } },
  // Network Gamma — Cyber fraud
  { id: 'P-008', type: 'person', label: 'Rohan Mehta', aliases: ['Roh', 'RMehta'], createdAt: '2023-04-15', flagged: true, networkRole: 'coordinator', networkRoleConfidence: 0.88, importanceScore: 82, betweennessScore: 0.68, caseIds: ['C-003','C-005'], locationId: 'LOC-003', attributes: { name: 'Rohan Mehta', age: 27, gender: 'M', phone: '+91-9109876543', address: 'Paharganj, Delhi', state: 'Delhi', district: 'Central Delhi', policeStation: 'Paharganj PS', nationality: 'Indian', occupation: 'Freelancer' } },
  { id: 'P-009', type: 'person', label: 'Kavita Singh', aliases: ['KS', 'Kavita'], createdAt: '2023-04-22', flagged: false, networkRole: 'money-man', networkRoleConfidence: 0.73, importanceScore: 67, betweennessScore: 0.54, caseIds: ['C-003'], locationId: 'LOC-003', attributes: { name: 'Kavita Singh', age: 29, gender: 'F', phone: '+91-9098765432', address: 'Tilak Nagar, Delhi', state: 'Delhi', district: 'West Delhi', policeStation: 'Tilak Nagar PS', nationality: 'Indian', occupation: 'Bank Employee' } },
  { id: 'P-010', type: 'person', label: 'Aziz Ur Rehman', aliases: ['Aziz', 'A. Rehman', 'Aziz bhai'], createdAt: '2023-05-05', flagged: true, networkRole: 'recruiter', networkRoleConfidence: 0.76, importanceScore: 71, betweennessScore: 0.58, caseIds: ['C-005'], locationId: 'LOC-007', attributes: { name: 'Aziz Ur Rehman', age: 44, gender: 'M', phone: '+91-9987654321', address: 'Sector 14, Faridabad', state: 'Haryana', district: 'Faridabad', policeStation: 'NIT PS', nationality: 'Indian', occupation: 'Garment Trader' } },
  // Bridge node — connects Alpha and Beta networks
  { id: 'P-011', type: 'person', label: 'Deepak Tiwari', aliases: ['Deepu', 'DT'], createdAt: '2023-02-18', flagged: true, networkRole: 'logistics', networkRoleConfidence: 0.81, importanceScore: 91, betweennessScore: 0.89, caseIds: ['C-001','C-002','C-004'], locationId: 'LOC-008', attributes: { name: 'Deepak Tiwari', age: 40, gender: 'M', phone: '+91-9876001122', address: 'Chandni Chowk, Delhi', state: 'Delhi', district: 'North Delhi', policeStation: 'Chandni Chowk PS', nationality: 'Indian', occupation: 'Courier Agent' } },
  // More entities...
  { id: 'P-012', type: 'person', label: 'Lakshmi Patel', aliases: ['Lakshmi', 'L. Patel'], createdAt: '2023-05-20', flagged: false, importanceScore: 38, betweennessScore: 0.22, caseIds: ['C-005'], locationId: 'LOC-005', attributes: { name: 'Lakshmi Patel', age: 33, gender: 'F', phone: '+91-9765110033', address: 'Karkhana, Hyderabad', state: 'Telangana', district: 'Hyderabad', policeStation: 'Karkhana PS', nationality: 'Indian', occupation: 'Shopkeeper' } },
  { id: 'P-013', type: 'person', label: 'Ravi Shankar Gupta', aliases: ['RSG', 'Ravi G'], createdAt: '2023-03-30', flagged: false, importanceScore: 45, betweennessScore: 0.31, caseIds: ['C-002'], locationId: 'LOC-006', attributes: { name: 'Ravi Shankar Gupta', age: 52, gender: 'M', phone: '+91-9654009911', address: 'New Market, Bhopal', state: 'Madhya Pradesh', district: 'Bhopal', policeStation: 'Bhopal Kotwali PS', nationality: 'Indian', occupation: 'Accountant' } },
  { id: 'P-014', type: 'person', label: 'Salim Khan', aliases: ['Salim', 'SK'], createdAt: '2023-06-10', flagged: true, networkRole: 'communicator', networkRoleConfidence: 0.68, importanceScore: 59, betweennessScore: 0.45, caseIds: ['C-002','C-005'], locationId: 'LOC-009', attributes: { name: 'Salim Khan', age: 35, gender: 'M', phone: '+91-9543778899', address: 'Govandi, Mumbai', state: 'Maharashtra', district: 'Mumbai', policeStation: 'Govandi PS', nationality: 'Indian', occupation: 'Mechanic' } },
  { id: 'P-015', type: 'person', label: 'Priya Kumari', aliases: ['Priya K'], createdAt: '2023-06-22', flagged: false, importanceScore: 29, betweennessScore: 0.15, caseIds: ['C-003'], locationId: 'LOC-011', attributes: { name: 'Priya Kumari', age: 24, gender: 'F', phone: '+91-9432667788', address: 'Tilak Nagar, Delhi', state: 'Delhi', district: 'West Delhi', policeStation: 'Tilak Nagar PS', nationality: 'Indian', occupation: 'Student' } },
  // Additional persons for richness
  { id: 'P-016', type: 'person', label: 'Harish Chand Verma', aliases: ['HC Verma'], createdAt: '2023-07-01', flagged: false, importanceScore: 34, betweennessScore: 0.19, caseIds: ['C-001'], locationId: 'LOC-001', attributes: { name: 'Harish Chand Verma', age: 48, gender: 'M', phone: '+91-9321556677', address: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Hazratganj PS', nationality: 'Indian', occupation: 'Property Dealer' } },
  { id: 'P-017', type: 'person', label: 'Noorjahan Begum', aliases: ['Noori'], createdAt: '2023-07-15', flagged: false, importanceScore: 28, betweennessScore: 0.13, caseIds: ['C-001'], locationId: 'LOC-010', attributes: { name: 'Noorjahan Begum', age: 55, gender: 'F', phone: '+91-9210445566', address: 'Aminabad, Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', policeStation: 'Aminabad PS', nationality: 'Indian', occupation: 'Homemaker' } },
  { id: 'P-018', type: 'person', label: 'Ashok Rajput', aliases: ['Ashok', 'A. Rajput'], createdAt: '2023-07-20', flagged: true, networkRole: 'logistics', networkRoleConfidence: 0.72, importanceScore: 66, betweennessScore: 0.52, caseIds: ['C-004','C-005'], locationId: 'LOC-002', attributes: { name: 'Ashok Rajput', age: 39, gender: 'M', phone: '+91-9109334455', address: 'Dharavi, Mumbai', state: 'Maharashtra', district: 'Mumbai', policeStation: 'Dharavi PS', nationality: 'Indian', occupation: 'Driver' } },
  { id: 'P-019', type: 'person', label: 'Sanjay Dubey', aliases: ['Sanju'], createdAt: '2023-08-01', flagged: false, importanceScore: 41, betweennessScore: 0.27, caseIds: ['C-003'], locationId: 'LOC-003', attributes: { name: 'Sanjay Dubey', age: 32, gender: 'M', phone: '+91-9098223344', address: 'Paharganj, Delhi', state: 'Delhi', district: 'Central Delhi', policeStation: 'Paharganj PS', nationality: 'Indian', occupation: 'IT Worker' } },
  { id: 'P-020', type: 'person', label: 'Farida Sheikh', aliases: ['Farida', 'F. Sheikh'], createdAt: '2023-08-10', flagged: false, importanceScore: 31, betweennessScore: 0.18, caseIds: ['C-005'], locationId: 'LOC-007', attributes: { name: 'Farida Sheikh', age: 30, gender: 'F', phone: '+91-9987112233', address: 'Faridabad', state: 'Haryana', district: 'Faridabad', policeStation: 'NIT PS', nationality: 'Indian', occupation: 'Teacher' } },
];

// ── PHONES ──────────────────────────────────────────────────────────────
export const PHONES: PhoneEntity[] = [
  { id: 'PH-001', type: 'phone', label: '+91-9876543210', createdAt: '2023-01-15', attributes: { number: '+91-9876543210', maskedNumber: '+91-98765*****', carrier: 'Airtel', registeredName: 'Mohammad Arif Sheikh', imei: '35821209****001' } },
  { id: 'PH-002', type: 'phone', label: '+91-9765432109', createdAt: '2023-01-20', attributes: { number: '+91-9765432109', maskedNumber: '+91-97654*****', carrier: 'Jio', registeredName: 'Suresh Kumar Yadav', imei: '35821209****002' } },
  { id: 'PH-003', type: 'phone', label: '+91-9654321098', createdAt: '2023-02-08', attributes: { number: '+91-9654321098', maskedNumber: '+91-96543*****', carrier: 'Vi', registeredName: 'Reshma Bano', imei: '35821209****003' } },
  { id: 'PH-004', type: 'phone', label: '+91-9543210987', createdAt: '2023-01-28', attributes: { number: '+91-9543210987', maskedNumber: '+91-95432*****', carrier: 'BSNL', registeredName: 'Vijay Prakash Mishra', imei: '35821209****004' } },
  { id: 'PH-005', type: 'phone', label: '+91-9432109876', createdAt: '2023-03-05', attributes: { number: '+91-9432109876', maskedNumber: '+91-94321*****', carrier: 'Airtel', registeredName: 'Imran Hussain Qureshi', imei: '35821209****005' } },
  { id: 'PH-006', type: 'phone', label: '+91-9800001111', createdAt: '2023-02-20', attributes: { number: '+91-9800001111', maskedNumber: '+91-98000*****', carrier: 'Jio', registeredName: 'Unknown (Burner)', imei: '35821209****006' } },
  { id: 'PH-007', type: 'phone', label: '+91-9700002222', createdAt: '2023-03-15', attributes: { number: '+91-9700002222', maskedNumber: '+91-97000*****', carrier: 'Vi', registeredName: 'Unknown (Burner)', imei: '35821209****007' } },
  { id: 'PH-008', type: 'phone', label: '+91-9876001122', createdAt: '2023-02-18', attributes: { number: '+91-9876001122', maskedNumber: '+91-98760*****', carrier: 'Airtel', registeredName: 'Deepak Tiwari', imei: '35821209****008' } },
];

// ── VEHICLES ──────────────────────────────────────────────────────────────
export const VEHICLES: VehicleEntity[] = [
  { id: 'V-001', type: 'vehicle', label: 'UP32-AB-4521', createdAt: '2023-01-15', attributes: { registration: 'UP32-AB-4521', make: 'Toyota', model: 'Innova', color: 'White', year: 2019, ownerName: 'Suresh Kumar Yadav' } },
  { id: 'V-002', type: 'vehicle', label: 'MH02-CD-7834', createdAt: '2023-03-05', attributes: { registration: 'MH02-CD-7834', make: 'Mahindra', model: 'Scorpio', color: 'Black', year: 2020, ownerName: 'Imran Hussain Qureshi' } },
  { id: 'V-003', type: 'vehicle', label: 'DL01-EF-1102', createdAt: '2023-04-15', attributes: { registration: 'DL01-EF-1102', make: 'Honda', model: 'City', color: 'Silver', year: 2021, ownerName: 'Deepak Tiwari' } },
  { id: 'V-004', type: 'vehicle', label: 'KA05-GH-3345', createdAt: '2023-03-12', attributes: { registration: 'KA05-GH-3345', make: 'Maruti', model: 'Swift', color: 'Red', year: 2018, ownerName: 'Pradeep Nair' } },
  { id: 'V-005', type: 'vehicle', label: 'HR29-IJ-5567', createdAt: '2023-06-10', attributes: { registration: 'HR29-IJ-5567', make: 'Tata', model: 'Nexon', color: 'Blue', year: 2022, ownerName: 'Ashok Rajput' } },
];

// ── CASES ──────────────────────────────────────────────────────────────
export const CASES: CaseEntity[] = [
  { id: 'C-001', type: 'case', label: 'FIR-LKO-2023-0042', createdAt: '2023-01-15', attributes: { firNumber: 'FIR-LKO-2023-0042', title: 'Organised Extortion — Real Estate Sector', description: 'Multiple business owners reported extortion by an organised ring demanding protection money. Victims threatened via phone calls and in-person visits. Preliminary analysis shows coordinated network across Lucknow and Delhi.', status: 'under-investigation', severity: 'high', policeStation: 'Hazratganj PS', district: 'Lucknow', state: 'Uttar Pradesh', filedDate: '2023-01-15', ipcSections: ['384', '387', '120B', '34'] } },
  { id: 'C-002', type: 'case', label: 'FIR-MUM-2023-0118', createdAt: '2023-03-05', attributes: { firNumber: 'FIR-MUM-2023-0118', title: 'Inter-State Vehicle Trafficking Ring', description: 'Vehicles stolen from Maharashtra and Uttar Pradesh found in modified condition in Karnataka. Network spans 3 states with multiple handlers and buyers identified. Counterfeit registration documents discovered.', status: 'under-investigation', severity: 'critical', policeStation: 'Dharavi PS', district: 'Mumbai', state: 'Maharashtra', filedDate: '2023-03-05', ipcSections: ['378', '411', '420', '120B', '34'] } },
  { id: 'C-003', type: 'case', label: 'FIR-DEL-2023-0225', createdAt: '2023-04-15', attributes: { firNumber: 'FIR-DEL-2023-0225', title: 'Cyber Fraud — Banking Credential Theft', description: 'Victims across Delhi and Haryana defrauded through phishing SMS and fraudulent banking calls. Estimated financial loss ₹28 lakhs. Proceeds traced through multiple hawala channels. Suspects use VoIP numbers.', status: 'active', severity: 'high', policeStation: 'Paharganj PS', district: 'Central Delhi', state: 'Delhi', filedDate: '2023-04-15', ipcSections: ['419', '420', '66C', '66D', '43', '120B'] } },
  { id: 'C-004', type: 'case', label: 'FIR-BLR-2023-0301', createdAt: '2023-04-01', attributes: { firNumber: 'FIR-BLR-2023-0301', title: 'Vehicle Fencing Operation — Bengaluru', description: 'Chop shop dismantling stolen vehicles and selling spare parts discovered in Koramangala. Connected to inter-state network operating from Mumbai. Stolen vehicles include luxury cars and commercial vehicles.', status: 'active', severity: 'medium', policeStation: 'Koramangala PS', district: 'Bengaluru Urban', state: 'Karnataka', filedDate: '2023-04-01', ipcSections: ['411', '414', '120B'] } },
  { id: 'C-005', type: 'case', label: 'FIR-HYD-2023-0412', createdAt: '2023-05-05', attributes: { firNumber: 'FIR-HYD-2023-0412', title: 'Human Trafficking — Recruitment Fraud', description: 'Victims from Haryana and Telangana lured with fake job offers. Network recruits through social media, transports victims to metros. Suspects include Farida Sheikh (recruitment), Aziz Rehman (logistics).', status: 'under-investigation', severity: 'critical', policeStation: 'Karkhana PS', district: 'Hyderabad', state: 'Telangana', filedDate: '2023-05-05', ipcSections: ['370', '370A', '34', '120B', '420'] } },
];

// ── RELATIONSHIPS ──────────────────────────────────────────────────────────────
export const RELATIONSHIPS: Relationship[] = [
  // Alpha Network connections
  { id: 'R-001', sourceId: 'P-001', targetId: 'P-002', type: 'KNOWS_PERSON', confidence: 0.95, verificationStatus: 'verified', verifiedBy: 'Inspector Priya Verma', verifiedAt: '2023-03-10', createdAt: '2023-01-18', hashFingerprint: 'a1b2c3d4', evidenceSources: [{ id: 'ES-001', type: 'cdr', title: 'CDR Analysis — Cross-call pattern', documentId: 'CDR-2023-001', timestamp: '2023-01-16T14:32:00Z', addedBy: 'SI Sharma', excerpt: '47 calls between these numbers in 30 days, avg duration 4.2 min' }, { id: 'ES-002', type: 'witness', title: 'Witness Statement — Shop owner', documentId: 'WIT-2023-001', timestamp: '2023-01-20T10:00:00Z', addedBy: 'SI Sharma', excerpt: 'Witness saw both men together at Hazratganj market multiple times' }] },
  { id: 'R-002', sourceId: 'P-001', targetId: 'P-004', type: 'ASSOCIATED_WITH', confidence: 0.89, verificationStatus: 'verified', verifiedBy: 'Inspector Priya Verma', verifiedAt: '2023-03-12', createdAt: '2023-01-28', hashFingerprint: 'b2c3d4e5', evidenceSources: [{ id: 'ES-003', type: 'financial', title: 'Bank transfer — Hawala transaction', documentId: 'FIN-2023-001', timestamp: '2023-01-25T09:15:00Z', addedBy: 'Analyst Nair', excerpt: '₹3.5 lakh transferred through shell account linked to both' }, { id: 'ES-004', type: 'field-report', title: 'Surveillance log — Joint visit', documentId: 'SR-2023-001', timestamp: '2023-01-28T16:00:00Z', addedBy: 'Sub-Inspector Joshi', excerpt: 'Both observed at Aminabad office for 2 hours' }] },
  { id: 'R-003', sourceId: 'P-001', targetId: 'P-003', type: 'KNOWS_PERSON', confidence: 0.72, verificationStatus: 'ai-hypothesis', createdAt: '2023-02-10', hashFingerprint: 'c3d4e5f6', evidenceSources: [{ id: 'ES-005', type: 'cdr', title: 'CDR — Call pattern analysis', documentId: 'CDR-2023-002', timestamp: '2023-02-08T11:00:00Z', addedBy: 'System (AI)', excerpt: '12 calls detected. Pattern suggests coordination role.' }] },
  { id: 'R-004', sourceId: 'P-002', targetId: 'V-001', type: 'OWNS_VEHICLE', confidence: 0.99, verificationStatus: 'verified', verifiedBy: 'Sub-Inspector Joshi', verifiedAt: '2023-02-01', createdAt: '2023-01-20', hashFingerprint: 'd4e5f6g7', evidenceSources: [{ id: 'ES-006', type: 'field-report', title: 'Vehicle Registration — RTO Record', documentId: 'RTO-UP32-AB-4521', timestamp: '2023-01-21T09:00:00Z', addedBy: 'SI Sharma', excerpt: 'RTO records confirm registered owner as Suresh Kumar Yadav' }] },
  { id: 'R-005', sourceId: 'P-004', targetId: 'P-002', type: 'FINANCIAL_TXN', confidence: 0.84, verificationStatus: 'verified', verifiedBy: 'Analyst Nair', verifiedAt: '2023-03-20', createdAt: '2023-02-01', hashFingerprint: 'e5f6g7h8', evidenceSources: [{ id: 'ES-007', type: 'financial', title: 'Cash delivery — Field surveillance', documentId: 'SR-2023-004', timestamp: '2023-02-01T18:30:00Z', addedBy: 'Sub-Inspector Rathore', excerpt: 'Cash bag handed over near Naka Hindola. Estimated ₹8 lakh.' }] },
  // Bridge node connections
  { id: 'R-006', sourceId: 'P-011', targetId: 'P-001', type: 'ASSOCIATED_WITH', confidence: 0.86, verificationStatus: 'verified', verifiedBy: 'Inspector Priya Verma', verifiedAt: '2023-04-01', createdAt: '2023-02-20', hashFingerprint: 'f6g7h8i9', evidenceSources: [{ id: 'ES-008', type: 'cctv', title: 'CCTV footage — Chandni Chowk market', documentId: 'CCTV-CC-2023-001', timestamp: '2023-02-19T15:45:00Z', addedBy: 'SI Sharma', excerpt: 'Deepak Tiwari and Arif Sheikh seen exchanging package in market' }] },
  { id: 'R-007', sourceId: 'P-011', targetId: 'P-005', type: 'ASSOCIATED_WITH', confidence: 0.79, verificationStatus: 'ai-hypothesis', createdAt: '2023-03-08', hashFingerprint: 'g7h8i9j0', evidenceSources: [{ id: 'ES-009', type: 'digital', title: 'WhatsApp metadata analysis', documentId: 'DIG-2023-001', timestamp: '2023-03-07T10:00:00Z', addedBy: 'System (AI)', excerpt: 'Metadata shows contact between these numbers 8 times in Jan-Feb.' }] },
  // Beta network connections
  { id: 'R-008', sourceId: 'P-005', targetId: 'P-006', type: 'KNOWS_PERSON', confidence: 0.88, verificationStatus: 'verified', verifiedBy: 'Inspector Priya Verma', verifiedAt: '2023-04-10', createdAt: '2023-03-12', hashFingerprint: 'h8i9j0k1', evidenceSources: [{ id: 'ES-010', type: 'witness', title: 'Witness — Auto shop staff', documentId: 'WIT-2023-004', timestamp: '2023-03-15T11:00:00Z', addedBy: 'SI Nair', excerpt: 'Pradeep Nair regularly visited Qureshi Auto Parts with vehicles' }] },
  { id: 'R-009', sourceId: 'P-005', targetId: 'V-002', type: 'OWNS_VEHICLE', confidence: 0.98, verificationStatus: 'verified', verifiedBy: 'Sub-Inspector Patil', verifiedAt: '2023-04-05', createdAt: '2023-03-06', hashFingerprint: 'i9j0k1l2', evidenceSources: [{ id: 'ES-011', type: 'field-report', title: 'RTO Record — Vehicle Registration', documentId: 'RTO-MH02-CD-7834', timestamp: '2023-03-06T09:00:00Z', addedBy: 'SI Patil', excerpt: 'Registered owner confirmed as Imran Hussain Qureshi' }] },
  { id: 'R-010', sourceId: 'P-006', targetId: 'V-004', type: 'OWNS_VEHICLE', confidence: 0.97, verificationStatus: 'verified', verifiedBy: 'Sub-Inspector Reddy', verifiedAt: '2023-04-12', createdAt: '2023-03-13', hashFingerprint: 'j0k1l2m3', evidenceSources: [{ id: 'ES-012', type: 'field-report', title: 'RTO Record', documentId: 'RTO-KA05-GH-3345', timestamp: '2023-03-13T09:00:00Z', addedBy: 'SI Reddy', excerpt: 'KA05-GH-3345 registered to Pradeep Nair' }] },
  // Gamma network connections
  { id: 'R-011', sourceId: 'P-008', targetId: 'P-009', type: 'ASSOCIATED_WITH', confidence: 0.91, verificationStatus: 'verified', verifiedBy: 'Inspector Priya Verma', verifiedAt: '2023-05-20', createdAt: '2023-04-22', hashFingerprint: 'k1l2m3n4', evidenceSources: [{ id: 'ES-013', type: 'financial', title: 'Account transfer trail', documentId: 'FIN-2023-006', timestamp: '2023-04-20T14:00:00Z', addedBy: 'Analyst Nair', excerpt: '₹4.2 lakh transferred from mule account to Kavita Singh account' }, { id: 'ES-014', type: 'cdr', title: 'CDR — Pre-crime call analysis', documentId: 'CDR-2023-005', timestamp: '2023-04-22T10:00:00Z', addedBy: 'SI Sharma', excerpt: 'Coordinated call pattern 2 hours before each fraud event' }] },
  { id: 'R-012', sourceId: 'P-008', targetId: 'P-004', type: 'FINANCIAL_TXN', confidence: 0.77, verificationStatus: 'uncertain', createdAt: '2023-05-10', hashFingerprint: 'l2m3n4o5', evidenceSources: [{ id: 'ES-015', type: 'financial', title: 'Hawala transfer — Unconfirmed link', documentId: 'FIN-2023-007', timestamp: '2023-05-08T10:00:00Z', addedBy: 'Analyst Nair', excerpt: 'Indirect link through Hawala broker. Not yet fully verified.' }] },
  { id: 'R-013', sourceId: 'P-010', targetId: 'P-018', type: 'ASSOCIATED_WITH', confidence: 0.82, verificationStatus: 'verified', verifiedBy: 'Sub-Inspector Rahman', verifiedAt: '2023-06-05', createdAt: '2023-06-10', hashFingerprint: 'm3n4o5p6', evidenceSources: [{ id: 'ES-016', type: 'witness', title: 'Victim statement — Recruitment method', documentId: 'WIT-2023-008', timestamp: '2023-06-08T09:00:00Z', addedBy: 'SI Rahman', excerpt: 'Victim said Aziz and Ashok were both present during recruitment meeting' }] },
  { id: 'R-014', sourceId: 'P-014', targetId: 'P-005', type: 'ASSOCIATED_WITH', confidence: 0.74, verificationStatus: 'ai-hypothesis', createdAt: '2023-06-15', hashFingerprint: 'n4o5p6q7', evidenceSources: [{ id: 'ES-017', type: 'digital', title: 'Social media analysis', documentId: 'DIG-2023-005', timestamp: '2023-06-12T14:00:00Z', addedBy: 'System (AI)', excerpt: 'Common contacts and group membership detected on encrypted app' }] },
  // Case links
  { id: 'R-015', sourceId: 'P-001', targetId: 'C-001', type: 'ACCUSED_IN', confidence: 0.96, verificationStatus: 'verified', verifiedBy: 'Sub-Inspector Joshi', verifiedAt: '2023-01-20', createdAt: '2023-01-18', hashFingerprint: 'o5p6q7r8', evidenceSources: [{ id: 'ES-018', type: 'fir', title: 'FIR-LKO-2023-0042 — Named accused', documentId: 'FIR-LKO-2023-0042', timestamp: '2023-01-15T12:00:00Z', addedBy: 'Sub-Inspector Joshi', excerpt: 'Mohammad Arif Sheikh named as primary accused in FIR' }] },
  { id: 'R-016', sourceId: 'P-002', targetId: 'C-001', type: 'ACCUSED_IN', confidence: 0.92, verificationStatus: 'verified', verifiedBy: 'Sub-Inspector Joshi', verifiedAt: '2023-01-25', createdAt: '2023-01-22', hashFingerprint: 'p6q7r8s9', evidenceSources: [{ id: 'ES-019', type: 'fir', title: 'FIR amendment — Co-accused', documentId: 'FIR-LKO-2023-0042-A1', timestamp: '2023-01-22T10:00:00Z', addedBy: 'Sub-Inspector Joshi', excerpt: 'Suresh Kumar Yadav added as co-accused based on witness testimony' }] },
  { id: 'R-017', sourceId: 'P-005', targetId: 'C-002', type: 'ACCUSED_IN', confidence: 0.93, verificationStatus: 'verified', verifiedBy: 'Inspector Patil', verifiedAt: '2023-04-15', createdAt: '2023-03-08', hashFingerprint: 'q7r8s9t0', evidenceSources: [{ id: 'ES-020', type: 'fir', title: 'FIR-MUM-2023-0118 — Named accused', documentId: 'FIR-MUM-2023-0118', timestamp: '2023-03-05T09:00:00Z', addedBy: 'Inspector Patil', excerpt: 'Imran Hussain Qureshi identified as mastermind of vehicle trafficking' }] },
  // Phone usage links
  { id: 'R-018', sourceId: 'P-001', targetId: 'PH-001', type: 'USED_PHONE', confidence: 0.99, verificationStatus: 'verified', verifiedBy: 'Inspector Priya Verma', verifiedAt: '2023-02-01', createdAt: '2023-01-16', hashFingerprint: 'r8s9t0u1', evidenceSources: [{ id: 'ES-021', type: 'cdr', title: 'CDR — SIM registration', documentId: 'CDR-REG-001', timestamp: '2023-01-16T09:00:00Z', addedBy: 'SI Sharma', excerpt: 'SIM registered to Arif Sheikh with Aadhaar verification' }] },
  { id: 'R-019', sourceId: 'P-001', targetId: 'PH-006', type: 'USED_PHONE', confidence: 0.71, verificationStatus: 'ai-hypothesis', createdAt: '2023-02-15', hashFingerprint: 's9t0u1v2', evidenceSources: [{ id: 'ES-022', type: 'digital', title: 'Burner phone — location correlation', documentId: 'DIG-2023-002', timestamp: '2023-02-14T16:00:00Z', addedBy: 'System (AI)', excerpt: 'Burner phone active in same tower as Arif\'s registered phone 14/18 times' }] },
  { id: 'R-020', sourceId: 'P-011', targetId: 'V-003', type: 'OWNS_VEHICLE', confidence: 0.98, verificationStatus: 'verified', verifiedBy: 'SI Rahman', verifiedAt: '2023-03-01', createdAt: '2023-02-20', hashFingerprint: 't0u1v2w3', evidenceSources: [{ id: 'ES-023', type: 'field-report', title: 'RTO Record', documentId: 'RTO-DL01-EF-1102', timestamp: '2023-02-22T09:00:00Z', addedBy: 'SI Rahman', excerpt: 'DL01-EF-1102 registered to Deepak Tiwari' }] },
  // Location links
  { id: 'R-021', sourceId: 'P-001', targetId: 'LOC-001', type: 'PRESENT_AT', confidence: 0.94, verificationStatus: 'verified', verifiedBy: 'SI Sharma', verifiedAt: '2023-01-25', createdAt: '2023-01-18', hashFingerprint: 'u1v2w3x4', evidenceSources: [{ id: 'ES-024', type: 'cctv', title: 'CCTV — Hazratganj intersection', documentId: 'CCTV-HG-001', timestamp: '2023-01-18T14:00:00Z', addedBy: 'SI Sharma', excerpt: 'P-001 captured on CCTV near Hazratganj market 4 times this week' }] },
  { id: 'R-022', sourceId: 'P-011', targetId: 'LOC-008', type: 'RESIDES_AT', confidence: 0.91, verificationStatus: 'verified', verifiedBy: 'SI Rahman', verifiedAt: '2023-03-05', createdAt: '2023-02-22', hashFingerprint: 'v2w3x4y5', evidenceSources: [{ id: 'ES-025', type: 'field-report', title: 'Address verification', documentId: 'SR-2023-010', timestamp: '2023-02-25T10:00:00Z', addedBy: 'SI Rahman', excerpt: 'Deepak Tiwari confirmed resident of Chandni Chowk area. Neighbors verified.' }] },
  // Contradiction example
  { id: 'R-023', sourceId: 'P-009', targetId: 'C-003', type: 'ACCUSED_IN', confidence: 0.68, verificationStatus: 'uncertain', flagContradiction: true, contradictionNote: 'Accused claims alibi in Kanpur on the date. Alibi not yet verified.', createdAt: '2023-05-01', hashFingerprint: 'w3x4y5z6', evidenceSources: [{ id: 'ES-026', type: 'witness', title: 'Witness — Victim identification', documentId: 'WIT-2023-010', timestamp: '2023-05-01T09:00:00Z', addedBy: 'SI Sharma', excerpt: 'Victim identified voice as matching Kavita Singh with 70% certainty' }] },
  { id: 'R-024', sourceId: 'P-008', targetId: 'LOC-003', type: 'PRESENT_AT', confidence: 0.88, verificationStatus: 'verified', verifiedBy: 'SI Sharma', verifiedAt: '2023-05-01', createdAt: '2023-04-18', hashFingerprint: 'x4y5z6a1', evidenceSources: [{ id: 'ES-027', type: 'cctv', title: 'CCTV — Paharganj hotel lobby', documentId: 'CCTV-PG-001', timestamp: '2023-04-18T12:00:00Z', addedBy: 'SI Sharma', excerpt: 'Rohan Mehta checked in under real name at hotel, captured on CCTV' }] },
];

// ── COMMUNITIES ──────────────────────────────────────────────────────────────
export const COMMUNITIES: CommunityCluster[] = [
  { id: 'COM-001', name: 'Alpha — Lucknow Extortion Ring', memberIds: ['P-001','P-002','P-003','P-004','P-016','P-017'], bridgeNodeIds: ['P-011'], cohesionScore: 0.81, suspicionLevel: 'high', discoveredAt: '2023-03-01' },
  { id: 'COM-002', name: 'Beta — Vehicle Trafficking Network', memberIds: ['P-005','P-006','P-007','P-014','P-018'], bridgeNodeIds: ['P-011'], cohesionScore: 0.74, suspicionLevel: 'high', discoveredAt: '2023-04-10' },
  { id: 'COM-003', name: 'Gamma — Cyber Fraud Cell', memberIds: ['P-008','P-009','P-015','P-019'], bridgeNodeIds: ['P-004'], cohesionScore: 0.68, suspicionLevel: 'high', discoveredAt: '2023-05-15' },
  { id: 'COM-004', name: 'Delta — Recruitment Fraud Ring', memberIds: ['P-010','P-012','P-020','P-018'], bridgeNodeIds: ['P-018'], cohesionScore: 0.61, suspicionLevel: 'medium', discoveredAt: '2023-06-20' },
];

// ── TEMPORAL SNAPSHOTS ──────────────────────────────────────────────────────
export const TEMPORAL_SNAPSHOTS: TemporalSnapshot[] = [
  { period: '2023-01', entityIds: ['P-001','P-002','P-004','LOC-001','C-001','PH-001','PH-002'], relationshipIds: ['R-001','R-002','R-015','R-016','R-018'], newEntities: ['P-001','P-002','P-004'], newRelationships: ['R-001','R-002'] },
  { period: '2023-02', entityIds: ['P-001','P-002','P-003','P-004','P-011','LOC-001','LOC-010','C-001','PH-001','PH-002','PH-003','PH-006','V-001','V-003'], relationshipIds: ['R-001','R-002','R-003','R-004','R-005','R-006','R-015','R-016','R-018','R-019','R-020','R-022'], newEntities: ['P-003','P-011','V-001','V-003','PH-006'], newRelationships: ['R-003','R-004','R-005','R-006','R-019','R-020'] },
  { period: '2023-03', entityIds: ['P-001','P-002','P-003','P-004','P-005','P-006','P-007','P-011','P-013','LOC-001','LOC-002','LOC-004','C-001','C-002','PH-001','PH-002','PH-003','PH-004','PH-005','V-001','V-002','V-003','V-004'], relationshipIds: ['R-001','R-002','R-003','R-004','R-005','R-006','R-007','R-008','R-009','R-010','R-015','R-016','R-017','R-018','R-019','R-020','R-022'], newEntities: ['P-005','P-006','P-007','P-013','V-002','V-004','PH-005'], newRelationships: ['R-007','R-008','R-009','R-010','R-017'] },
  { period: '2023-04', entityIds: ['P-001','P-002','P-003','P-004','P-005','P-006','P-007','P-008','P-009','P-011','P-013','P-015','P-019','LOC-001','LOC-002','LOC-003','LOC-004','C-001','C-002','C-003','C-004','PH-001','PH-002','PH-003','PH-004','PH-005','PH-007','PH-008','V-001','V-002','V-003','V-004'], relationshipIds: ['R-001','R-002','R-003','R-004','R-005','R-006','R-007','R-008','R-009','R-010','R-011','R-015','R-016','R-017','R-018','R-019','R-020','R-021','R-022','R-023','R-024'], newEntities: ['P-008','P-009','P-015','P-019','LOC-003','C-003','C-004','PH-007','PH-008'], newRelationships: ['R-011','R-021','R-023','R-024'] },
  { period: '2023-05', entityIds: ['P-001','P-002','P-003','P-004','P-005','P-006','P-007','P-008','P-009','P-010','P-011','P-012','P-013','P-014','P-015','P-016','P-017','P-018','P-019','P-020'], relationshipIds: ['R-001','R-002','R-003','R-004','R-005','R-006','R-007','R-008','R-009','R-010','R-011','R-012','R-013','R-014','R-015','R-016','R-017','R-018','R-019','R-020','R-021','R-022','R-023','R-024'], newEntities: ['P-010','P-012','P-014','P-016','P-017','P-018','P-020'], newRelationships: ['R-012','R-013','R-014'] },
  { period: '2023-06', entityIds: ['P-001','P-002','P-003','P-004','P-005','P-006','P-007','P-008','P-009','P-010','P-011','P-012','P-013','P-014','P-015','P-016','P-017','P-018','P-019','P-020'], relationshipIds: ['R-001','R-002','R-003','R-004','R-005','R-006','R-007','R-008','R-009','R-010','R-011','R-012','R-013','R-014','R-015','R-016','R-017','R-018','R-019','R-020','R-021','R-022','R-023','R-024'], newEntities: [], newRelationships: [] },
];

// ── ENTITY RESOLUTION — DEMO CASES ──────────────────────────────────────────
export const ENTITY_RESOLUTION_GROUPS = [
  {
    canonicalId: 'P-001',
    canonicalName: 'Mohammad Arif Sheikh',
    variants: ['Mohammed Arif', 'Md. Arif Sheikh', 'M. Arif', 'Arif Sheikh', 'Mohammad Arif'],
    confidence: 0.93,
    method: 'Phonetic + contextual NLP matching',
  },
  {
    canonicalId: 'P-010',
    canonicalName: 'Aziz Ur Rehman',
    variants: ['Aziz Rehman', 'A. Rehman', 'Aziz-ur-Rahman', 'Abdul Aziz Rehman'],
    confidence: 0.88,
    method: 'Name normalization + address co-reference',
  },
];

// ── NETWORK STATS ──────────────────────────────────────────────────────────────
export const NETWORK_STATS: NetworkStats = {
  totalEntities: PERSONS.length + PHONES.length + VEHICLES.length + LOCATIONS.length + CASES.length,
  totalRelationships: RELATIONSHIPS.length,
  avgConfidence: RELATIONSHIPS.reduce((sum, r) => sum + r.confidence, 0) / RELATIONSHIPS.length,
  verifiedRelationships: RELATIONSHIPS.filter(r => r.verificationStatus === 'verified').length,
  flaggedContradictions: RELATIONSHIPS.filter(r => r.flagContradiction).length,
  bridgeNodes: PERSONS.filter(p => (p.betweennessScore || 0) > 0.7).length,
  communities: COMMUNITIES.length,
  activeCases: CASES.filter(c => c.attributes.status === 'active' || c.attributes.status === 'under-investigation').length,
};

// ── COMBINED ENTITIES ──────────────────────────────────────────────────────────────
export const ALL_ENTITIES: Entity[] = [
  ...PERSONS,
  ...PHONES,
  ...VEHICLES,
  ...LOCATIONS,
  ...CASES,
];

export const getEntityById = (id: string): Entity | undefined =>
  ALL_ENTITIES.find(e => e.id === id);

export const getRelationshipsForEntity = (id: string): Relationship[] =>
  RELATIONSHIPS.filter(r => r.sourceId === id || r.targetId === id);

export const findShortestPath = (fromId: string, toId: string): { path: string[]; edges: Relationship[] } | null => {
  // BFS implementation
  const queue: string[][] = [[fromId]];
  const visited = new Set<string>([fromId]);
  const edgePath: Relationship[][] = [[]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const edgesSoFar = edgePath.shift()!;
    const current = path[path.length - 1];

    if (current === toId) {
      return { path, edges: edgesSoFar };
    }

    const edges = getRelationshipsForEntity(current);
    for (const edge of edges) {
      const neighbor = edge.sourceId === current ? edge.targetId : edge.sourceId;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
        edgePath.push([...edgesSoFar, edge]);
      }
    }
  }
  return null;
};
