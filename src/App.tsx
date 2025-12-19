import { useState } from 'react'
import { Header } from '@/components/Layout/Header'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { MRATracker } from '@/components/MRATracker'
import { EvidenceLibrary } from '@/components/EvidenceLibrary'
import { Toaster } from 'sonner'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={handleNavigate} />
        <main className="flex-1 p-6 max-w-6xl">
          {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {activeTab === 'mras' && <MRATracker />}
          {activeTab === 'evidence' && <EvidenceLibrary />}
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}

export default App

