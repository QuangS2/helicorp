import { TelemetryEvent } from '../types';

const telemetryLogs: TelemetryEvent[] = [];
let scrollMilestonesReached = new Set<number>();

export function logTelemetryEvent(
  type: TelemetryEvent['type'],
  target: string,
  metadata?: Record<string, unknown>
): void {
  const event: TelemetryEvent = {
    id: `tlm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    target,
    metadata,
    timestamp: new Date().toLocaleTimeString(),
  };

  telemetryLogs.unshift(event);
  if (telemetryLogs.length > 50) {
    telemetryLogs.pop();
  }

  // Update HUD Console UI if open or present
  renderHudLogEntry(event);

  // Send to backend telemetry API asynchronously (fire & forget)
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', JSON.stringify(event));
    } else {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(() => {
        // Silently swallow analytics error
      });
    }
  } catch {
    // Offline resilient
  }
}

function renderHudLogEntry(event: TelemetryEvent): void {
  const stream = document.getElementById('hudLogStream');
  if (!stream) return;

  const entry = document.createElement('div');
  entry.className = `hud-log-entry event-${event.type}`;
  entry.innerHTML = `
    <span style="color: var(--text-muted);">[${event.timestamp}]</span>
    <strong style="color: var(--accent-cyan); text-transform: uppercase;">${event.type}</strong>
    <span style="word-break: break-all;">${event.target}</span>
  `;

  stream.insertBefore(entry, stream.firstChild);

  // Keep log length manageable
  while (stream.children.length > 30) {
    stream.removeChild(stream.lastChild!);
  }
}

export function initTelemetry(): void {
  // 1. Click Tracking
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const clickable = target.closest('button, a, input[type="submit"], [role="button"]');
    if (clickable) {
      const label = clickable.getAttribute('aria-label') || clickable.textContent?.trim().substring(0, 35) || clickable.id || 'Unknown Element';
      logTelemetryEvent('click', label);
    }
  });

  // 2. Scroll Depth Tracking
  window.addEventListener(
    'scroll',
    () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercentage = Math.round((window.scrollY / scrollHeight) * 100);

      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercentage >= milestone && !scrollMilestonesReached.has(milestone)) {
          scrollMilestonesReached.add(milestone);
          logTelemetryEvent('scroll', `Reached ${milestone}% Page Depth`, { depth: milestone });
        }
      });
    },
    { passive: true }
  );

  // 3. HUD Console Toggle
  const hudBtn = document.getElementById('hudTriggerBtn');
  const hudDrawer = document.getElementById('hudConsoleDrawer');
  const closeHudBtn = document.getElementById('closeHudConsoleBtn');

  if (hudBtn && hudDrawer) {
    hudBtn.addEventListener('click', () => {
      hudDrawer.classList.toggle('is-open');
      logTelemetryEvent('click', 'Toggled Avionics HUD Drawer');
    });
  }

  if (closeHudBtn && hudDrawer) {
    closeHudBtn.addEventListener('click', () => {
      hudDrawer.classList.remove('is-open');
    });
  }
}
