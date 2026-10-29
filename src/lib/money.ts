// "20", "20,00", "R$ 15,50", "1.200,00" -> centavos. Vazio = grátis. Inválido = null.
export function parseBRL(input: string): number | null {
  let s = input.replace(/R\$/i, "").replace(/\s/g, "")
  if (!s) return 0
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".")
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null
  return Math.round(Number(s) * 100)
}

export function formatPrice(cents: number) {
  if (cents === 0) return "Grátis"
  const reais = Math.floor(cents / 100)
  const rest = cents % 100
  return rest === 0 ? `R$ ${reais}` : `R$ ${reais},${String(rest).padStart(2, "0")}`
}

// Valor para preencher o campo do formulário (20,00 -> "20" / 15,50 -> "15,50")
export function priceInput(cents: number) {
  if (cents === 0) return ""
  return formatPrice(cents).replace("R$ ", "")
}
