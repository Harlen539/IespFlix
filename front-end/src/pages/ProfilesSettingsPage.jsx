import { AlertTriangle, ChevronRight, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import AddProfileModal from "../components/AddProfileModal";
import FooterAccount from "../components/FooterAccount";
import ProfileRow from "../components/ProfileRow";
import SidebarAccount from "../components/SidebarAccount";

const initialProfiles = [
  {
    id: "manu",
    name: "Manu",
    initials: "M",
    color: "linear-gradient(135deg, #f7b733, #fc4a1a)",
    isCurrent: true
  },
  {
    id: "kaju",
    name: "Kaju",
    initials: "K",
    color: "linear-gradient(135deg, #baf7ff, #65d38d)"
  },
  {
    id: "harlen",
    name: "Harlen",
    initials: "H",
    color: "linear-gradient(135deg, #12343b, #2c7744)"
  },
  {
    id: "hailla",
    name: "Hailla",
    initials: "HA",
    color: "linear-gradient(135deg, #7c3aed, #f97316)"
  }
];

const settingCards = [
  {
    title: "Ajustar o controle parental",
    description: "Definir limites de classificação etária, bloquear títulos",
    icon: AlertTriangle,
    highlighted: true
  },
  {
    title: "Transferir um perfil",
    description: "Copiar um perfil para outra conta",
    icon: UserRoundPlus
  }
];

const profileColors = [
  "linear-gradient(135deg, #34d399, #10b981)",
  "linear-gradient(135deg, #60a5fa, #2563eb)",
  "linear-gradient(135deg, #f472b6, #db2777)",
  "linear-gradient(135deg, #facc15, #f97316)",
  "linear-gradient(135deg, #a78bfa, #7c3aed)"
];

function initialsFor(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ProfilesSettingsPage({ onGoTo, onAction }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [modalOpen, setModalOpen] = useState(false);

  function addProfile(profile) {
    setProfiles((current) => {
      if (current.length >= 5) return current;

      return [
        ...current,
        {
          id: `${profile.name.toLowerCase().replace(/\W+/g, "-")}-${Date.now()}`,
          name: profile.name,
          initials: initialsFor(profile.name),
          avatar: profile.avatar?.value,
          color: profile.avatar?.color || (profile.kidsProfile ? "linear-gradient(135deg, #5eead4, #22c55e)" : profileColors[current.length % profileColors.length]),
          isKids: profile.kidsProfile
        }
      ];
    });
    setModalOpen(false);
  }

  return (
    <main className="account-page">
      <div className="account-page-shell">
        <SidebarAccount activeItem="profiles" onGoTo={onGoTo} onAction={onAction} />

        <section className="profiles-settings">
          <header className="profiles-settings-header">
            <h1>Perfis</h1>
            <p>Controle parental e permissões</p>
          </header>

          <div className="account-settings-card">
            {settingCards.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  className={item.highlighted ? "account-setting-row highlighted" : "account-setting-row"}
                  onClick={() => onAction?.({ title: item.title, subtitle: item.description })}
                >
                  <Icon size={24} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <ChevronRight size={22} />
                </button>
              );
            })}
          </div>

          <section className="profile-settings-section">
            <h2>Configurações de perfil</h2>

            <div className="account-profiles-card">
              {profiles.map((profile) => (
                <ProfileRow
                  key={profile.id}
                  profile={profile}
                  onSelect={() => onAction?.(`Configurações de ${profile.name} abertas.`)}
                />
              ))}

              <button
                className="add-profile-button"
                onClick={() => profiles.length < 5 && setModalOpen(true)}
                disabled={profiles.length >= 5}
              >
                Adicionar perfil
              </button>
              <p className="add-profile-help">
                Adicione até 5 perfis para qualquer pessoa que mora com você.
              </p>
            </div>
          </section>
        </section>
      </div>

      <FooterAccount onAction={onAction} />

      {modalOpen && <AddProfileModal onClose={() => setModalOpen(false)} onSave={addProfile} />}
    </main>
  );
}
