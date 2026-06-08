const accountFooterLinks = [
  "Relações com investidores",
  "Media Center",
  "Carreiras",
  "Preferências de cookies",
  "Termos de Uso",
  "Declaração de Privacidade",
  "Áudio e legendas",
  "Central de Ajuda",
  "Cartão pré-pago"
];

export default function FooterAccount({ onAction }) {
  return (
    <footer className="account-footer">
      <p>
        Dúvidas? <button onClick={() => onAction?.("Contato aberto.")}>Entre em contato</button>
      </p>

      <div className="account-footer-links">
        {accountFooterLinks.map((link) => (
          <button key={link} onClick={() => onAction?.(`${link} aberto.`)}>{link}</button>
        ))}
      </div>
    </footer>
  );
}
