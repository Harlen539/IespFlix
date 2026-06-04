export default function Footer() {
  const links = [
    "Audiodescrição",
    "Central de Ajuda",
    "Cartão pré-pago",
    "Imprensa",
    "Relações com investidores",
    "Carreiras",
    "Termos de Uso",
    "Privacidade",
    "Avisos legais",
    "Preferências de cookies",
    "Informações corporativas",
    "Entre em contato"
  ];

  return (
    <footer className="footer">
      <div className="socials">
        <span>f</span>
        <span>◎</span>
        <span>𝕏</span>
        <span>▶</span>
      </div>

      <div className="footer-links">
        {links.map((link) => (
          <button key={link}>{link}</button>
        ))}
      </div>

      <p>© 1997-2026 Iespflix, Inc.</p>
    </footer>
  );
}
