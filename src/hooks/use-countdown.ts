import { useCallback, useEffect, useRef, useState } from "react";

type UseCountdownOptions = {
  /** Duration in milliseconds */
  duration: number;
  /** Whether the countdown is active */
  enabled?: boolean;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
};

type UseCountdownReturn = {
  /** Remaining time in seconds */
  secondsRemaining: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Reset the countdown */
  reset: () => void;
};

export function useCountdown({
  duration,
  enabled = true,
  onComplete,
}: UseCountdownOptions): UseCountdownReturn {
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.ceil(duration / 1000),
  );
  const startTimeRef = useRef<number>(Date.now());
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const reset = useCallback(() => {
    startTimeRef.current = Date.now();
    setSecondsRemaining(Math.ceil(duration / 1000));
  }, [duration]);

  useEffect(() => {
    if (!enabled) return;

    // Reset on enable
    startTimeRef.current = Date.now();
    setSecondsRemaining(Math.ceil(duration / 1000));

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));

      setSecondsRemaining(remaining);

      if (remaining === 0) {
        onCompleteRef.current?.();
        // Auto-reset for continuous countdown
        startTimeRef.current = Date.now();
        setSecondsRemaining(Math.ceil(duration / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, enabled]);

  const totalSeconds = Math.ceil(duration / 1000);
  const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  return {
    secondsRemaining,
    progress,
    reset,
  };
}
