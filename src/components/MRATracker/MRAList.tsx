import { useState } from 'react'
import { useStore, useFilteredMRAs } from '@/store/useStore'
import { MRA_STAGES, CATEGORY_LABELS, type MRAStatus, type MRACategory } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  ChevronRight,
  AlertCircle,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { getDaysUntilDeadline } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AddMRADialog } from './AddMRADialog'

const statusIcons: Record<MRAStatus, typeof AlertCircle> = {
  open: AlertCircle,
  in_progress: Clock,
  evidence: FileText,
  review: CheckCircle,
  closed: XCircle,
}

export function MRAList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const filteredMRAs = useFilteredMRAs()
  const { setSelectedMRAId, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter } = useStore()

  const searchFilteredMRAs = filteredMRAs.filter(mra => 
    mra.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mra.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group MRAs by status for summary
  const statusCounts = filteredMRAs.reduce((acc, mra) => {
    acc[mra.status] = (acc[mra.status] || 0) + 1
    return acc
  }, {} as Record<MRAStatus, number>)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MRA_STAGES.map((stage) => {
          const count = statusCounts[stage.status] || 0
          const Icon = statusIcons[stage.status]
          return (
            <Card 
              key={stage.status}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                statusFilter === stage.status && "ring-2 ring-primary"
              )}
              onClick={() => setStatusFilter(statusFilter === stage.status ? 'all' : stage.status)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    stage.status === 'open' && "bg-destructive/10 text-destructive",
                    stage.status === 'in_progress' && "bg-warning/10 text-warning",
                    stage.status === 'evidence' && "bg-primary/10 text-primary",
                    stage.status === 'review' && "bg-accent/10 text-accent",
                    stage.status === 'closed' && "bg-success/10 text-success",
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{stage.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search MRAs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as MRACategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add MRA
        </Button>
      </div>

      {/* MRA List */}
      <div className="space-y-3">
        {searchFilteredMRAs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">No MRAs Found</h3>
              <p className="text-muted-foreground mb-4">
                {filteredMRAs.length === 0 
                  ? "Get started by adding your first MRA finding."
                  : "No MRAs match your search criteria."}
              </p>
              {filteredMRAs.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First MRA
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          searchFilteredMRAs.map((mra, index) => {
            const daysUntil = getDaysUntilDeadline(mra.deadline)
            const isOverdue = daysUntil < 0 && mra.status !== 'closed'
            const isUrgent = daysUntil >= 0 && daysUntil <= 7 && mra.status !== 'closed'

            return (
              <Card 
                key={mra.id}
                className={cn(
                  "card-interactive cursor-pointer animate-fade-in",
                  `stagger-${Math.min(index + 1, 5)}`
                )}
                onClick={() => setSelectedMRAId(mra.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={mra.status as 'open' | 'in-progress' | 'evidence' | 'review' | 'closed'}>
                          {MRA_STAGES.find(s => s.status === mra.status)?.label}
                        </Badge>
                        <Badge variant="outline">{CATEGORY_LABELS[mra.category]}</Badge>
                        {mra.priority === 'high' && (
                          <Badge variant="destructive">High Priority</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-base truncate">{mra.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {mra.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>{mra.assignee}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1.5",
                          isOverdue && "text-destructive",
                          isUrgent && "text-warning"
                        )}>
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {isOverdue 
                              ? `${Math.abs(daysUntil)} days overdue`
                              : daysUntil === 0 
                                ? 'Due today'
                                : `${daysUntil} days left`}
                          </span>
                        </div>
                        {mra.evidenceIds.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{mra.evidenceIds.length} evidence</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <AddMRADialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}

