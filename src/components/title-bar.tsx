import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { cn } from "cn";
import { useEffect, useRef, useState } from "react";

const WINDOW_TITLE = "Tauri + React + shadcn/ui";

const captionButtonClassName =
  "caption-button inline-flex size-[32px] w-[46px] shrink-0 items-center justify-center";

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in globalThis;
}

function CaptionMinimizeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
      <rect width="10" height="1" x="1" y="5.5" fill="currentColor" />
    </svg>
  );
}

function CaptionMaximizeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
      <rect
        width="9"
        height="9"
        x="1.5"
        y="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function CaptionRestoreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        d="M3.5 3.5V1.5h7v7H8.5"
      />
      <rect
        x="1.5"
        y="3.5"
        width="7"
        height="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function CaptionCloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.1"
        d="M2.5 2.5l7 7m0-7l-7 7"
      />
    </svg>
  );
}

const DOUBLE_CLICK_MS = 500;

export function TitleBar() {
  const [maximized, setMaximized] = useState(false);
  const [snapHover, setSnapHover] = useState(false);
  const lastTitleClickAt = useRef(0);

  useEffect(() => {
    if (!isTauriRuntime()) {
      return;
    }

    const appWindow = getCurrentWindow();
    let disposed = false;
    let unlistenResize: (() => void) | undefined;
    let unlistenHover: (() => void) | undefined;

    void (async () => {
      const nextMaximized = await appWindow.isMaximized();
      if (!disposed) {
        setMaximized(nextMaximized);
      }
      unlistenResize = await appWindow.onResized(async () => {
        setMaximized(await appWindow.isMaximized());
      });
      unlistenHover = await listen<boolean>("snap-layout-hover", (event) => {
        setSnapHover(event.payload);
      });
    })();

    return () => {
      disposed = true;
      unlistenResize?.();
      unlistenHover?.();
    };
  }, []);

  function minimize() {
    if (isTauriRuntime()) {
      void getCurrentWindow().minimize();
    }
  }

  function toggleMaximize() {
    if (isTauriRuntime()) {
      void getCurrentWindow().toggleMaximize();
    }
  }

  function close() {
    if (isTauriRuntime()) {
      void getCurrentWindow().close();
    }
  }

  function onTitlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!isTauriRuntime() || event.button !== 0) {
      return;
    }

    event.preventDefault();

    const now = Date.now();
    const previousClickAt = lastTitleClickAt.current;
    lastTitleClickAt.current = now;

    if (now - previousClickAt < DOUBLE_CLICK_MS) {
      lastTitleClickAt.current = 0;
      toggleMaximize();
      return;
    }

    const originX = event.clientX;
    const originY = event.clientY;

    function onMove(moveEvent: PointerEvent) {
      if (
        Math.abs(moveEvent.clientX - originX) < 4 &&
        Math.abs(moveEvent.clientY - originY) < 4
      ) {
        return;
      }
      cleanup();
      void getCurrentWindow().startDragging();
    }

    function onUp() {
      cleanup();
    }

    function cleanup() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <header className="flex h-8 shrink-0 select-none items-center overflow-hidden text-foreground">
      <div
        className="flex h-full min-w-0 flex-1 items-center gap-2 px-3"
        onPointerDown={onTitlePointerDown}
      >
        <img src="/tauri.svg" alt="" className="pointer-events-none size-4" />
        <span className="pointer-events-none truncate text-xs text-foreground">
          {WINDOW_TITLE}
        </span>
      </div>
      <div className="flex h-8 overflow-hidden">
        <button
          type="button"
          className={cn(captionButtonClassName, "hover:bg-accent")}
          aria-label="Minimize"
          onClick={minimize}
        >
          <CaptionMinimizeIcon />
        </button>
        <button
          type="button"
          className={cn(
            captionButtonClassName,
            "hover:bg-accent",
            snapHover && "bg-accent",
          )}
          aria-label={maximized ? "Restore" : "Maximize"}
          onClick={toggleMaximize}
        >
          {maximized ? <CaptionRestoreIcon /> : <CaptionMaximizeIcon />}
        </button>
        <button
          type="button"
          className={cn(
            captionButtonClassName,
            "caption-button-close hover:bg-caption-close hover:text-white",
          )}
          aria-label="Close"
          onClick={close}
        >
          <CaptionCloseIcon />
        </button>
      </div>
    </header>
  );
}
