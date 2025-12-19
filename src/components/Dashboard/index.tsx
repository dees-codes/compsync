import { useStore } from '@/store/useStore'
import { MRA_STAGES, CATEGORY_LABELS, type MRAStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  FileWarning, 
  FolderOpen, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Database,
  Trash2,
} from 'lucide-react'
import { formatDate, getDaysUntilDeadline, cn } from '@/lib/utils'

interface DashboardProps {
  onNavigate: (tab: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const mras = useStore((state) => state.mras)
  const evidence = useStore((state) => state.evidence)
  const setSelectedMRAId = useStore((state) => state.setSelectedMRAId)
  const loadSampleData = useStore((state) => state.loadSampleData)
  const clearAllData = useStore((state) => state.clearAllData)

  // Statistics
  const openMRAs = mras.filter(m => m.status !== 'closed')
  const closedMRAs = mras.filter(m => m.status === 'closed')
  const overdueMRAs = openMRAs.filter(m => getDaysUntilDeadline(m.deadline) < 0)
  const urgentMRAs = openMRAs.filter(m => {
    const days = getDaysUntilDeadline(m.deadline)
    return days >= 0 && days <= 7
  })
  const mrasWithResponses = mras.filter(m => m.generatedResponse)

  const completionRate = mras.length > 0 
    ? Math.round((closedMRAs.length / mras.length) * 100) 
    : 0

  // Status counts
  const statusCounts = mras.reduce((acc, mra) => {
    acc[mra.status] = (acc[mra.status] || 0) + 1
    return acc
  }, {} as Record<MRAStatus, number>)

  // Recent activity (last 5 MRAs by update time)
  const recentMRAs = [...mras]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Welcome to CompSync</h1>
          <p className="text-white/80 max-w-xl">
            Track and remediate MRA findings with AI-powered response generation.
            {openMRAs.length > 0 
              ? ` You have ${openMRAs.length} open MRA${openMRAs.length !== 1 ? 's' : ''} requiring attention.`
              : ' Get started by adding your first MRA finding or load sample data.'}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => onNavigate('mras')}
            >
              <FileWarning className="h-4 w-4 mr-2" />
              View MRAs
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => onNavigate('evidence')}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Evidence Library
            </Button>
            {mras.length === 0 && (
              <Button 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={loadSampleData}
              >
                <Database className="h-4 w-4 mr-2" />
                Load Sample Data
              </Button>
            )}
            {mras.length > 0 && (
              <Button 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => {
                  if (confirm('Clear all MRAs and evidence? This cannot be undone.')) {
                    clearAllData()
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            )}
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-24" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open MRAs</p>
                <p className="text-3xl font-bold">{openMRAs.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <FileWarning className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={overdueMRAs.length > 0 ? "border-destructive/50 bg-destructive/5" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className={cn("text-3xl font-bold", overdueMRAs.length > 0 && "text-destructive")}>
                  {overdueMRAs.length}
                </p>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                overdueMRAs.length > 0 ? "bg-destructive/10" : "bg-muted"
              )}>
                <AlertTriangle className={cn(
                  "h-6 w-6",
                  overdueMRAs.length > 0 ? "text-destructive" : "text-muted-foreground"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-3xl font-bold">{evidence.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Responses</p>
                <p className="text-3xl font-bold">{mrasWithResponses.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Remediation Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Completion</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2">
                {MRA_STAGES.map((stage) => {
                  const count = statusCounts[stage.status] || 0
                  return (
                    <div key={stage.status} className="text-center">
                      <p className="text-lg font-semibold">{count}</p>
                      <p className="text-xs text-muted-foreground">{stage.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Items */}
        <Card className={urgentMRAs.length > 0 || overdueMRAs.length > 0 ? "border-warning/50" : ""}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Attention Required
            </CardTitle>
            <CardDescription>
              MRAs with upcoming or past deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overdueMRAs.length === 0 && urgentMRAs.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-10 w-10 mx-auto text-success mb-2" />
                <p className="text-sm text-muted-foreground">
                  No urgent items. All MRAs are on track!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...overdueMRAs, ...urgentMRAs].slice(0, 4).map((mra) => {
                  const daysUntil = getDaysUntilDeadline(mra.deadline)
                  const isOverdue = daysUntil < 0
                  
                  return (
                    <div 
                      key={mra.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/5",
                        isOverdue ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"
                      )}
                      onClick={() => {
                        setSelectedMRAId(mra.id)
                        onNavigate('mras')
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{mra.title}</p>
                          <p className={cn(
                            "text-xs",
                            isOverdue ? "text-destructive" : "text-warning"
                          )}>
                            {isOverdue 
                              ? `${Math.abs(daysUntil)} days overdue`
                              : daysUntil === 0 
                                ? 'Due today'
                                : `${daysUntil} days left`}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest MRA updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('mras')}>
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentMRAs.length === 0 ? (
            <div className="text-center py-8">
              <FileWarning className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No MRAs yet. Add your first finding to get started.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => onNavigate('mras')}
              >
                Add MRA
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMRAs.map((mra, index) => (
                <div 
                  key={mra.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:bg-accent/5 transition-colors animate-fade-in",
                    `stagger-${index + 1}`
                  )}
                  onClick={() => {
                    setSelectedMRAId(mra.id)
                    onNavigate('mras')
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={mra.status as 'open' | 'in-progress' | 'evidence' | 'review' | 'closed'}>
                        {MRA_STAGES.find(s => s.status === mra.status)?.label}
                      </Badge>
                      <Badge variant="outline">{CATEGORY_LABELS[mra.category]}</Badge>
                    </div>
                    <p className="font-medium text-sm truncate">{mra.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(mra.updatedAt)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

