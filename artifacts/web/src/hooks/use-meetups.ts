// Wrapper to satisfy file generation requirements while using the workspace hooks
import { useListMeetups, useCreateRsvp } from "@workspace/api-client-react";

export function useMeetups() {
  return useListMeetups();
}

export function useRsvp() {
  return useCreateRsvp();
}
