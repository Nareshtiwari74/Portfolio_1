"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { useResizeObserver } from "@wojtekmaj/react-hooks";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import posthog from "posthog-js";

const Document = dynamic(() => import("react-pdf").then((m) => m.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((m) => m.Page), {
  ssr: false,
});

interface PdfViewerProps {
  file: string;
  downloadHref?: string;
  filename?: string;
}

export function PdfViewer({ file, downloadHref, filename }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [docKey, setDocKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workerReady, setWorkerReady] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      setWorkerReady(true);
    });
  }, []);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const entry = entries[0];
    if (entry) setContainerWidth(entry.contentRect.width);
  }, []);

  useResizeObserver(containerRef, {}, onResize);

  const reload = () => {
    setCurrentPage(1);
    setNumPages(null);
    setLoading(true);
    setDocKey((k) => k + 1);
  };

  const href = downloadHref ?? file;
  const pageWidth = containerWidth > 0 ? Math.min(containerWidth, 860) : null;

  return (
    <div className="border-content-subtle/20 flex flex-col overflow-hidden rounded-lg border">
      {/* Toolbar */}
      <div className="border-content-subtle/15 bg-surface-raised flex items-center gap-2 border-b px-4 py-2.5">
        {/* Filename */}
        <span className="text-content-subtle min-w-0 flex-1 truncate font-mono text-[11px]">
          {filename ?? file.split("/").pop()}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          {/* Pagination */}
          {numPages && numPages > 1 && (
            <div className="mr-2 flex items-center gap-1">
              <IconBtn
                label="Previous page"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={14} />
              </IconBtn>
              <span className="text-content-muted px-1 font-mono text-xs tabular-nums">
                {currentPage}/{numPages}
              </span>
              <IconBtn
                label="Next page"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, numPages))
                }
                disabled={currentPage >= numPages}
              >
                <ChevronRight size={14} />
              </IconBtn>
            </div>
          )}

          {/* Zoom */}
          <IconBtn
            label="Zoom out"
            onClick={() => setZoom(Math.max(+(zoom - 0.1).toFixed(1), 0.5))}
          >
            <ZoomOut size={14} />
          </IconBtn>
          <span className="text-content-muted w-10 text-center font-mono text-xs tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <IconBtn
            label="Zoom in"
            onClick={() => setZoom(Math.min(+(zoom + 0.1).toFixed(1), 3))}
          >
            <ZoomIn size={14} />
          </IconBtn>

          <div className="bg-content-subtle/20 mx-1 h-4 w-px" />

          <IconBtn label="Reload" onClick={reload}>
            <RotateCcw size={14} />
          </IconBtn>
          <IconBtn label="Open in new tab" asLink href={file} target="_blank">
            <ExternalLink size={14} />
          </IconBtn>

          {/* Download button */}
          <a
            href={href}
            download={filename ?? true}
            aria-label="Download PDF"
            onClick={() =>
              posthog.capture("resume_downloaded", {
                filename: filename ?? file,
              })
            }
            className="bg-brand text-brand-content ml-1 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.96] sm:ps-2.5"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* PDF canvas */}
      <div
        ref={setContainerRef}
        className="bg-content-subtle/5 relative flex-1 overflow-auto"
        style={{ minHeight: "80vh" }}
      >
        {workerReady && pageWidth ? (
          <Document
            key={docKey}
            file={file}
            loading={null}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
            }}
            onLoadError={() => setLoading(false)}
            className="flex flex-col items-center gap-4 py-6"
          >
            {Array.from({ length: numPages ?? 0 }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={pageWidth - 32}
                scale={zoom}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            ))}
          </Document>
        ) : null}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-content-subtle animate-pulse font-mono text-xs">
              Loading…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
  asLink,
  href,
  target,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  asLink?: boolean;
  href?: string;
  target?: string;
}) {
  const base =
    "flex items-center justify-center w-7 h-7 rounded text-content-muted hover:text-content hover:bg-content-subtle/10 transition-[color,background-color,scale] duration-150 ease-out active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none";

  if (asLink) {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        aria-label={label}
        className={base}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={base}
    >
      {children}
    </button>
  );
}
