import { Injectable, computed, effect, signal } from '@angular/core';
import { Tool, TOOLS } from '../models/tool';
import { TOOL_ORDER_STORAGE_KEY as STORAGE_KEY } from '../storage-keys';

/** Reads the last-saved custom tool order back from localStorage. Never throws. */
function loadStoredOrder(): string[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Persists the custom tool order. Storage failures (e.g. private browsing quota) are
 *  non-critical, so they're swallowed rather than surfaced. */
function saveStoredOrder(order: string[] | null): void {
  try {
    if (order) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore - persistence is a nice-to-have, not required for the app to function.
  }
}

/**
 * Shared, persisted tool order. Both the dashboard tile grid and the navbar's quick-link tab
 * bar render from `orderedTools()` — dragging a reorder in either place updates both at once
 * (same underlying signal) and survives reloads. Same "custom order + reconcile against the
 * current list" shape as World Clock's zones / Exchange Rates' currencies elsewhere in this
 * app, just applied to the fixed `TOOLS` list instead of a user-editable one (so there's no
 * add/remove here, only reordering).
 */
@Injectable({ providedIn: 'root' })
export class ToolOrderService {
  private readonly customOrder = signal<string[] | null>(loadStoredOrder());

  readonly orderedTools = computed<Tool[]>(() => {
    const custom = this.customOrder();
    if (!custom) {
      return TOOLS;
    }
    const byId = new Map(TOOLS.map((tool) => [tool.id, tool]));
    const kept = custom.map((id) => byId.get(id)).filter((tool): tool is Tool => !!tool);
    const missing = TOOLS.filter((tool) => !custom.includes(tool.id));
    return [...kept, ...missing];
  });

  constructor() {
    effect(() => saveStoredOrder(this.customOrder()));
  }

  reorder(sourceId: string, targetId: string): void {
    if (sourceId === targetId) {
      return;
    }
    const current = this.orderedTools().map((tool) => tool.id);
    const withoutSource = current.filter((id) => id !== sourceId);
    const targetIndex = withoutSource.indexOf(targetId);
    withoutSource.splice(targetIndex, 0, sourceId);
    this.customOrder.set(withoutSource);
  }
}
