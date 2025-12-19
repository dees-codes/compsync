import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Bell, 
  Settings,
  User,
} from 'lucide-react'

export function Header() {
  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="h-full w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">
              CompSync
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">
              MRA COMPLIANCE PLATFORM
            </p>
          </div>
        </div>

        {/* Center - can add navigation here if needed */}
        <div className="hidden md:flex items-center gap-1">
          <Badge variant="outline" className="text-xs font-normal">
            Demo Mode
          </Badge>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-destructive rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-8 w-px bg-border mx-2" />
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden sm:inline font-medium">Demo User</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

