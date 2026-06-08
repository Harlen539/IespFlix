import { HelpCircle, Pencil, User, UserRoundCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const defaultProfiles = [
  {
    id: "kaju",
    name: "Kaju",
    emoji: "K",
    color: "linear-gradient(135deg, #baf7ff, #65d38d)"
  },
  {
    id: "harlen",
    name: "Harlen",
    emoji: "H",
    color: "linear-gradient(135deg, #12343b, #2c7744)"
  },
  {
    id: "hailla",
    name: "Hailla",
    emoji: "HA",
    color: "linear-gradient(135deg, #7c3aed, #f97316)"
  }
];

export default function ProfileMenu({
  profiles = defaultProfiles,
  onClose,
  onGoTo,
  onLogout,
  onAction
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  function goTo(page) {
    onGoTo?.(page);
    onClose?.();
  }

  function runAction(message) {
    onAction?.(message);
    onClose?.();
  }

  function handleLogoutClick() {
    onLogout?.();
    onClose?.();
  }

  return (
    <div className="profile-menu" ref={menuRef} onPointerDown={(event) => event.stopPropagation()}>
      <div className="menu-arrow profile-arrow" />

      {profiles.map((profile) => (
        <button
          className="profile-menu-row"
          key={profile.id}
          onClick={() => runAction(`Perfil ${profile.name} selecionado.`)}
        >
          <span className="profile-avatar" style={{ background: profile.color }}>
            {profile.emoji}
          </span>
          <span>{profile.name}</span>
        </button>
      ))}

      <div className="profile-divider" />

      <button className="profile-action" onClick={() => goTo("profiles-settings")}>
        <Pencil size={19} />
        <span>Gerenciar perfis</span>
      </button>

      <button className="profile-action" onClick={() => runAction("Transferência de perfil iniciada.")}>
        <UserRoundCheck size={19} />
        <span>Transferir perfil</span>
      </button>

      <button className="profile-action" onClick={() => goTo("profiles-settings")}>
        <User size={19} />
        <span>Conta</span>
      </button>

      <button className="profile-action" onClick={() => runAction("Central de Ajuda aberta.")}>
        <HelpCircle size={19} />
        <span>Central de Ajuda</span>
      </button>

      <div className="profile-divider" />

      <button className="logout-btn" onClick={handleLogoutClick}>Sair da Iespflix</button>
    </div>
  );
}
