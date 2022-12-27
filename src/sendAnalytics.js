export function sendAnalytics(eventName, data = {}) {
  try {
    window.gtag("event", eventName, data);
  } catch (error) {
    console.log("tracking error", error);
  }
}
