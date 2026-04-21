import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Textarea } from "#/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"

export type Recruitment = {
  id: string
  title: string
  company: string
  contractType: string
  description: string
  requirements: string
  location: string
  createdAt: Date
}

interface CreateRecruitmentDialogProps {
  children: React.ReactNode
  onCreated?: (recruitment: Recruitment) => void
}

export function CreateRecruitmentDialog({ children, onCreated }: CreateRecruitmentDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    title: "",
    company: "",
    contractType: "",
    location: "",
    description: "",
    requirements: "",
  })

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    if (!form.title || !form.company || !form.contractType) return
    const recruitment: Recruitment = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date(),
    }
    onCreated?.(recruitment)
    setForm({ title: "", company: "", contractType: "", location: "", description: "", requirements: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une offre de recrutement</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour publier une nouvelle offre.
            </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Titre du poste */}
          <div className="grid gap-1.5">
            <Label htmlFor="title">Titre du poste <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="ex. Développeur Full Stack"
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
            />
          </div>

          {/* Entreprise */}
          <div className="grid gap-1.5">
            <Label htmlFor="company">Entreprise <span className="text-destructive">*</span></Label>
            <Input
              id="company"
              placeholder="ex. HireBox Inc."
              value={form.company}
              onChange={e => handleChange("company", e.target.value)}
            />
          </div>

          {/* Type de contrat + Lieu */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type de contrat <span className="text-destructive">*</span></Label>
              <Select onValueChange={v => handleChange("contractType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Temps partiel">Temps partiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                placeholder="ex. Paris, Remote"
                value={form.location}
                onChange={e => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description du poste</Label>
            <Textarea
              id="description"
              placeholder="Décrivez les missions, responsabilités..."
              rows={4}
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
            />
          </div>

          {/* Exigences */}
          <div className="grid gap-1.5">
            <Label htmlFor="requirements">Exigences & compétences requises</Label>
            <Textarea
              id="requirements"
              placeholder="ex. 3 ans d'expérience React, TypeScript..."
              rows={3}
              value={form.requirements}
              onChange={e => handleChange("requirements", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!form.title || !form.company || !form.contractType}>
            Créer l'offre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
