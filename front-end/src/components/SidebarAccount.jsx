import {
  ArrowLeft,
  Home,
  MonitorSmartphone,
  ShieldCheck,
  UserRoundCog,
  WalletCards
} from "lucide-react";

const accountItems = [
  { id: "overview", label: "Visão geral", icon: Home },
  { id: "subscription", label: "Assinatura", icon: WalletCards },
  { id: "security", label: "Segurança", icon: ShieldCheck },
  { id: "devices", label: "Aparelhos", icon: MonitorSmartphone },
  { id: "profiles", label: "Perfis", icon: UserRoundCog }
];

export default function SidebarAccount({ activeItem = "profiles", onGoTo, onAction }) {
  return (
    <aside className="account-sidebar" aria-label="Navegação da conta">
      <button className="account-sidebar-back" onClick={() => onGoTo?.("home")}>
        <ArrowLeft size={20} />
        <span>Voltar à IESPFLIX</span>
      </button>

      <nav className="account-sidebar-nav">
        {accountItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={item.id === activeItem ? "account-sidebar-link active" : "account-sidebar-link"}
              onClick={() => {
                if (item.id === "profiles") {
                  onGoTo?.("profiles-settings");
                  return;
                }

                onAction?.({ id: item.id, title: item.label });
              }}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
