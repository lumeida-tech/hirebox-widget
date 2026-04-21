
import { IconFileTypePdf, IconTrophy, IconMedal, IconAward } from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"

export type Candidate = {
  id: string
  name: string
  score: number       // 0–100
  cvUrl: string       // URL or path to the PDF
}

interface CandidatesTableProps {
  candidates: Candidate[]
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center gap-1 font-semibold text-amber-500">
        <IconTrophy className="size-4" /> 1
      </span>
    )
  if (rank === 2)
    return (
      <span className="flex items-center gap-1 font-semibold text-slate-400">
        <IconMedal className="size-4" /> 2
      </span>
    )
  if (rank === 3)
    return (
      <span className="flex items-center gap-1 font-semibold text-orange-400">
        <IconAward className="size-4" /> 3
      </span>
    )
  return <span className="text-muted-foreground font-medium">{rank}</span>
}

function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 80 ? "default" : score >= 50 ? "secondary" : "destructive"
  return (
    <Badge variant={variant} className="tabular-nums font-semibold">
      {score} / 100
    </Badge>
  )
}

export function CandidatesTable({ candidates }: CandidatesTableProps) {
  // Sort descending by score
  const sorted = [...candidates].sort((a, b) => b.score - a.score)

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 text-center">Rang</TableHead>
            <TableHead>Candidats</TableHead>
            <TableHead className="w-36 text-center">Score</TableHead>
            <TableHead className="w-28 text-center">CV</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((candidate, index) => (
            <TableRow key={candidate.id}>
              {/* Rank */}
              <TableCell className="text-center">
                <RankBadge rank={index + 1} />
              </TableCell>

              {/* Name */}
              <TableCell className="font-medium">{candidate.name}</TableCell>

              {/* Score */}
              <TableCell className="text-center">
                <ScoreBadge score={candidate.score} />
              </TableCell>

              {/* PDF viewer */}
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <IconFileTypePdf className="size-4 text-red-500" />
                      Voir CV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>
                        CV — {candidate.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden rounded-md border">
                      <iframe
                        src={candidate.cvUrl}
                        className="w-full h-full"
                        title={`CV de ${candidate.name}`}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
