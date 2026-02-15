import React from "react";
import { OfflineModeProvider } from "../contexts/OfflineModeContext";

export default function Root({ children }: { children: React.ReactNode }) {
  return <OfflineModeProvider>{children}</OfflineModeProvider>;
}
