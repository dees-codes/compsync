import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MRA, Evidence, GeneratedResponse, MRAStatus, MRACategory } from '@/types'

interface AppState {
  // MRAs
  mras: MRA[]
  addMRA: (mra: Omit<MRA, 'id' | 'createdAt' | 'updatedAt' | 'evidenceIds'>) => MRA
  updateMRA: (id: string, updates: Partial<MRA>) => void
  deleteMRA: (id: string) => void
  updateMRAStatus: (id: string, status: MRAStatus) => void
  linkEvidenceToMRA: (mraId: string, evidenceId: string) => void
  unlinkEvidenceFromMRA: (mraId: string, evidenceId: string) => void

  // Evidence
  evidence: Evidence[]
  addEvidence: (evidence: Omit<Evidence, 'id' | 'uploadedAt' | 'mraIds'>) => Evidence
  updateEvidence: (id: string, updates: Partial<Evidence>) => void
  deleteEvidence: (id: string) => void

  // Generated Responses
  generatedResponses: GeneratedResponse[]
  addGeneratedResponse: (response: GeneratedResponse) => void
  updateGeneratedResponse: (id: string, updates: Partial<GeneratedResponse>) => void

  // UI State
  selectedMRAId: string | null
  setSelectedMRAId: (id: string | null) => void
  
  // Filters
  statusFilter: MRAStatus | 'all'
  setStatusFilter: (status: MRAStatus | 'all') => void
  categoryFilter: MRACategory | 'all'
  setCategoryFilter: (category: MRACategory | 'all') => void

  // Sample Data
  loadSampleData: () => void
  clearAllData: () => void
}

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID()

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      mras: [],
      evidence: [],
      generatedResponses: [],
      selectedMRAId: null,
      statusFilter: 'all',
      categoryFilter: 'all',

      // MRA actions
      addMRA: (mraData) => {
        const newMRA: MRA = {
          ...mraData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          evidenceIds: [],
        }
        set((state) => ({ mras: [...state.mras, newMRA] }))
        return newMRA
      },

      updateMRA: (id, updates) => {
        set((state) => ({
          mras: state.mras.map((mra) =>
            mra.id === id
              ? { ...mra, ...updates, updatedAt: new Date().toISOString() }
              : mra
          ),
        }))
      },

      deleteMRA: (id) => {
        set((state) => ({
          mras: state.mras.filter((mra) => mra.id !== id),
          generatedResponses: state.generatedResponses.filter((r) => r.mraId !== id),
        }))
      },

      updateMRAStatus: (id, status) => {
        set((state) => ({
          mras: state.mras.map((mra) =>
            mra.id === id
              ? { ...mra, status, updatedAt: new Date().toISOString() }
              : mra
          ),
        }))
      },

      linkEvidenceToMRA: (mraId, evidenceId) => {
        set((state) => ({
          mras: state.mras.map((mra) =>
            mra.id === mraId && !mra.evidenceIds.includes(evidenceId)
              ? { ...mra, evidenceIds: [...mra.evidenceIds, evidenceId], updatedAt: new Date().toISOString() }
              : mra
          ),
          evidence: state.evidence.map((e) =>
            e.id === evidenceId && !e.mraIds.includes(mraId)
              ? { ...e, mraIds: [...e.mraIds, mraId] }
              : e
          ),
        }))
      },

      unlinkEvidenceFromMRA: (mraId, evidenceId) => {
        set((state) => ({
          mras: state.mras.map((mra) =>
            mra.id === mraId
              ? { ...mra, evidenceIds: mra.evidenceIds.filter((id) => id !== evidenceId), updatedAt: new Date().toISOString() }
              : mra
          ),
          evidence: state.evidence.map((e) =>
            e.id === evidenceId
              ? { ...e, mraIds: e.mraIds.filter((id) => id !== mraId) }
              : e
          ),
        }))
      },

      // Evidence actions
      addEvidence: (evidenceData) => {
        const newEvidence: Evidence = {
          ...evidenceData,
          id: generateId(),
          uploadedAt: new Date().toISOString(),
          mraIds: [],
        }
        set((state) => ({ evidence: [...state.evidence, newEvidence] }))
        return newEvidence
      },

      updateEvidence: (id, updates) => {
        set((state) => ({
          evidence: state.evidence.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }))
      },

      deleteEvidence: (id) => {
        const evidence = get().evidence.find((e) => e.id === id)
        if (evidence) {
          // Unlink from all MRAs
          set((state) => ({
            evidence: state.evidence.filter((e) => e.id !== id),
            mras: state.mras.map((mra) => ({
              ...mra,
              evidenceIds: mra.evidenceIds.filter((eId) => eId !== id),
            })),
          }))
        }
      },

      // Generated Response actions
      addGeneratedResponse: (response) => {
        set((state) => ({
          generatedResponses: [...state.generatedResponses, response],
          mras: state.mras.map((mra) =>
            mra.id === response.mraId
              ? { ...mra, generatedResponse: response, updatedAt: new Date().toISOString() }
              : mra
          ),
        }))
      },

      updateGeneratedResponse: (id, updates) => {
        set((state) => ({
          generatedResponses: state.generatedResponses.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }))
      },

      // UI State actions
      setSelectedMRAId: (id) => set({ selectedMRAId: id }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),

      // Sample Data actions
      loadSampleData: async () => {
        const { sampleMRAs, sampleEvidence } = await import('@/data/sampleData')
        
        // Add sample evidence first
        const evidenceIds: string[] = []
        sampleEvidence.forEach((e) => {
          const newEvidence: Evidence = {
            ...e,
            id: generateId(),
            uploadedAt: new Date().toISOString(),
            mraIds: [],
          }
          evidenceIds.push(newEvidence.id)
          set((state) => ({ evidence: [...state.evidence, newEvidence] }))
        })
        
        // Add sample MRAs and link some evidence
        sampleMRAs.forEach((mra, index) => {
          const newMRA: MRA = {
            ...mra,
            id: generateId(),
            createdAt: new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)).toISOString(),
            updatedAt: new Date().toISOString(),
            evidenceIds: index < 2 ? evidenceIds.slice(0, 3) : [],
          }
          set((state) => ({ mras: [...state.mras, newMRA] }))
        })
      },

      clearAllData: () => {
        set({ mras: [], evidence: [], generatedResponses: [], selectedMRAId: null })
      },
    }),
    {
      name: 'compsync-storage',
      partialize: (state) => ({
        mras: state.mras,
        evidence: state.evidence,
        generatedResponses: state.generatedResponses,
      }),
    }
  )
)

// Selector hooks for convenience
export const useMRAs = () => useStore((state) => state.mras)
export const useEvidence = () => useStore((state) => state.evidence)
export const useSelectedMRA = () => {
  const mras = useStore((state) => state.mras)
  const selectedId = useStore((state) => state.selectedMRAId)
  return mras.find((mra) => mra.id === selectedId) || null
}
export const useFilteredMRAs = () => {
  const mras = useStore((state) => state.mras)
  const statusFilter = useStore((state) => state.statusFilter)
  const categoryFilter = useStore((state) => state.categoryFilter)

  return mras.filter((mra) => {
    const matchesStatus = statusFilter === 'all' || mra.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || mra.category === categoryFilter
    return matchesStatus && matchesCategory
  })
}

