import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { CATEGORY_LABELS, type MRACategory, type MRAStatus } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddMRADialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMRADialog({ open, onOpenChange }: AddMRADialogProps) {
  const { addMRA } = useStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'compliance' as MRACategory,
    assignee: '',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    addMRA({
      ...formData,
      status: 'open' as MRAStatus,
    })
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'compliance',
      assignee: '',
      deadline: '',
      priority: 'medium',
    })
    
    onOpenChange(false)
  }

  const isValid = formData.title && formData.description && formData.assignee && formData.deadline

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add MRA Finding</DialogTitle>
            <DialogDescription>
              Enter the details of the MRA finding from the examination report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Finding Title</Label>
              <Input
                id="title"
                placeholder="e.g., Transaction monitoring lacks documented tuning methodology"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Finding Description</Label>
              <Textarea
                id="description"
                placeholder="Paste the full finding text from the examination report..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as MRACategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as 'high' | 'medium' | 'low' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <Input
                  id="assignee"
                  placeholder="e.g., John Smith, BSA Officer"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Add MRA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

