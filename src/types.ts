export type Candidate = {
  id: string
  name: string
  score: number
  cvUrl: string
}

export type Recruitment = {
  id: string
  title: string
  company: string
  contractType: string
  description: string
  requirements: string
  location: string
  createdAt: Date
  candidates: Candidate[]
}
