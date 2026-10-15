import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Tool, TOOLS } from './core/shared/models/tool';
import { ToolOrderService } from './core/shared/services/tool-order.service';

/** Human-sized byte count ("482 B" / "3.1 KB" / "1.24 MB"), picking whichever unit keeps the
 *  number readable rather than always showing the same unit regardless of magnitude. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'sap-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly toolOrder = inject(ToolOrderService);

  readonly currentYear = new Date().getFullYear();

  readonly tools = this.toolOrder.orderedTools;
  readonly storableTools = computed(() =>
    this.toolOrder.orderedTools().filter((tool) => (tool.storageKeys?.length ?? 0) > 0),
  );

  readonly dragOverToolId = signal<string | null>(null);
  private dragToolId: string | null = null;

  onDragStart(event: DragEvent, id: string): void {
    this.dragToolId = id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', id);
    }
  }

  onDragOver(event: DragEvent, id: string): void {
    event.preventDefault();
    if (this.dragToolId && this.dragToolId !== id) {
      this.dragOverToolId.set(id);
    }
  }

  onDrop(event: DragEvent, targetId: string): void {
    event.preventDefault();
    const source = this.dragToolId;
    this.dragOverToolId.set(null);
    if (source) {
      this.toolOrder.reorder(source, targetId);
    }
    this.dragToolId = null;
  }

  onDragEnd(): void {
    this.dragToolId = null;
    this.dragOverToolId.set(null);
  }

  // The quick-link tab bar duplicates the dashboard's own tile grid, so it's hidden there.
  readonly isDashboardRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects === '/'),
    ),
    { initialValue: this.router.url === '/' },
  );

  private readonly settingsDialog = viewChild.required<ElementRef<HTMLDialogElement>>('settingsDialog');
  readonly selectedToolIds = signal<ReadonlySet<string>>(new Set());
  readonly clearedMessage = signal<string | null>(null);
  private clearedMessageTimer?: ReturnType<typeof setTimeout>;

  openSettings(): void {
    this.settingsDialog().nativeElement.showModal();
  }

  closeSettings(): void {
    this.settingsDialog().nativeElement.close();
  }

  /** Fires for every close path (✕, Escape/cancel, backdrop click) — native `<dialog>` handles
   *  all three on its own, this just resets the panel's transient state afterward. */
  onSettingsDialogClosed(): void {
    this.selectedToolIds.set(new Set());
    this.clearedMessage.set(null);
  }

  /** A click lands on the `<dialog>` element itself (not something inside it) only when it's
   *  outside the rendered panel content — the standard native-`<dialog>` backdrop-click recipe. */
  onDialogBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeSettings();
    }
  }

  /** Live size of whatever this tool currently has saved, for display in the settings panel —
   *  reads straight from localStorage each call rather than caching, so it stays accurate across
   *  dialog opens and after a clear (both of which re-run change detection on this view anyway,
   *  since they're triggered by template-bound event handlers). */
  sizeFor(tool: Tool): string {
    const bytes = (tool.storageKeys ?? []).reduce((total, key) => {
      const value = localStorage.getItem(key);
      return total + (value ? new Blob([value]).size : 0);
    }, 0);
    return formatBytes(bytes);
  }

  toggleToolSelection(id: string): void {
    this.selectedToolIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  clearSelectedToolsCache(): void {
    const selected = this.storableTools().filter((tool) => this.selectedToolIds().has(tool.id));
    if (selected.length === 0) {
      return;
    }
    for (const tool of selected) {
      for (const key of tool.storageKeys ?? []) {
        localStorage.removeItem(key);
      }
    }
    this.clearedMessage.set(
      selected.length === 1 ? `Cleared ${selected[0].title}.` : `Cleared ${selected.length} tools.`,
    );
    clearTimeout(this.clearedMessageTimer);
    this.clearedMessageTimer = setTimeout(() => this.clearedMessage.set(null), 3000);

    // The now-open page for a cleared tool already has its old selection in memory (each page
    // only reads storage once, at construction) — reload so it re-reads the now-empty key and
    // falls back to its defaults, same as if the user opened it fresh.
    const needsReload = selected.some((tool) => this.router.url.startsWith(tool.route));
    this.selectedToolIds.set(new Set());
    if (needsReload) {
      window.location.reload();
    }
  }
}
