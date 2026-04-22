import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardAction, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/context/auth-context"
import { loginApi, registerApi } from "@/services/auth.service"

interface AuthCardProps {
  mode: "login" | "signup"
}

export function AuthCard({ mode }: AuthCardProps) {
  const isSignUp = mode === "signup"
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [website, setWebsite] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)
    try {
      if (isSignUp) {
        const data = await registerApi({ email, password, company_name: company, website })
        setSuccessMessage(data.message)
      } else {
        const data = await loginApi({ email, password })
        login(data.access_token, data.refresh_token)
        navigate({ to: "/dashboard" })
      }
    } catch (err: any) {
      setError(err.message ?? "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isSignUp ? "Créer un compte" : "Connexion"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Saisissez les informations de votre compagnie" : "Entrez vos identifiants pour vous connecter"}
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to={isSignUp ? "/login" : "/signup"}>
                {isSignUp ? "Se connecter" : "S'inscrire"}
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="auth-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {isSignUp && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Nom de la compagnie</Label>
                    <Input id="company" type="text" placeholder="Hirebox" required
                      value={company} onChange={e => setCompany(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Adresse web</Label>
                    <Input id="website" type="text" placeholder="www.example.com" required
                      value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="compagnie@exemple.com" required
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  {!isSignUp && (
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Mot de passe oublié ?
                    </a>
                  )}
                </div>
                <Input id="password" type="password" required
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="auth-form" className="w-full" disabled={loading || !!successMessage}>
            {loading
              ? isSignUp ? "Inscription en cours..." : "Connexion en cours..."
              : isSignUp ? "S'inscrire" : "Se connecter"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
