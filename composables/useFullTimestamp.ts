const months: ReadonlyArray<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const useFullTimestamp = (timestring: string) => {
  const t: Date = new Date(timestring)
  const localeTime: string = t.toLocaleTimeString()
  const match: RegExpMatchArray = localeTime.match(/(\d{1,2}:\d{2}):\d{2}( (?:A|P)M)/)!
  return `${match[1]}${match[2]} ${months[t.getMonth()]} ${t.getDate()} ${t.getFullYear()}`
}
