// Analytics events. Plausible was removed; until the replacement is wired in, events are dropped.
// Call sites keep their place so no conversion tracking is lost in the switch.
export function track(event: string, props?: Record<string, string | number | boolean>) {
  void event;
  void props;
}
