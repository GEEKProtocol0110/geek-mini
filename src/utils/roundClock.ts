// Timers can be delayed in background tabs. Measure elapsed time independently
// of callback counts, using both clocks so a backwards wall-clock change cannot
// give extra time and system sleep still counts where performance.now pauses.
export function createRoundClock(
  durationMs: number,
  wallNow = Date.now,
  monotonicNow = () => performance.now(),
) {
  const wallStart = wallNow(), monotonicStart = monotonicNow();
  let elapsed = 0;
  const remainingMs = () => {
    elapsed = Math.max(elapsed, wallNow() - wallStart, monotonicNow() - monotonicStart);
    return Math.max(0, durationMs - elapsed);
  };
  return {
    secondsLeft: () => Math.ceil(remainingMs() / 1000),
    expired: () => remainingMs() === 0,
  };
}
