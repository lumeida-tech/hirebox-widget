// vérifier le token 

import { createFileRoute, redirect, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hirebox_token"):null
    
    if(!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: () => <Outlet />,
})
