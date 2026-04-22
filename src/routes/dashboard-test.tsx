import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
//import { CandidatesTable } from "@/components/candidates-table"
import { RecruitmentsView } from "@/components/recruitments-view"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export type ActiveView = 'dashboard' | 'candidates' | 'recruitments'

export const Route = createFileRoute('/dashboard-test')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeView, setActiveView] = React.useState<ActiveView>('dashboard')
 /*
  const mockCandidates = [
    { id: "1", name: "Candidat 1",  score: 92, cvUrl: "/cvs/cv-1.pdf" },
    { id: "2", name: "Candidat 2",    score: 74, cvUrl: "/cvs/cv-2.pdf" },
    { id: "3", name: "Candidat 3",  score: 95, cvUrl: "/cvs/cv-3.pdf" },
  ] */

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" activeView={activeView} onNavigate={setActiveView} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col ">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-5">
              {activeView === 'dashboard' && <SectionCards />}
              {/*{activeView === 'candidates' && <CandidatesTable candidates={mockCandidates} />}*/}
              {activeView === 'recruitments' && <RecruitmentsView />}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}