import { Column } from "@once-ui-system/core";

export default function Gallery() {
  return (
    <Column
      fillWidth
      style={{
        height: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 760 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <img
            src="/images/ICON_MANUTENCAO2.png"
            alt="Maintenance icon"
            className="maintenance-icon"
            style={{ width: 72, height: 72, objectFit: "contain" }}
          />
        </div>
        <p
          style={{
            fontSize: 15,
            margin: 0,
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          Soon I will share here books, studies and learning that I recommend throughout my life.
        </p>
        <p
          style={{
            fontSize: 15,
            margin: "6px 0 0",
            color: "#2ecc71",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Page under construction.
        </p>
      </div>
    </Column>
  );
}
