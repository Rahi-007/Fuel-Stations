import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearAuth } from "@/context/slice/auth.slice";
import { logout } from "@/service/auth.service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IUser } from "@/interface/user.interface";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { ADMIN_ROLE } from "@/components/auth/AdminGuard";

interface IProps {
  user: IUser;
}

const UserDropdown = ({ user }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const current = resolvedTheme ?? "dark";
    setTheme(current === "dark" ? "light" : "dark");
  };

  const fullName = useMemo(() => {
    if (!user) return "";
    return [user.firstName, user.lastName].filter(Boolean).join(" ");
  }, [user]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center gap-2 rounded-full border bg-card px-1 sm:px-2 py-1">
              <Avatar size="sm">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={fullName || user.email} />
                ) : (
                  <AvatarFallback>
                    {fullName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="hidden sm:flex flex-col pr-1">
                <span className="text-xs font-medium leading-tight">
                  {fullName || user.email}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          {user.role === ADMIN_ROLE ? (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onClick={toggleTheme}
            className="flex items-center justify-between"
          >
            Theme
            <span className="relative inline-flex h-4 w-4 shrink-0">
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="absolute inset-0 h-4 w-4 hidden dark:block" />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="opacity-50 cursor-not-allowed">
            <Link href="/pass" onClick={(e) => e.preventDefault()}>
              Forgot Password
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              logout();
              dispatch(clearAuth());
              router.replace("/");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
