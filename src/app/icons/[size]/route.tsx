import { ImageResponse } from "next/og"

// Ícone do app: "R" de súmula em papel sobre preto, com o ponto vermelho do carimbo
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params
  const px = size === "512" ? 512 : size === "180" ? 180 : 192
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f3f3ef",
          fontSize: px * 0.62,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        R<span style={{ color: "#b3161b" }}>.</span>
      </div>
    ),
    { width: px, height: px },
  )
}
