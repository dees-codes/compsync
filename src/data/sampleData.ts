import type { MRA, Evidence } from '@/types'

// Sample MRAs for demonstration
export const sampleMRAs: Omit<MRA, 'id' | 'createdAt' | 'updatedAt' | 'evidenceIds'>[] = [
  {
    title: 'Transaction monitoring system lacks documented tuning methodology',
    description: `The Bank's transaction monitoring system lacks a formally documented tuning methodology. While staff indicated that tuning occurs periodically, there is no written procedure describing the frequency, criteria, or approval process for tuning decisions. Examiners noted that without documented tuning methodology, the Bank cannot demonstrate that its monitoring system is appropriately calibrated to detect suspicious activity patterns relevant to its risk profile.

The Bank should develop and implement a comprehensive tuning methodology document that includes:
- Frequency of tuning reviews
- Criteria for modifying thresholds
- Documentation requirements for tuning decisions
- Approval process and responsible parties`,
    status: 'evidence',
    assignee: 'Sarah Johnson, BSA Officer',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    category: 'bsa_aml',
    priority: 'high',
  },
  {
    title: 'BSA/AML risk assessment does not address all risk categories',
    description: `The Bank's BSA/AML risk assessment does not comprehensively address all relevant risk categories. Specifically, the assessment lacks detailed analysis of:
- Geographic risk associated with higher-risk jurisdictions
- Product risk for newer digital banking services
- Customer risk stratification methodology

Management should enhance the risk assessment to include all applicable risk categories with supporting rationale and data sources.`,
    status: 'in_progress',
    assignee: 'Michael Chen, Chief Compliance Officer',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    category: 'bsa_aml',
    priority: 'high',
  },
  {
    title: 'Board BSA reporting lacks sufficient detail',
    description: `Board reporting on BSA/AML matters does not provide sufficient detail to enable effective oversight. Current reports include only high-level metrics without trend analysis, exception reporting, or discussion of emerging risks. 

The Bank should enhance Board reporting to include:
- SAR filing statistics with trend analysis
- Alert volumes and disposition metrics
- Training completion rates
- Regulatory update summaries
- Key risk indicator dashboards`,
    status: 'open',
    assignee: 'Jennifer Williams, VP Compliance',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    category: 'governance',
    priority: 'medium',
  },
  {
    title: 'CDD procedures do not address beneficial ownership updates',
    description: `Customer Due Diligence (CDD) procedures do not include processes for updating beneficial ownership information on an ongoing basis. While initial collection is documented, there is no established trigger or periodic review to ensure ownership information remains current.

Management should update CDD procedures to include:
- Trigger events requiring beneficial ownership re-verification
- Periodic review schedule for high-risk customers
- Documentation requirements for ownership changes`,
    status: 'review',
    assignee: 'David Martinez, BSA Analyst',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    category: 'bsa_aml',
    priority: 'medium',
  },
  {
    title: 'Vendor management program lacks BSA-specific controls',
    description: `The Bank's vendor management program does not include BSA/AML-specific due diligence and monitoring requirements for critical BSA service providers. This includes the transaction monitoring vendor and sanctions screening provider.

The Bank should enhance vendor management to include:
- BSA-specific due diligence questionnaires
- Annual performance reviews for BSA vendors
- Contract provisions for regulatory access
- Incident reporting requirements`,
    status: 'closed',
    assignee: 'Robert Thompson, Operations Manager',
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    category: 'operations',
    priority: 'low',
  },
]

