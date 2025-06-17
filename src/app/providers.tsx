"use client";

import classes from "./theme.module.css";
import { Button, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({ classNames: classes }),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}
