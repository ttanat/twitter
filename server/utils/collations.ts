interface ICollation {
  readonly locale: string
  readonly caseLevel?: boolean
  readonly caseFirst?: string
  readonly strength?: number
  readonly numericOrdering?: boolean
  readonly alternate?: string
  readonly maxVariable?: string
  readonly backwards?: boolean
}

interface ICaseInsensitiveCollation extends ICollation {
  readonly strength: number
}

// Case-insensitive
export const ci: ICaseInsensitiveCollation = { locale: "en", strength: 2 }
