const MESSAGES: Record<string, string> = {
  invalid_credentials: "E-mail ou senha não batem. Confere e tenta de novo.",
  user_already_exists: "Já tem conta com esse e-mail. Tenta entrar.",
  email_exists: "Já tem conta com esse e-mail. Tenta entrar.",
  email_not_confirmed: "Confirma seu e-mail pelo link que mandamos antes de entrar.",
  weak_password: "Senha fraca demais. Usa uma mais difícil de adivinhar.",
  over_request_rate_limit: "Muitas tentativas seguidas. Espera um minuto e tenta de novo.",
  over_email_send_rate_limit: "Nosso envio de e-mails bateu o limite agora. Tenta de novo mais tarde.",
  same_password: "A senha nova precisa ser diferente da antiga.",
}

export function authErrorMessage(code: string | undefined) {
  return (code && MESSAGES[code]) || "Deu ruim aqui do nosso lado. Tenta de novo em instantes."
}
