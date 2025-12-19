import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { 
  LayoutDashboard, 
  FileWarning, 
  FolderOpen, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mras', label: 'MRA Tracker', icon: FileWarning },
  { id: 'evidence', label: 'Evidence Library', icon: FolderOpen },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const mras = useStore((state) => state.mras)
  const openMRAs = mras.filter(m => m.status !== 'closed').length

  return (
    <aside className={cn(
      "h-[calc(100vh-4rem)] border-r bg-card/50 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const showBadge = item.id === 'mras' && openMRAs > 0
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 relative",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {showBadge && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
                      {openMRAs}
                    </Badge>
                  )}
                </>
              )}
              {collapsed && showBadge && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
              )}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t">
        {!collapsed && (
          <div className="mb-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Generate examiner-ready responses with AI assistance.
            </p>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

