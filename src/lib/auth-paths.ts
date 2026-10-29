const DEFAULT_RETURN = "/minhas-peladas"

const PROTECTED = [
  /^\/pelada\/nova\/?$/,
  /^\/pelada\/[^/]+\/(editar|gerenciar)\/?$/,
  /^\/minhas-peladas(\/|$)/,
  /^\/avisos(\/|$)/,
  /^\/perfil(\/|$)/,
]

export function isProtectedPath(pathname: string) {
  return PROTECTED.some((re) => re.test(pathname))
}

// Só aceita caminhos internos para o "volta" do login (evita redirect para outro site)
export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return DEFAULT_RETURN
  }
  return value
}
