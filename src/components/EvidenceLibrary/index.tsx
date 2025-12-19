import { useState, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { EVIDENCE_CATEGORY_LABELS, type EvidenceCategory } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Upload, 
  FileText, 
  Trash2, 
  Search,
  FolderOpen,
  File,
  FileSpreadsheet,
  FileImage,
  Link2,
  Clock,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export function EvidenceLibrary() {
  const { evidence, addEvidence, deleteEvidence, mras } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<EvidenceCategory | 'all'>('all')
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory>('policies')

  const filteredEvidence = evidence.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Group by category
  const groupedEvidence = filteredEvidence.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {} as Record<EvidenceCategory, typeof evidence>)

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText
    if (fileType.includes('sheet') || fileType.includes('excel')) return FileSpreadsheet
    if (fileType.includes('image')) return FileImage
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [selectedCategory])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      addEvidence({
        name: file.name,
        category: selectedCategory,
        fileType: file.type,
        fileSize: file.size,
        content: `[Content of ${file.name} would be extracted here for AI processing]`,
      })
    })
  }

  // Category stats
  const categoryStats = Object.entries(EVIDENCE_CATEGORY_LABELS).map(([key, label]) => ({
    category: key as EvidenceCategory,
    label,
    count: evidence.filter(e => e.category === key).length,
  }))

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {categoryStats.map(({ category, label, count }) => (
          <Card 
            key={category}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              categoryFilter === category && "ring-2 ring-primary"
            )}
            onClick={() => setCategoryFilter(categoryFilter === category ? 'all' : category)}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Add compliance documents, policies, procedures, and training materials to your evidence library.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as EvidenceCategory)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVIDENCE_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={cn(
              "h-10 w-10 mx-auto mb-4",
              dragActive ? "text-primary" : "text-muted-foreground"
            )} />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports PDF, Word, Excel, and image files
            </p>
            <input
              type="file"
              id="evidence-library-upload"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              onChange={handleFileInput}
            />
            <Button asChild variant="outline">
              <label htmlFor="evidence-library-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as EvidenceCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(EVIDENCE_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      {filteredEvidence.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No Documents Found</h3>
            <p className="text-muted-foreground mb-4">
              {evidence.length === 0 
                ? "Get started by uploading your first compliance document."
                : "No documents match your search criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEvidence).map(([category, docs]) => (
            <Card key={category}>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  {EVIDENCE_CATEGORY_LABELS[category as EvidenceCategory]}
                  <Badge variant="secondary" className="ml-auto">
                    {docs.length} {docs.length === 1 ? 'document' : 'documents'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {docs.map((doc, index) => {
                    const FileIcon = getFileIcon(doc.fileType)
                    const linkedMRAs = mras.filter(m => m.evidenceIds.includes(doc.id))
                    
                    return (
                      <div 
                        key={doc.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors animate-fade-in",
                          `stagger-${Math.min(index + 1, 5)}`
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{formatFileSize(doc.fileSize)}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(doc.uploadedAt)}
                              </span>
                              {linkedMRAs.length > 0 && (
                                <span className="flex items-center gap-1 text-primary">
                                  <Link2 className="h-3 w-3" />
                                  Linked to {linkedMRAs.length} MRA{linkedMRAs.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEvidence(doc.id)}
                          title="Delete document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

