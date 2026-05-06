// PSYConnect - Analytics & Event Tracking
// Registra eventos internos en BD. PostHog/GA4 se integra cuando haya claves.

import { prisma } from "./db";

export type EventName =
  | "landing_view"
  | "cta_start_click"
  | "pre_funnel_view"
  | "funnel_started"
  | "question_answered"
  | "crisis_protocol_triggered"
  | "minor_flow_triggered"
  | "funnel_completed"
  | "patient_created"
  | "patient_status_updated"
  | "matching_created"
  | "recommendation_sent"
  | "first_session_booked"
  | "first_session_completed"
  | "second_session_booked"
  | "second_session_completed"
  | "rematch_requested";

interface TrackEventOptions {
  patientId?: string;
  matchingId?: string;
  metadata?: Record<string, unknown>;
}

// Track event to internal DB
export async function trackEvent(
  eventName: EventName,
  options: TrackEventOptions = {}
): Promise<void> {
  try {
    await prisma.metricEvent.create({
      data: {
        eventName,
        patientId: options.patientId,
        matchingId: options.matchingId,
        metadata: options.metadata ? JSON.parse(JSON.stringify(options.metadata)) : undefined,
      },
    });
  } catch (error) {
    // Non-blocking: log but don't throw
    console.error("[analytics] Failed to track event:", eventName, error);
  }
}

// Client-side event tracking (PostHog/GA4 placeholder)
export function trackClientEvent(
  eventName: EventName,
  properties?: Record<string, unknown>
): void {
  // PostHog integration (activate when NEXT_PUBLIC_POSTHOG_KEY is set)
  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties);
  }

  // GA4 integration (activate when NEXT_PUBLIC_GA_ID is set)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, properties);
  }

  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", eventName, properties);
  }
}
