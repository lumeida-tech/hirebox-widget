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

import React, { useState } from 'react';
// Importez vos composants UI (Shadcn UI ou équivalent) ici

export function CardDemo() {
  // 1. État pour savoir si on affiche Login ou Sign Up
  const [isSignUp, setIsSignUp] = useState(false);

  // 2. Gestion du changement de mode
  const toggleMode = () => setIsSignUp(!isSignUp);
  return (
    <Card className="w-full max-w-sm mx-auto my-8">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create an account" : "Login"}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? "Fill in the details to register your company" 
            : "Enter your credentials to access your account"}
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={toggleMode}>
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
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
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" type="text" placeholder="Acme Inc." required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website Domain</Label>
                  <Input id="website" type="text" placeholder="www.example.com" required />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
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
          {isSignUp ? "Register" : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}





