import { HelpCircle, Pencil, User } from "lucide-react";

export default function ProfileMenu({ profiles = [] }) {
  return (
    <div className="profile-menu">
      <div className="menu-arrow profile-arrow" />

      {profiles.map((profile) => (
        <button className="profile-menu-row" key={profile.id}>
          <span className="profile-avatar" style={{ background: profile.color }}>
            {profile.emoji}
          </span>
          <span>{profile.name}</span>
        </button>
      ))}

      <div className="profile-divider" />

      <button className="profile-action">
        <Pencil size={19} />
        <span>Gerenciar perfis</span>
      </button>

      <button className="profile-action">
        <span className="transfer-icon">▣</span>
        <span>Transferir perfil</span>
      </button>

      <button className="profile-action">
        <User size={19} />
        <span>Conta</span>
      </button>

      <button className="profile-action">
        <HelpCircle size={19} />
        <span>Central de Ajuda</span>
      </button>

      <div className="profile-divider" />

      <button className="logout-btn">Sair da Iespflix</button>
    </div>
  );
}
