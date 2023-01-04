const months: ReadonlyArray<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const useDate = (timestring: string) => {
  const t: Date = new Date(timestring)
  return `${months[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`
}
