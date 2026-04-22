import * as React from "react"
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
import { activateApi } from "@/services/auth.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconCircleCheck, IconCircleX, IconLoader2 } from "@tabler/icons-react"

export const Route = createFileRoute("/auth/activate")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? "",
  }),
  component: ActivatePage,
})

function ActivatePage() {
  const { token } = useSearch({ from: "/auth/activate" })
  const navigate = useNavigate()
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token d'activation manquant.")
      return
    }

    activateApi(token)
      .then(data => {
        setStatus("success")
        setMessage(data.message ?? "Votre compte a été activé avec succès.")
      })
      .catch(err => {
        setStatus("error")
        setMessage(err.message ?? "Lien d'activation invalide ou expiré.")
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            {status === "loading" && (
              <IconLoader2 className="size-10 text-muted-foreground animate-spin" />
            )}
            {status === "success" && (
              <IconCircleCheck className="size-10 text-green-500" />
            )}
            {status === "error" && (
              <IconCircleX className="size-10 text-destructive" />
            )}
          </div>
          <CardTitle>
            {status === "loading" && "Activation en cours..."}
            {status === "success" && "Compte activé !"}
            {status === "error" && "Activation échouée"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        {status !== "loading" && (
          <CardContent>
            <Button
              className="w-full"
              variant={status === "success" ? "default" : "outline"}
              onClick={() => navigate({ to: "/login" })}
            >
              {status === "success" ? "Se connecter" : "Retour à la connexion"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
