import { View } from "react-native";

interface Props {
  size?: number;
}

export function LogoMark({ size = 96 }: Props) {
  // proporções calculadas matematicamente para o N ficar correto
  const bw  = size * 0.13;   // espessura das barras
  const bh  = size * 0.56;   // altura das barras verticais
  const pad = size * 0.21;   // margem interna
  const cy  = size * 0.5;    // centro Y do container

  // pontos do N
  const x1 = pad + bw / 2;          // centro topo barra esquerda
  const y1 = cy - bh / 2;           // topo
  const x2 = size - pad - bw / 2;   // centro base barra direita
  const y2 = cy + bh / 2;           // base

  // diagonal: comprimento e ângulo exatos
  const dx   = x2 - x1;
  const dy   = y2 - y1;
  const diagW = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  // centro da diagonal
  const diagCX = (x1 + x2) / 2;
  const diagCY = (y1 + y2) / 2;

  const bar = {
    position: "absolute" as const,
    width: bw,
    height: bh,
    backgroundColor: "#fff",
    borderRadius: bw / 2,
    top: cy - bh / 2,
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        backgroundColor: "#0F172A",
        overflow: "hidden",
      }}
    >
      {/* reflexo de luz sutil no topo */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: size * 0.45,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />

      {/* barra esquerda */}
      <View style={{ ...bar, left: pad }} />

      {/* diagonal — posicionada pelo centro geométrico */}
      <View
        style={{
          position: "absolute",
          width: diagW,
          height: bw,
          backgroundColor: "#fff",
          borderRadius: bw / 2,
          top: diagCY - bw / 2,
          left: diagCX - diagW / 2,
          transform: [{ rotate: `${angle}deg` }],
        }}
      />

      {/* barra direita */}
      <View style={{ ...bar, right: pad }} />

      {/* ponto azul de marca no canto inferior direito */}
      <View
        style={{
          position: "absolute",
          width: bw * 0.75,
          height: bw * 0.75,
          borderRadius: bw,
          backgroundColor: "#1A6FE8",
          bottom: size * 0.17,
          right: size * 0.17,
        }}
      />
    </View>
  );
}
