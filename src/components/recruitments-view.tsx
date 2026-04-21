import * as React from "react"
import { IconBriefcase, IconMapPin, IconCalendar, IconChevronRight, IconBuilding } from "@tabler/icons-react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
import { CreateRecruitmentDialog, type Recruitment } from "@/components/create-recruitment-dialog.tsx"
import { IconCirclePlus } from "@tabler/icons-react"

const CONTRACT_COLORS: Record<string, string> = {
  CDI: "default",
  CDD: "secondary",
  Stage: "outline",
  Alternance: "outline",
  Freelance: "secondary",
  "Temps partiel": "outline",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

// Demo data
const DEMO: Recruitment[] = [
  {
    id: "1",
    title: "Développeur Full Stack",
    company: "HireBox Inc.",
    contractType: "CDI",
    location: "Paris",
    description: "Rejoignez notre équipe pour développer des features sur notre plateforme SaaS RH. Travail en méthode agile, stack moderne.",
    requirements: "3+ ans d'expérience React & Node.js, TypeScript, bases SQL.",
    createdAt: new Date("2025-03-10"),
  },
  {
    id: "2",
    title: "Designer UX/UI",
    company: "HireBox Inc.",
    contractType: "CDD",
    location: "Remote",
    description: "Conception des parcours utilisateurs et des interfaces de notre produit. Collaboration étroite avec les devs.",
    requirements: "Figma avancé, expérience SaaS B2B, portfolio requis.",
    createdAt: new Date("2025-03-18"),
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Offres de recrutement</h2>
          <p className="text-sm text-muted-foreground">{recruitments.length} offre{recruitments.length > 1 ? "s" : ""} publiée{recruitments.length > 1 ? "s" : ""}</p>
        </div>
        <CreateRecruitmentDialog onCreated={handleCreated}>
          <Button className="gap-2">
            <IconCirclePlus className="size-4" />
            Créer une offre
          </Button>
        </CreateRecruitmentDialog>
      </div>

      {/* Cards grid */}
      {recruitments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
          <IconBriefcase className="size-10 mb-3 opacity-30" />
          <p className="text-sm">Aucune offre pour l'instant.</p>
          <p className="text-sm">Utilisez "Créer une offre" pour commencer.</p>
        </div>
      ) : (
        <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {recruitments.map(r => (
            <Card
              key={r.id}
              className="cursor-pointer hover:border-primary/50 transition-colors @container/card"
              onClick={() => setSelected(r)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{r.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <IconBuilding className="size-3" />
                      {r.company}
                    </CardDescription>
                  </div>
                  <Badge variant={CONTRACT_COLORS[r.contractType] as any ?? "outline"}>
                    {r.contractType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {r.description || "Aucune description."}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {r.location && (
                    <span className="flex items-center gap-1">
                      <IconMapPin className="size-3" /> {r.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <IconCalendar className="size-3" /> {formatDate(r.createdAt)}
                  </span>
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Voir détails <IconChevronRight className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>{selected.title}</SheetTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant={CONTRACT_COLORS[selected.contractType] as any ?? "outline"}>
                    {selected.contractType}
                  </Badge>
                  {selected.location && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <IconMapPin className="size-3.5" /> {selected.location}
                    </span>
                  )}
                </div>
              </SheetHeader>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-medium mb-1 flex items-center gap-1.5">
                    <IconBuilding className="size-4" /> Entreprise
                  </p>
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
                  <p className="font-medium mb-1 flex items-center gap-1.5">
                    <IconCalendar className="size-4" /> Créée le
                  </p>
                  <p className="text-muted-foreground">{formatDate(selected.createdAt)}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}