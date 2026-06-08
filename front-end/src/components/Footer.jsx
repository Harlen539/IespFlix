function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.1 8.18h-1.45c-.37 0-.77.47-.77 1.07v1.53h2.24l-.34 2.28h-1.9v6.64H9.51v-6.64H7.6v-2.28h1.91V9.32c0-2.01 1.31-3.47 3.16-3.47h1.43v2.33Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="16.5" height="16.5" x="3.75" y="3.75" rx="4.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.55" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.58" cy="7.42" r="1.05" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.48 10.43 20.32 4h-1.93l-5.25 5.78L9.49 4H4.35l6.03 9.52L4 20h1.94l5.82-6.4L15.83 20h5.12l-6.47-9.57Zm-2.04 2.25-.73-1.05-4.02-5.82h1.36l3.26 4.72.73 1.05 4.29 6.2h-1.36l-3.53-5.1Z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 7.58a2.42 2.42 0 0 0-1.7-1.71C17.6 5.47 12 5.47 12 5.47s-5.6 0-7.1.4A2.42 2.42 0 0 0 3.2 7.58 25.1 25.1 0 0 0 2.8 12c0 1.5.13 2.98.4 4.42a2.42 2.42 0 0 0 1.7 1.71c1.5.4 7.1.4 7.1.4s5.6 0 7.1-.4a2.42 2.42 0 0 0 1.7-1.71c.27-1.44.4-2.92.4-4.42s-.13-2.98-.4-4.42ZM10.1 15.05v-6.1L15.55 12l-5.45 3.05Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Facebook", icon: FacebookLogo },
  { label: "Instagram", icon: InstagramLogo },
  { label: "X", icon: XLogo },
  { label: "YouTube", icon: YouTubeLogo }
];

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
      <div className="socials" aria-label="Redes sociais">
        {socialLinks.map((social) => {
          const Icon = social.icon;

          return (
            <button key={social.label} type="button" aria-label={social.label}>
              <Icon />
            </button>
          );
        })}
      </div>

      <div className="footer-links">
        {links.map((link) => (
          <button key={link}>{link}</button>
        ))}
      </div>

      <p>© Iespflix-feita para fins de estudo</p>
    </footer>
  );
}
