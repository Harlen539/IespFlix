import { X } from "lucide-react";
import { useState } from "react";

const avatarOptions = [
  { id: "smile", label: "Sorriso verde", value: "smile", color: "linear-gradient(135deg, #22c55e, #74e4b5)" },
  { id: "star", label: "Estrela", value: "★", color: "linear-gradient(135deg, #facc15, #f97316)" },
  { id: "bolt", label: "Raio", value: "⚡", color: "linear-gradient(135deg, #38bdf8, #2563eb)" },
  { id: "heart", label: "Coração", value: "♥", color: "linear-gradient(135deg, #fb7185, #be123c)" },
  { id: "game", label: "Controle", value: "🎮", color: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { id: "rocket", label: "Foguete", value: "🚀", color: "linear-gradient(135deg, #111827, #0f766e)" },
  { id: "crown", label: "Coroa", value: "♛", color: "linear-gradient(135deg, #f59e0b, #7c2d12)" },
  { id: "kids", label: "Infantil", value: "kids", color: "linear-gradient(135deg, #5eead4, #22c55e)" }
];

function AvatarFace({ avatar }) {
  if (avatar.value === "smile" || avatar.value === "kids") {
    return <span />;
  }

  return <b>{avatar.value}</b>;
}

export default function AddProfileModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [kidsProfile, setKidsProfile] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSave?.({
      name: trimmedName,
      kidsProfile,
      avatar: selectedAvatar
    });
  }

  return (
    <div className="add-profile-overlay" onMouseDown={onClose}>
      <form
        className="add-profile-modal"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button className="add-profile-close" type="button" aria-label="Fechar" onClick={onClose}>
          <X size={34} />
        </button>

        <header className="add-profile-modal-header">
          <h2>Adicionar um perfil</h2>
          <p>Adicione um perfil IESPFLIX para outra pessoa.</p>
        </header>

        <div className="add-profile-form-row">
          <div className="avatar-picker-wrap">
            <button
              className="add-profile-face add-profile-face-button"
              style={{ background: selectedAvatar.color }}
              type="button"
              aria-label="Escolher ícone do perfil"
              onClick={() => setAvatarPickerOpen((value) => !value)}
            >
              <AvatarFace avatar={selectedAvatar} />
            </button>

            {avatarPickerOpen && (
              <div className="avatar-picker-panel">
                <p>Escolha um ícone</p>
                <div className="avatar-picker-grid">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      className={avatar.id === selectedAvatar.id ? "avatar-option active" : "avatar-option"}
                      style={{ background: avatar.color }}
                      type="button"
                      aria-label={avatar.label}
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        setAvatarPickerOpen(false);
                      }}
                    >
                      <AvatarFace avatar={avatar} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="add-profile-name-field">
            <span>Nome</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              maxLength={24}
              placeholder=" "
            />
          </label>
        </div>

        <div className="add-profile-divider" />

        <div className="kids-profile-row">
          <span>
            <strong>Perfil para crianças</strong>
            <small>Ver apenas séries e filmes indicados ao público infantil</small>
          </span>

          <button
            className={kidsProfile ? "kids-toggle active" : "kids-toggle"}
            type="button"
            aria-pressed={kidsProfile}
            onClick={() => setKidsProfile((value) => !value)}
          >
            <span />
          </button>
        </div>

        <button className="add-profile-save" type="submit" disabled={!name.trim()}>
          Salvar
        </button>

        <button className="add-profile-cancel" type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
