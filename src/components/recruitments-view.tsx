import * as React from "react"
import {
  IconBriefcase, IconMapPin, IconCalendar, IconChevronRight,
  IconBuilding, IconCirclePlus, IconUsers, IconFileTypePdf,
  IconTrophy, IconMedal, IconAward,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { CreateRecruitmentDialog } from "@/components/create-recruitment-dialog"
import type { Recruitment, Candidate } from "@/types"

const CONTRACT_COLORS: Record<string, string> = {
  CDI: "default", CDD: "secondary", Stage: "outline",
  Alternance: "outline", Freelance: "secondary", "Temps partiel": "outline",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="flex items-center gap-1 font-semibold text-amber-500"><IconTrophy className="size-4" /> 1</span>
  if (rank === 2) return <span className="flex items-center gap-1 font-semibold text-slate-400"><IconMedal className="size-4" /> 2</span>
  if (rank === 3) return <span className="flex items-center gap-1 font-semibold text-orange-400"><IconAward className="size-4" /> 3</span>
  return <span className="text-muted-foreground font-medium">{rank}</span>
}

function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? "default" : score >= 50 ? "secondary" : "destructive"
  return <Badge variant={variant as any} className="tabular-nums font-semibold">{score} / 100</Badge>
}

function CandidatesSection({ candidates }: { candidates: Candidate[] }) {
  const sorted = [...candidates].sort((a, b) => b.score - a.score)
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
        <IconUsers className="size-8 mb-2 opacity-30" />
        <p className="text-sm">Aucun candidat pour ce recrutement.</p>
      </div>
    )
  }
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 text-center">Rang</TableHead>
            <TableHead>Candidat</TableHead>
            <TableHead className="w-28 text-center">Score</TableHead>
            <TableHead className="w-20 text-center">CV</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((candidate, index) => (
            <TableRow key={candidate.id}>
              <TableCell className="text-center"><RankBadge rank={index + 1} /></TableCell>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell className="text-center"><ScoreBadge score={candidate.score} /></TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"><IconFileTypePdf className="size-4 text-red-500" /></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>CV — {candidate.name}</DialogTitle>
                      <DialogDescription>Aperçu du CV du candidat.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden rounded-md border">
                      <object data={candidate.cvUrl} type="application/pdf" className="w-full h-full">
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                          <IconFileTypePdf className="size-10 text-red-400" />
                          <p className="text-sm">Aperçu non disponible</p>
                          <a href={candidate.cvUrl} target="_blank" rel="noreferrer" className="text-sm underline">Ouvrir le PDF</a>
                        </div>
                      </object>
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

const DEMO: Recruitment[] = [
  {
    id: "1", title: "Développeur Full Stack", company: "HireBox Inc.", contractType: "CDI",
    location: "Paris", description: "Rejoignez notre équipe pour développer des features sur notre plateforme SaaS RH.",
    requirements: "3+ ans d'expérience React & Node.js, TypeScript, bases SQL.", createdAt: new Date("2025-03-10"),
    candidates: [
      { id: "c1", name: "Candidat 1", score: 92, cvUrl: "/cvs/cv-1.pdf" },
      { id: "c2", name: "Candidat 2", score: 74, cvUrl: "/cvs/cv-3.pdf" },
      { id: "c3", name: "Candidat 3", score: 88, cvUrl: "/cvs/cv-2.pdf" },
    ],
  },
  {
    id: "2", title: "Designer UX/UI", company: "HireBox Inc.", contractType: "CDD",
    location: "Remote", description: "Conception des parcours utilisateurs et des interfaces de notre produit.",
    requirements: "Figma avancé, expérience SaaS B2B, portfolio requis.", createdAt: new Date("2025-03-18"),
    candidates: [
      { id: "c4", name: "Candidat 4", score: 65, cvUrl: "/cvs/cv-2.pdf" },
      { id: "c5", name: "Candidat 5", score: 81, cvUrl: "/cvs/cv-1.pdf" },
    ],
  },
]

export function RecruitmentsView() {
  const [recruitments, setRecruitments] = React.useState<Recruitment[]>(DEMO)
  const [selected, setSelected] = React.useState<Recruitment | null>(null)

  function handleCreated(r: Recruitment) {
    setRecruitments(prev => [r, ...prev])
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Offres de recrutement</h2>
          <p className="text-sm text-muted-foreground">
            {recruitments.length} offre{recruitments.length > 1 ? "s" : ""} publiée{recruitments.length > 1 ? "s" : ""}
          </p>
        </div>
        <CreateRecruitmentDialog onCreated={handleCreated}>
          <Button className="gap-2"><IconCirclePlus className="size-4" />Créer une offre</Button>
        </CreateRecruitmentDialog>
      </div>

      {recruitments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
          <IconBriefcase className="size-10 mb-3 opacity-30" />
          <p className="text-sm">Aucune offre pour l'instant.</p>
        </div>
      ) : (
        <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {recruitments.map(r => (
            <Card key={r.id} className="cursor-pointer hover:border-primary/50 transition-colors @container/card" onClick={() => setSelected(r)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{r.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <IconBuilding className="size-3" />{r.company}
                    </CardDescription>
                  </div>
                  <Badge variant={CONTRACT_COLORS[r.contractType] as any ?? "outline"}>{r.contractType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{r.description || "Aucune description."}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {r.location && <span className="flex items-center gap-1"><IconMapPin className="size-3" />{r.location}</span>}
                    <span className="flex items-center gap-1"><IconCalendar className="size-3" />{formatDate(r.createdAt)}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <IconUsers className="size-3" />{r.candidates.length} candidat{r.candidates.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">Voir détails <IconChevronRight className="size-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>Détails de l'offre et candidats associés.</SheetDescription>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant={CONTRACT_COLORS[selected.contractType] as any ?? "outline"}>{selected.contractType}</Badge>
                  {selected.location && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <IconMapPin className="size-3.5" />{selected.location}
                    </span>
                  )}
                </div>
              </SheetHeader>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-medium mb-1 flex items-center gap-1.5"><IconBuilding className="size-4" />Entreprise</p>
                  <p className="text-muted-foreground">{selected.company}</p>
                </div>
                {selected.description && (
                  <div>
                    <p className="font-medium mb-1">Description du poste</p>
                    <p className="text-muted-foreground whitespace-pre-line">{selected.description}</p>
                  </div>
                )}
                {selected.requirements && (
                  <div>
                    <p className="font-medium mb-1">Exigences & compétences</p>
                    <p className="text-muted-foreground whitespace-pre-line">{selected.requirements}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium mb-1 flex items-center gap-1.5"><IconCalendar className="size-4" />Créée le</p>
                  <p className="text-muted-foreground">{formatDate(selected.createdAt)}</p>
                </div>
                <div>
                  <p className="font-medium mb-3 flex items-center gap-1.5">
                    <IconUsers className="size-4" />Candidats ({selected.candidates.length})
                  </p>
                  <CandidatesSection candidates={selected.candidates} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
