/**
 * OpenAI API Service for CompSync
 * 
 * CONFIGURATION:
 * To connect to ChatGPT API, you need to:
 * 1. Create a .env file in the project root
 * 2. Add your OpenAI API key: VITE_OPENAI_API_KEY=your-key-here
 * 
 * PROMPTS:
 * The system prompts are defined in this file. You can customize them below.
 */

import type { MRA, Evidence, GeneratedResponse, EvidenceCitation } from '@/types'

// ============================================
// CONFIGURATION - Add your API key here or in .env
// ============================================
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// ============================================
// SYSTEM PROMPTS - Customize these for your needs
// ============================================

const SYSTEM_PROMPT = `You are an expert compliance officer and examiner response specialist with deep knowledge of banking regulations, BSA/AML requirements, and regulatory examination processes.

Your role is to help banks draft professional, examiner-ready responses to MRA (Matters Requiring Attention) findings. 

Key guidelines:
1. Write in a formal, professional tone appropriate for regulatory correspondence
2. Be specific and cite evidence when available
3. Structure responses with clear remediation steps taken or planned
4. Acknowledge the finding appropriately without being defensive
5. Demonstrate understanding of the regulatory requirement
6. Show concrete actions with dates and responsible parties
7. Reference specific policies, procedures, and documentation

Response structure should include:
- Acknowledgment of the finding
- Summary of remediation actions taken
- Evidence citations with specific document names, sections, and dates
- Timeline of implementation
- Ongoing monitoring/controls established`

const GENERATE_RESPONSE_PROMPT = `Based on the MRA finding below and the available evidence documents, draft an examiner-ready response.

MRA FINDING:
Title: {mra_title}
Description: {mra_description}
Category: {mra_category}

AVAILABLE EVIDENCE DOCUMENTS:
{evidence_list}

Please provide:
1. A professional narrative response addressing the finding (2-3 paragraphs)
2. Specific citations to the evidence documents provided
3. Any gaps in the evidence that should be addressed

Format your response as JSON with this structure:
{
  "narrative": "The full response text...",
  "citations": [
    {"documentName": "...", "relevantSection": "..."}
  ],
  "gaps": ["Gap 1...", "Gap 2..."]
}`

// ============================================
// API FUNCTIONS
// ============================================

export interface GenerateResponseParams {
  mra: MRA
  evidence: Evidence[]
}

export interface GenerateResponseResult {
  success: boolean
  response?: GeneratedResponse
  error?: string
}

export async function generateMRAResponse(params: GenerateResponseParams): Promise<GenerateResponseResult> {
  const { mra, evidence } = params

  // Check if API key is configured
  if (!OPENAI_API_KEY) {
    // Return a mock response for demo purposes when no API key is set
    return generateMockResponse(mra, evidence)
  }

  try {
    // Build evidence list for the prompt
    const evidenceList = evidence.length > 0
      ? evidence.map(e => `- ${e.name} (${e.category}): ${e.content || 'Content not extracted'}`).join('\n')
      : 'No evidence documents have been uploaded yet.'

    // Build the user prompt
    const userPrompt = GENERATE_RESPONSE_PROMPT
      .replace('{mra_title}', mra.title)
      .replace('{mra_description}', mra.description)
      .replace('{mra_category}', mra.category)
      .replace('{evidence_list}', evidenceList)

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API request failed')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response content from API')
    }

    // Parse the JSON response
    const parsed = JSON.parse(content)

    // Build the generated response object
    const generatedResponse: GeneratedResponse = {
      id: crypto.randomUUID(),
      mraId: mra.id,
      content: parsed.narrative,
      evidenceUsed: (parsed.citations || []).map((c: { documentName: string; relevantSection?: string }) => {
        const matchedEvidence = evidence.find(e => 
          e.name.toLowerCase().includes(c.documentName.toLowerCase()) ||
          c.documentName.toLowerCase().includes(e.name.toLowerCase())
        )
        return {
          evidenceId: matchedEvidence?.id || '',
          evidenceName: c.documentName,
          relevantSection: c.relevantSection,
        } as EvidenceCitation
      }),
      gaps: parsed.gaps || [],
      generatedAt: new Date().toISOString(),
      status: 'draft',
    }

    return { success: true, response: generatedResponse }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate response',
    }
  }
}

// ============================================
// MOCK RESPONSE - Used when no API key is set
// ============================================

function generateMockResponse(mra: MRA, evidence: Evidence[]): GenerateResponseResult {
  const evidenceNames = evidence.map(e => e.name)
  
  const mockNarrative = `We acknowledge the examiner's finding regarding "${mra.title}" and have taken comprehensive steps to address this matter.

In response to this finding, we have updated our ${mra.category === 'bsa_aml' ? 'BSA/AML compliance program' : 'compliance framework'} to ensure full alignment with regulatory expectations. ${evidence.length > 0 ? `Our remediation efforts are supported by the following documentation: ${evidenceNames.join(', ')}.` : 'We are currently gathering supporting documentation to demonstrate our remediation efforts.'}

${evidence.length > 0 ? `Specifically, we have implemented enhanced controls as documented in our updated policies and procedures. The ${evidenceNames[0] || 'relevant documentation'} has been revised to include detailed methodology and governance frameworks. Board oversight has been strengthened through quarterly reporting and dedicated committee review.` : 'We are actively developing enhanced controls and documentation to address the specific concerns raised in this finding.'}

Going forward, we have established ongoing monitoring processes to ensure sustained compliance. Our compliance team will conduct periodic reviews to verify the effectiveness of these remediation measures.`

  const generatedResponse: GeneratedResponse = {
    id: crypto.randomUUID(),
    mraId: mra.id,
    content: mockNarrative,
    evidenceUsed: evidence.slice(0, 3).map(e => ({
      evidenceId: e.id,
      evidenceName: e.name,
      relevantSection: `Section 4.2 - ${e.category.charAt(0).toUpperCase() + e.category.slice(1)} Framework`,
    })),
    gaps: evidence.length < 2 
      ? [
          'Training records documenting staff awareness of updated procedures',
          'Board meeting minutes approving the remediation plan',
          'Third-party validation report (if applicable)',
        ]
      : ['Ongoing monitoring reports to demonstrate sustained compliance'],
    generatedAt: new Date().toISOString(),
    status: 'draft',
  }

  return { success: true, response: generatedResponse }
}

// ============================================
// HELPER: Check if API is configured
// ============================================

export function isAPIConfigured(): boolean {
  return Boolean(OPENAI_API_KEY)
}

