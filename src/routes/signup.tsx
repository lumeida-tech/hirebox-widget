import { createFileRoute } from "@tanstack/react-router"
import { AuthCard } from "@/components/auth-card"

export const Route = createFileRoute("/signup")({
  component: SignupPage,
})

function SignupPage() {
  return <AuthCard mode="signup" />
}
