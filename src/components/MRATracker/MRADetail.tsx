import { useState } from 'react'
import { useStore, useSelectedMRA } from '@/store/useStore'
import { MRA_STAGES, CATEGORY_LABELS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText,
  ChevronRight,
  Upload,
  Check,
  Trash2,
} from 'lucide-react'
import { formatDate, getDaysUntilDeadline, cn } from '@/lib/utils'
import { EvidenceUpload } from './EvidenceUpload'
import { GenerateResponsePanel } from './GenerateResponsePanel'

export function MRADetail() {
  const mra = useSelectedMRA()
  const { setSelectedMRAId, updateMRAStatus, evidence, deleteMRA } = useStore()
  const [activeTab, setActiveTab] = useState('overview')

  if (!mra) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select an MRA to view details</p>
      </div>
    )
  }

  const currentStageIndex = MRA_STAGES.findIndex(s => s.status === mra.status)
  const progress = ((currentStageIndex + 1) / MRA_STAGES.length) * 100
  const linkedEvidence = evidence.filter(e => mra.evidenceIds.includes(e.id))
  const daysUntil = getDaysUntilDeadline(mra.deadline)
  const isOverdue = daysUntil < 0 && mra.status !== 'closed'

  const canAdvance = mra.status !== 'closed'
  const nextStage = canAdvance ? MRA_STAGES[currentStageIndex + 1] : null

  const handleAdvanceStage = () => {
    if (nextStage) {
      updateMRAStatus(mra.id, nextStage.status)
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this MRA?')) {
      deleteMRA(mra.id)
      setSelectedMRAId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setSelectedMRAId(null)}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to List
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={mra.status as 'open' | 'in-progress' | 'evidence' | 'review' | 'closed'}>
                {MRA_STAGES.find(s => s.status === mra.status)?.label}
              </Badge>
              <Badge variant="outline">{CATEGORY_LABELS[mra.category]}</Badge>
              {mra.priority === 'high' && (
                <Badge variant="destructive">High Priority</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{mra.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Remediation Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            {/* Stage Indicators */}
            <div className="flex items-center justify-between">
              {MRA_STAGES.map((stage, index) => {
                const isCompleted = index < currentStageIndex
                const isCurrent = index === currentStageIndex
                
                return (
                  <div 
                    key={stage.status} 
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div className={cn(
                      "stage-dot",
                      isCompleted && "stage-dot-completed",
                      isCurrent && "stage-dot-active",
                      !isCompleted && !isCurrent && "stage-dot-pending"
                    )}>
                      {isCompleted && <Check className="h-2 w-2 text-white" />}
                    </div>
                    <span className={cn(
                      "text-xs text-center",
                      isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="font-medium">{mra.assignee}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className={cn(
              "p-4 flex items-center gap-3",
              isOverdue && "bg-destructive/5"
            )}>
              <div className={cn(
                "p-2 rounded-lg",
                isOverdue ? "bg-destructive/10" : "bg-primary/10"
              )}>
                <Calendar className={cn(
                  "h-4 w-4",
                  isOverdue ? "text-destructive" : "text-primary"
                )} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className={cn("font-medium", isOverdue && "text-destructive")}>
                  {formatDate(mra.deadline)}
                  {isOverdue && ` (${Math.abs(daysUntil)} days overdue)`}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Evidence</p>
                <p className="font-medium">{linkedEvidence.length} documents</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="response">AI Response</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Finding Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{mra.description}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          {canAdvance && nextStage && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Ready to advance?</h3>
                    <p className="text-sm text-muted-foreground">
                      Move this MRA to the next stage: <strong>{nextStage.label}</strong>
                    </p>
                  </div>
                  <Button onClick={handleAdvanceStage}>
                    Advance to {nextStage.label}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage-specific guidance */}
          {mra.status === 'evidence' && (
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Evidence Gathering Stage</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload supporting documents to build your evidence library for this finding.
                      Once you have sufficient evidence, you can generate an AI response.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('evidence')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Evidence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          <EvidenceUpload mra={mra} />
        </TabsContent>

        <TabsContent value="response" className="mt-4">
          <GenerateResponsePanel mra={mra} evidence={linkedEvidence} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

