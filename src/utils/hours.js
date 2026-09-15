const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function getOpeningStatus(hours, date = new Date()) {
  const todayName = DAYS[date.getDay()];
  const today = hours.find((h) => h.day === todayName);
  if (!today || today.closed) {
    return { isOpen: false, label: 'Closed today', today };
  }
  const now = date.getHours() * 60 + date.getMinutes();
  const open = parseTime(today.open);
  const close = parseTime(today.close);
  const isOpen = now >= open && now < close;
  return {
    isOpen,
    label: isOpen ? `Open now · until ${today.close}` : `Closed · opens ${today.open}`,
    today,
  };
}
