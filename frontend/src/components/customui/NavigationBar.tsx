import { Link } from "react-router-dom"
import {
  CircleUser,
  Menu,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


const NavigationBar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-muted px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-base lg:gap-6">
                <Link
                    to="/"
                    className="text-foreground transition-colors hover:text-foreground"
                >
                    Dashboard
                </Link>
                <Link
                    to="/orders"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Orders
                </Link>
                <Link
                    to="/parts"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Parts
                </Link>
                <Link
                    to="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Storage
                </Link>
            </nav>
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                <Link to="#" className="hover:text-foreground">
                    Dashboard
                </Link>
                <Link
                    to="/orders"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Orders
                </Link>
                <Link
                    to="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Parts
                </Link>
                <Link
                    to="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Storage
                </Link>
                </nav>
            </SheetContent>
            </Sheet>

        <div className="flex justify-end w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
  )
}

export default NavigationBar