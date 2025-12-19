import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { generateMRAResponse, isAPIConfigured } from '@/services/openai'
import type { MRA, Evidence } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Sparkles, 
  Copy, 
  Download, 
  AlertTriangle,
  FileText,
  CheckCircle,
  Info,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface GenerateResponsePanelProps {
  mra: MRA
  evidence: Evidence[]
}

export function GenerateResponsePanel({ mra, evidence }: GenerateResponsePanelProps) {
  const { addGeneratedResponse, updateMRA } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState(mra.generatedResponse?.content || '')
  const [isEditing, setIsEditing] = useState(false)

  const hasEvidence = evidence.length > 0
  const isConfigured = isAPIConfigured()
  const hasExistingResponse = Boolean(mra.generatedResponse)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateMRAResponse({ mra, evidence })
      
      if (result.success && result.response) {
        addGeneratedResponse(result.response)
        setEditedContent(result.response.content)
      } else {
        setError(result.error || 'Failed to generate response')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    const content = editedContent || mra.generatedResponse?.content || ''
    navigator.clipboard.writeText(content)
  }

  const handleExport = () => {
    const content = editedContent || mra.generatedResponse?.content || ''
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MRA-Response-${mra.title.substring(0, 30).replace(/[^a-z0-9]/gi, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveEdit = () => {
    if (mra.generatedResponse) {
      updateMRA(mra.id, {
        generatedResponse: {
          ...mra.generatedResponse,
          content: editedContent,
        }
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* API Status Notice */}
      {!isConfigured && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning">Demo Mode</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  No OpenAI API key configured. Using mock responses for demonstration.
                  To use real AI generation, add your API key to the <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> file:
                </p>
                <pre className="text-xs bg-muted px-2 py-1 rounded mt-2 font-mono">
                  VITE_OPENAI_API_KEY=your-key-here
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evidence for Response ({evidence.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasEvidence ? (
            <div className="text-center py-4">
              <AlertTriangle className="h-8 w-8 mx-auto text-warning mb-2" />
              <p className="text-sm text-muted-foreground">
                No evidence linked to this MRA. Add evidence for better AI-generated responses.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {evidence.map(doc => (
                <Badge key={doc.id} variant="secondary" className="text-xs">
                  {doc.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Card className={cn(
        "border-primary/20",
        !hasExistingResponse && "bg-gradient-to-r from-primary/5 to-accent/5"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Response Generator
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {hasExistingResponse 
                  ? 'Regenerate or edit your examiner-ready response'
                  : 'Generate an examiner-ready response using AI'}
              </p>
            </div>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : hasExistingResponse ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Response
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Response */}
      {mra.generatedResponse && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Generated Response</CardTitle>
                  <CardDescription>
                    Generated on {formatDate(mra.generatedResponse.generatedAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="prose prose-sm max-w-none p-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setEditedContent(mra.generatedResponse?.content || '')
                    setIsEditing(true)
                  }}
                >
                  <p className="whitespace-pre-wrap text-sm">
                    {mra.generatedResponse.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    Click to edit
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence Citations */}
          {mra.generatedResponse.evidenceUsed.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Evidence Citations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mra.generatedResponse.evidenceUsed.map((citation, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-success/5"
                    >
                      <FileText className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{citation.evidenceName}</p>
                        {citation.relevantSection && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {citation.relevantSection}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gaps Identified */}
          {mra.generatedResponse.gaps.length > 0 && (
            <Card className="border-warning/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Gaps Identified
                </CardTitle>
                <CardDescription>
                  Additional evidence that could strengthen your response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mra.generatedResponse.gaps.map((gap, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-warning/20 text-warning text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

