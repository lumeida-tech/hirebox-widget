import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from 'react';
// Importez vos composants UI (Shadcn UI ou équivalent) ici

export function CardDemo() {
  // 1. État pour savoir si on affiche Login ou Sign Up
  const [isSignUp, setIsSignUp] = useState(false);

  // 2. Gestion du changement de mode
  const toggleMode = () => setIsSignUp(!isSignUp);
  return (
    <Card className="w-full max-w-sm mx-auto my-8">
      <CardHeader>
        <CardTitle>{isSignUp ? "Créer un compte" : "Login"}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? "Saissisez les informations de votre compagnie" 
            : "Entrez vos identifiants pour vous connecter"}
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={toggleMode}>
            {isSignUp ? "Se connecter" : "S'inscrire"}
          </Button>
        </CardAction>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            
            {/* Champs additionnels pour l'inscription */}
            {isSignUp && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="company">Nom de la compagnie</Label>
                  <Input id="company" type="text" placeholder="Hirebox" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Adresse web</Label>
                  <Input id="website" type="text" placeholder="www.example.com" required />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="compagnie@exemple.com" required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
                {!isSignUp && (
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Mot de passe oublié?
                  </a>
                )}
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full">
          {isSignUp ? "S'inscrire" : "Se connecter"}
        </Button>
      </CardFooter>
    </Card>
  );
}





