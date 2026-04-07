import React, { useEffect } from "react";
import { OfflineModeProvider } from "../contexts/OfflineModeContext";

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) {
        return;
      }

      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLElement && active.isContentEditable)
      ) {
        return;
      }

      if (e.key !== "[") {
        return;
      }

      const sidebarToggleButton = document.querySelector<HTMLButtonElement>(
        'button[class*="collapseSidebarButton"], button[aria-label="Collapse sidebar"], button[aria-label="Expand sidebar"]',
      );

      if (!sidebarToggleButton || sidebarToggleButton.offsetParent === null) {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();
      sidebarToggleButton.click();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <OfflineModeProvider>{children}</OfflineModeProvider>;
}
