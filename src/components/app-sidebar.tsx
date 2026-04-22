import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  //IconUsers,
  IconBriefcase,
  IconCirclePlus,
} from "@tabler/icons-react"
import { NavUser } from "#/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar"
import { CreateRecruitmentDialog } from "#/components/create-recruitment-dialog"
import type { ActiveView } from "@/types"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
}

const user = {
  name: "Nom de la compagnie",
  email: "email@exemple.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar({ activeView, onNavigate, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">HireBox.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>

          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === 'dashboard'}
              onClick={() => onNavigate('dashboard')}
              className="cursor-pointer"
            >
              <IconDashboard className="size-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Candidats */}
          {/* 
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === 'candidates'}
              onClick={() => onNavigate('candidates')}
              className="cursor-pointer"
            >
              <IconUsers className="size-4" />
              <span>Candidats</span>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          {/* Recrutements */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === 'recruitments'}
              onClick={() => onNavigate('recruitments')}
              className="cursor-pointer"
            >
              <IconBriefcase className="size-4" />
              <span>Recrutements</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Créer un recrutement */}
          <SidebarMenuItem>
            <CreateRecruitmentDialog>
              <SidebarMenuButton className="cursor-pointer text-primary">
                <IconCirclePlus className="size-4" />
                <span>Créer un recrutement</span>
              </SidebarMenuButton>
            </CreateRecruitmentDialog>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
