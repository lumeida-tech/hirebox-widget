import { createFileRoute } from "@tanstack/react-router"
import { CandidatesTable } from "@/components/candidates-table"

export const Route = createFileRoute('/candidates')({
  component: CandidatesPage,
})

const mockCandidates = [
  { id: "1", name: "Candidat 1", score: 92, cvUrl: "/cvs/cv-1.pdf" },
  { id: "2", name: "Candidat 2",   score: 88, cvUrl: "/cvs/cv-2.pdf" },
  { id: "3", name: "Candidat 3", score: 84, cvUrl: "/cvs/cv-3.pdf" },
  //{ id: "4", name: "Candidat 4", score: 80, cvUrl: "/cvs/clara.pdf" },
]

function CandidatesPage() {
  return (
    <div className="p-6">
      <CandidatesTable candidates={mockCandidates} />
    </div>
  )
}