import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-11 h-6" />; // Placeholder to prevent layout shift
  }

  const isDark = theme === "dark";

  return (
    <div className="relative inline-flex">
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
        className="h-6 w-11"
      />
      <Sun
        className={`pointer-events-none absolute left-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-all duration-200 ${
          isDark ? "opacity-0 scale-75" : "opacity-100 scale-100 text-foreground"
        }`}
      />
      <Moon
        className={`pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-all duration-200 ${
          isDark ? "opacity-100 scale-100 text-foreground" : "opacity-0 scale-75"
        }`}
      />
    </div>
  );
}
