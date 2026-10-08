"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme store for useSyncExternalStore
let themeListeners: Array<() => void> = [];

const themeStore = {
  getSnapshot: (): boolean => {
    const savedTheme = localStorage.getItem("theme");
    // Default to dark theme if no preference is saved
    return savedTheme !== "light";
  },
  getServerSnapshot: (): boolean => {
    // Return consistent value for SSR - default to dark
    return true;
  },
  subscribe: (listener: () => void): (() => void) => {
    themeListeners.push(listener);
    return () => {
      themeListeners = themeListeners.filter((l) => l !== listener);
    };
  },
  emitChange: () => {
    themeListeners.forEach((listener) => listener());
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDark = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  // Sync dark class with DOM when isDark changes. The theme-color meta has to
  // follow too, otherwise iOS Safari keeps tinting its floating bottom bar with
  // the previous theme's background.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#100e0e" : "#ffffff");
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    const currentIsDark = themeStore.getSnapshot();
    const newIsDark = !currentIsDark;
    const root = document.documentElement;

    const applyTheme = () => {
      // Every `transition-colors` on the page would otherwise fire at once and
      // smear the swap. Disable transitions, flip the class, force a style
      // flush so the new colours commit while the override is in place, then
      // drop the override after the next paint.
      const freeze = document.createElement("style");
      freeze.append(
        document.createTextNode(
          "*,*::before,*::after{transition:none !important}"
        )
      );
      document.head.append(freeze);

      if (newIsDark) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      void document.body.offsetHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => freeze.remove());
      });

      themeStore.emitChange();
    };

    // Fallback for browsers without View Transition API
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    document.startViewTransition(applyTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Only export useTheme for the NavBar toggle button
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
