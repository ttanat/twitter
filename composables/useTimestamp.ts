const months: ReadonlyArray<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const useTimestamp = (timestring: string) => {
  const givenTime: Date = new Date(timestring)
  const s: number = (new Date().getTime() - givenTime.getTime()) / 1000
  // seconds ago
  const min = s / 60
  if (min < 1) return `${Math.round(s)}s`
  // minutes ago
  const hrs = min / 60
  if (hrs < 1) return `${Math.round(min)}m`
  // hours ago
  const days = hrs / 24
  if (days < 1) return `${Math.round(hrs)}h`
  // days ago
  const wks = days / 7
  if (wks < 1) return `${Math.round(days)}d`
  // weeks ago
  const mnths = days / 28
  if (mnths < 1) return `${Math.round(wks)}w`
  // 28 days or older
  return `${months[givenTime.getMonth()]} ${givenTime.getDate()} ${givenTime.getFullYear()}`
}
