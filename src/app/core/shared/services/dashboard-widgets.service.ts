import { Injectable, computed, effect, signal } from '@angular/core';
import { DASHBOARD_WIDGETS_STORAGE_KEY as STORAGE_KEY } from '../storage-keys';

/** Reads the last-saved widget id list back from localStorage. Never throws. */
function loadStoredWidgetIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

/** Persists the widget id list. Storage failures (e.g. private browsing quota) are
 *  non-critical, so they're swallowed rather than surfaced. */
function saveStoredWidgetIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore - persistence is a nice-to-have, not required for the app to function.
  }
}

/**
 * Which tools the user has pinned to the dashboard as live widgets, and in what order — a
 * genuine add/remove-able subset, unlike `ToolOrderService`'s "reorder the fixed catalog" shape
 * (that one always contains every tool, just possibly reordered; this one starts empty and only
 * ever contains ids the user explicitly added, so there's no "missing tools" reconciliation to
 * do — whatever's in the list IS the list).
 */
@Injectable({ providedIn: 'root' })
export class DashboardWidgetsService {
  private readonly widgetIds = signal<string[]>(loadStoredWidgetIds());
  readonly ids = this.widgetIds.asReadonly();

  private readonly idSet = computed(() => new Set(this.widgetIds()));

  constructor() {
    effect(() => saveStoredWidgetIds(this.widgetIds()));
  }

  isWidget(id: string): boolean {
    return this.idSet().has(id);
  }

  /** Newly-added widgets go to the END of the list (most recently pinned shows last). */
  toggle(id: string): void {
    if (this.idSet().has(id)) {
      this.remove(id);
    } else {
      this.widgetIds.update((ids) => [...ids, id]);
    }
  }

  remove(id: string): void {
    this.widgetIds.update((ids) => ids.filter((existing) => existing !== id));
  }

  reorder(sourceId: string, targetId: string): void {
    if (sourceId === targetId) {
      return;
    }
    const current = this.widgetIds();
    const withoutSource = current.filter((id) => id !== sourceId);
    const targetIndex = withoutSource.indexOf(targetId);
    if (targetIndex === -1) {
      return;
    }
    withoutSource.splice(targetIndex, 0, sourceId);
    this.widgetIds.set(withoutSource);
  }
}
