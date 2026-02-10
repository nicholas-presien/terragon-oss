// Feedback dialog stub for self-hosted mode.
// Feedback system is not available in self-hosted deployments.

"use client";

/**
 * Stub component for feedback dialog.
 * No-op in self-hosted mode as feedback system is disabled.
 */
export function FeedbackDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // No-op for self-hosted - feedback system not used
  return null;
}
