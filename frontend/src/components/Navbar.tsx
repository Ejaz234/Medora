import {
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

import {
  Show,
  UserButton,
} from "@clerk/react";

import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800/70 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400">
            <span className="text-sm font-bold text-zinc-950">
              M
            </span>
          </div>

          <div className="text-left">
            <span className="block text-sm font-semibold tracking-tight text-zinc-100">
              MEDORA
            </span>

            <span className="hidden text-[9px] uppercase tracking-[0.2em] text-zinc-600 sm:block">
              Medical intelligence
            </span>
          </div>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2">
         <Show when="signed-out">
            {/* Sign in */}
            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100 sm:flex"
            >
              <LogIn size={14} />

              Sign in
            </button>

            {/* Get started */}
            <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className="group flex items-center gap-2 rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-teal-300"
            >
              <UserPlus size={14} />

              Get started

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </Show>

          <Show when="signed-in">
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="hidden rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100 sm:block"
            >
              Dashboard
            </button>

            {/* Clerk account */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;