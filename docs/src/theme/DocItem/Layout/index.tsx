import React, { type ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { useWindowSize } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DocItemPaginator from "@theme/DocItem/Paginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocItemFooter from "@theme/DocItem/Footer";
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile";
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop";
import DocItemContent from "@theme/DocItem/Content";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import ContentVisibility from "@theme/ContentVisibility";
import type { Props } from "@theme/DocItem/Layout";

import styles from "./styles.module.css";

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && (windowSize === "desktop" || windowSize === "ssr") ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {
    hidden,
    canRender,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({ children }: Props): ReactNode {
  const docTOC = useDocTOC();
  const { metadata } = useDoc();
  const [isTocOpen, setIsTocOpen] = useState(true);

  useEffect(() => {
    if (!docTOC.canRender) {
      return;
    }

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

      if (e.key === "]") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setIsTocOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [docTOC.canRender]);

  const showDesktopToc = Boolean(docTOC.desktop) && isTocOpen;
  const showToggleButton = docTOC.canRender;
  const toggleLabel = isTocOpen ? "目次を閉じる ]" : "目次を開く ]";

  return (
    <>
      <div className="row">
        <div className={clsx("col", showDesktopToc && styles.docItemCol)}>
          <ContentVisibility metadata={metadata} />
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article>
              <DocBreadcrumbs />
              <DocVersionBadge />
              {docTOC.mobile}
              <DocItemContent>{children}</DocItemContent>
              <DocItemFooter />
            </article>
            <DocItemPaginator />
          </div>
        </div>
        {showDesktopToc && <div className="col col--3">{docTOC.desktop}</div>}
      </div>

      {showToggleButton && (
        <div className="toc-toggle-button-wrapper" aria-hidden={false}>
          <Tooltip title={toggleLabel} placement="left">
            <IconButton
              onClick={() => setIsTocOpen((prev) => !prev)}
              aria-label={toggleLabel}
              size="small"
              className="toc-toggle-button"
            >
              {isTocOpen ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
}
