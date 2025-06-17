"use client";

import { useEffect } from "react";
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

const STORAGE_KEY = "mantine-color-scheme";

export default function ThemeToggleButton() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light") {
        setColorScheme(stored);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = () => {
    const next = computedColorScheme === "light" ? "dark" : "light";
    setColorScheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
      <ActionIcon
        onClick={handleToggle}
        variant="default"
        size="xl"
        aria-label="Tema değiştir"
      >
        {computedColorScheme === "dark" ? (
          <IconSun stroke={1.5} />
        ) : (
          <IconMoon stroke={1.5} />
        )}
      </ActionIcon>
    </div>
  );
}
