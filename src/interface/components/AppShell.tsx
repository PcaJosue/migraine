import { useState } from 'react'
import { useUIStore } from '@/interface/state/uiStore'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { HomePage } from '@/interface/pages/HomePage'
import { EntriesPage } from '@/interface/pages/EntriesPage'
import { InsightsPage } from '@/interface/pages/InsightsPage'
import { SettingsPage } from '@/interface/pages/SettingsPage'
import { QuickEntryModal } from './QuickEntryModal'

export function AppShell() {
  const { currentPage, sidebarOpen, quickEntryOpen } = useUIStore()

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'entries':
        return <EntriesPage />
      case 'insights':
        return <InsightsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <TopNav />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <main className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}>
          <div className="container mx-auto px-4 py-6">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Quick Entry Modal */}
      {quickEntryOpen && <QuickEntryModal />}
    </div>
  )
}
