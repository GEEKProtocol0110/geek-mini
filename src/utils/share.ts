export async function shareChallenge(mode: "daily" | "speed"): Promise<"shared" | "copied" | "failed"> {
  const url = `${window.location.origin}/${mode}`;
  const title = `Geek Mini · ${mode === "daily" ? "Daily Challenge" : "Speed Round"}`;
  const text = "Try a quick Kaspa knowledge round with Geek Mini by Geek Protocol.";
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "failed";
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
