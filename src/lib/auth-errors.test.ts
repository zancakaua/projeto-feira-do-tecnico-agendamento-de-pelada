import { describe, expect, it } from "vitest"
import { authErrorMessage } from "./auth-errors"

describe("authErrorMessage", () => {
  it("traduz credencial errada sem dizer qual campo errou", () => {
    expect(authErrorMessage("invalid_credentials")).toBe("E-mail ou senha não batem. Confere e tenta de novo.")
  })

  it("traduz e-mail já cadastrado", () => {
    expect(authErrorMessage("user_already_exists")).toBe("Já tem conta com esse e-mail. Tenta entrar.")
    expect(authErrorMessage("email_exists")).toBe("Já tem conta com esse e-mail. Tenta entrar.")
  })

  it("traduz e-mail não confirmado", () => {
    expect(authErrorMessage("email_not_confirmed")).toBe("Confirma seu e-mail pelo link que mandamos antes de entrar.")
  })

  it("traduz senha fraca e limite de tentativas", () => {
    expect(authErrorMessage("weak_password")).toBe("Senha fraca demais. Usa uma mais difícil de adivinhar.")
    expect(authErrorMessage("over_request_rate_limit")).toBe("Muitas tentativas seguidas. Espera um minuto e tenta de novo.")
  })

  it("tem mensagem genérica para o resto", () => {
    expect(authErrorMessage(undefined)).toBe("Deu ruim aqui do nosso lado. Tenta de novo em instantes.")
    expect(authErrorMessage("algo_novo")).toBe("Deu ruim aqui do nosso lado. Tenta de novo em instantes.")
  })
})