// Sample evidence documents
export const sampleEvidence: Omit<Evidence, 'id' | 'uploadedAt' | 'mraIds'>[] = [
  {
    name: 'BSA_AML_Policy_v2.1_October2024.pdf',
    category: 'policies',
    fileType: 'application/pdf',
    fileSize: 2450000,
    content: `BSA/AML Policy Document - Version 2.1
    
This policy establishes the framework for the Bank's Bank Secrecy Act (BSA) and Anti-Money Laundering (AML) compliance program. Key sections include:

Section 4.2 - Transaction Monitoring
The Bank utilizes automated transaction monitoring systems to identify potentially suspicious activity. The system is configured with scenarios and thresholds appropriate to the Bank's risk profile.

Section 4.3 - Tuning Methodology  
Transaction monitoring parameters shall be reviewed and tuned on a quarterly basis, or more frequently as warranted by changes in risk profile, regulatory guidance, or system performance metrics.

Section 5.1 - Customer Risk Rating
All customers are assigned a risk rating (High, Medium, Low) based on objective criteria including product usage, geographic factors, and transaction patterns.`,
  },
  {
    name: 'Transaction_Monitoring_Procedures_2024.pdf',
    category: 'procedures',
    fileType: 'application/pdf',
    fileSize: 1850000,
    content: `Transaction Monitoring Procedures

1. Alert Generation
   - System generates alerts based on configured scenarios
   - Alerts are prioritized by risk score
   
2. Alert Investigation
   - Level 1 review within 24 hours of generation
   - Escalation criteria for complex cases
   
3. SAR Decision Process
   - Documentation requirements for SAR/No-SAR decisions
   - Supervisory review and approval workflow
   
4. System Tuning (Section 4)
   - Quarterly tuning review schedule
   - Threshold adjustment criteria
   - Approval requirements for changes`,
  },
  {
    name: 'Board_Minutes_Q3_2024_BSA_Report.pdf',
    category: 'board_minutes',
    fileType: 'application/pdf',
    fileSize: 890000,
    content: `Board of Directors Meeting Minutes
October 20, 2024

Agenda Item 5: BSA/AML Program Update

The BSA Officer presented the quarterly BSA/AML report. Key discussion points:
- SAR filing activity remained consistent with prior quarters
- Transaction monitoring system upgrade approved
- New tuning methodology documentation presented for approval
- Board approved enhanced reporting format effective Q4 2024

Resolution: The Board approves the updated BSA/AML Policy v2.1 and the new transaction monitoring tuning methodology.

Vote: Unanimous approval`,
  },
  {
    name: 'Vendor_TM_Tuning_Report_Q3_2024.xlsx',
    category: 'reports',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 456000,
    content: `Transaction Monitoring Tuning Report - Q3 2024

Prepared by: TM Vendor Solutions Inc.

Executive Summary:
This report documents the quarterly tuning review conducted for the Bank's transaction monitoring system.

Key Findings:
- 3 scenarios adjusted for improved detection
- False positive rate reduced by 12%
- 2 new scenarios recommended for implementation

Threshold Adjustments:
- Large cash scenario: $8,000 → $7,500
- Wire transfer velocity: 5 per day → 4 per day
- ACH structuring: Pattern detection enhanced`,
  },
  {
    name: 'BSA_Training_Completion_Report_2024.pdf',
    category: 'training',
    fileType: 'application/pdf',
    fileSize: 325000,
    content: `Annual BSA/AML Training Completion Report
Year: 2024

Training Modules Completed:
1. BSA/AML Fundamentals (All Staff) - 98% completion
2. SAR Filing Procedures (BSA Team) - 100% completion  
3. CDD/EDD Requirements (Front Line) - 95% completion
4. Transaction Monitoring (BSA Team) - 100% completion

Outstanding Requirements:
- 3 employees pending fundamentals training (new hires)
- Remediation training scheduled for November 2024`,
  },
  {
    name: 'CDD_Policy_Update_November2024.docx',
    category: 'policies',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 567000,
    content: `Customer Due Diligence Policy - November 2024 Update

DRAFT - Pending Board Approval

New Section: Ongoing Beneficial Ownership Monitoring

1. Trigger Events
   - Material change in customer business
   - Significant transaction pattern deviation
   - Adverse media alerts
   - Annual review for high-risk customers

2. Update Procedures
   - Re-certification request process
   - Documentation requirements
   - Escalation for non-response`,
  },
]

