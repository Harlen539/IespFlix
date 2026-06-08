import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  LogOut,
  Pencil,
  User,
  Users
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function AccountDropdown({ onClose, onGoTo, onLogout, onAction }) {
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

  function navigate(page) {
    onGoTo?.(page);
    onClose?.();
  }

  function handleLogoutClick() {
    onLogout?.();
    onClose?.();
  }

  function openTopic(topic) {
    onAction?.(topic);
    onClose?.();
  }

  return (
    <div className="account-dropdown" ref={menuRef} onPointerDown={(event) => event.stopPropagation()}>
      <button className="account-dropdown-item account-dropdown-primary" onClick={() => navigate("home")}>
        <ArrowLeft size={20} />
        <span>Voltar à IESPFLIX</span>
      </button>

      <button className="account-dropdown-item" onClick={() => openTopic({ id: "overview", title: "Conta" })}>
        <User size={20} />
        <span>Conta</span>
      </button>

      <button className="account-dropdown-item" onClick={() => navigate("profiles-settings")}>
        <Pencil size={20} />
        <span>Gerenciar perfis</span>
      </button>

      <button className="account-dropdown-item" onClick={() => openTopic("Central de Ajuda")}>
        <CircleHelp size={20} />
        <span>Central de Ajuda</span>
      </button>

      <button className="account-dropdown-item" onClick={() => openTopic("Trocar perfil")}>
        <Users size={20} />
        <span>Trocar perfil</span>
        <ChevronRight className="account-dropdown-chevron" size={19} />
      </button>

      <button className="account-dropdown-item account-dropdown-logout" onClick={handleLogoutClick}>
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </div>
  );
}
