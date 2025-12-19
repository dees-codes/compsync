// MRA Status stages
export type MRAStatus = 
  | 'open'           // Just created, needs attention
  | 'in_progress'    // Being worked on
  | 'evidence'       // Evidence gathering stage
  | 'review'         // Under review
  | 'closed'         // Remediated and closed

export interface MRA {
  id: string
  title: string
  description: string
  status: MRAStatus
  assignee: string
  deadline: string
  createdAt: string
  updatedAt: string
  category: MRACategory
  priority: 'high' | 'medium' | 'low'
  evidenceIds: string[]
  generatedResponse?: GeneratedResponse
  examinerNotes?: string
}

export type MRACategory = 
  | 'bsa_aml'           // BSA/AML
  | 'compliance'        // General Compliance  
  | 'risk_management'   // Risk Management
  | 'operations'        // Operations
  | 'it_security'       // IT/Security
  | 'governance'        // Governance
  | 'other'             // Other

export type EvidenceCategory = 
  | 'policies'
  | 'procedures'
  | 'reports'
  | 'training'
  | 'board_minutes'
  | 'other'

export interface Evidence {
  id: string
  name: string
  category: EvidenceCategory
  uploadedAt: string
  fileType: string
  fileSize: number
  content?: string  // Extracted text content for AI processing
  mraIds: string[]  // MRAs this evidence is linked to
}

export interface GeneratedResponse {
  id: string
  mraId: string
  content: string
  evidenceUsed: EvidenceCitation[]
  gaps: string[]
  generatedAt: string
  status: 'draft' | 'reviewed' | 'approved'
}

export interface EvidenceCitation {
  evidenceId: string
  evidenceName: string
  relevantSection?: string
}

// Stage configuration for MRA workflow
export const MRA_STAGES: { status: MRAStatus; label: string; description: string }[] = [
  { status: 'open', label: 'Open', description: 'Finding received, needs attention' },
  { status: 'in_progress', label: 'In Progress', description: 'Remediation underway' },
  { status: 'evidence', label: 'Evidence Gathering', description: 'Collecting supporting documents' },
  { status: 'review', label: 'Under Review', description: 'Response being finalized' },
  { status: 'closed', label: 'Closed', description: 'Remediation complete' },
]

export const CATEGORY_LABELS: Record<MRACategory, string> = {
  bsa_aml: 'BSA/AML',
  compliance: 'Compliance',
  risk_management: 'Risk Management',
  operations: 'Operations',
  it_security: 'IT/Security',
  governance: 'Governance',
  other: 'Other',
}

export const EVIDENCE_CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  policies: 'Policies',
  procedures: 'Procedures',
  reports: 'Reports',
  training: 'Training',
  board_minutes: 'Board Minutes',
  other: 'Other',
}

