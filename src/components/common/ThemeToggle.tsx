"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Button
        variant={"outline"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        size={"icon"}
        className="mt-2"
      >
        <Sun className="absolute w-10 h-10 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-10 h-10 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
