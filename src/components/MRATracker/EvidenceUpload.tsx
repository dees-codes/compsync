import { useState, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { EVIDENCE_CATEGORY_LABELS, type EvidenceCategory, type MRA } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Link2, 
  Link2Off,
  CheckCircle,
  File,
  FileSpreadsheet,
  FileImage,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface EvidenceUploadProps {
  mra: MRA
}

export function EvidenceUpload({ mra }: EvidenceUploadProps) {
  const { evidence, addEvidence, linkEvidenceToMRA, unlinkEvidenceFromMRA, deleteEvidence } = useStore()
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory>('policies')

  const linkedEvidence = evidence.filter(e => mra.evidenceIds.includes(e.id))
  const unlinkedEvidence = evidence.filter(e => !mra.evidenceIds.includes(e.id))

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText
    if (fileType.includes('sheet') || fileType.includes('excel')) return FileSpreadsheet
    if (fileType.includes('image')) return FileImage
    return File
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
      // In a real app, we'd upload to storage and extract text
      // For the prototype, we'll just store metadata and simulate content
      const newEvidence = addEvidence({
        name: file.name,
        category: selectedCategory,
        fileType: file.type,
        fileSize: file.size,
        content: `[Content of ${file.name} would be extracted here for AI processing]`,
      })
      
      // Auto-link to current MRA
      linkEvidenceToMRA(mra.id, newEvidence.id)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Evidence</CardTitle>
          <CardDescription>
            Upload compliance documents, policies, procedures, and other evidence to support your MRA response.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
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
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              onChange={handleFileInput}
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Linked Evidence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Linked Evidence ({linkedEvidence.length})
          </CardTitle>
          <CardDescription>
            Documents linked to this MRA finding
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkedEvidence.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No evidence linked yet. Upload documents above or link from the library.
            </p>
          ) : (
            <div className="space-y-2">
              {linkedEvidence.map(doc => {
                const FileIcon = getFileIcon(doc.fileType)
                return (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {EVIDENCE_CATEGORY_LABELS[doc.category]}
                          </Badge>
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => unlinkEvidenceFromMRA(mra.id, doc.id)}
                        title="Unlink from this MRA"
                      >
                        <Link2Off className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEvidence(doc.id)}
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evidence Library (unlinked) */}
      {unlinkedEvidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evidence Library</CardTitle>
            <CardDescription>
              Other documents in your library that can be linked to this MRA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unlinkedEvidence.map(doc => {
                const FileIcon = getFileIcon(doc.fileType)
                return (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {EVIDENCE_CATEGORY_LABELS[doc.category]}
                          </Badge>
                          <span>{formatFileSize(doc.fileSize)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => linkEvidenceToMRA(mra.id, doc.id)}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Link
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

