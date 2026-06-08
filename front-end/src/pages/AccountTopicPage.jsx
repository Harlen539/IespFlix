import {
  ArrowLeft,
  Beaker,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  KeyRound,
  Mail,
  MonitorSmartphone,
  Phone,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";
import { useState } from "react";
import FooterAccount from "../components/FooterAccount";
import SidebarAccount from "../components/SidebarAccount";

function normalizeTopic(topic) {
  if (topic && typeof topic === "object") return topic;

  return { title: String(topic || "Visão geral") };
}

function topicId(topic) {
  const text = `${topic.id || ""} ${topic.title || ""}`.toLowerCase();

  if (text.includes("subscription") || text.includes("assinatura")) return "subscription";
  if (text.includes("security") || text.includes("segurança")) return "security";
  if (text.includes("devices") || text.includes("aparelhos")) return "devices";
  if (text.includes("overview") || text.includes("visão")) return "overview";
  if (text.includes("controle parental")) return "parental";
  if (text.includes("transfer")) return "transfer";
  if (text.includes("central de ajuda")) return "help";
  if (text.includes("trocar perfil") || text.includes("perfil selecionado")) return "switch-profile";
  if (text.includes("adicionar perfil")) return "add-profile";
  if (text.includes("configurações de")) return "profile-settings";

  return "topic";
}

function HeaderBlock({ title, subtitle }) {
  return (
    <header className="profiles-settings-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function TopicRow({ icon: Icon, title, description, badge, onClick }) {
  return (
    <button className="account-detail-row" onClick={onClick}>
      <Icon size={23} />
      <span>
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>
      {badge && <b>{badge}</b>}
      <ChevronRight size={22} />
    </button>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="account-detail-section">
      {title && <h2>{title}</h2>}
      <div className="account-detail-card">{children}</div>
    </section>
  );
}

function SubscriptionPage({ onAction }) {
  return (
    <>
      <HeaderBlock title="Assinatura" subtitle="Detalhes do plano" />

      <section className="subscription-plan-card">
        <div className="subscription-plan-accent" />
        <div className="subscription-plan-summary">
          <h2>Plano Padrão</h2>
          <p>Resolução de vídeo 1080p, assistir sem anúncios e muito mais.</p>
        </div>

        <TopicRow
          icon={CreditCard}
          title="Alterar plano"
          onClick={() => onAction?.("Alterar plano")}
        />
        <TopicRow
          icon={UserRoundCheck}
          title="Comprar um acesso de assinante extra"
          description="Compartilhe sua IESPFLIX com alguém que não mora com você."
          badge="Novo"
          onClick={() => onAction?.("Comprar um acesso de assinante extra")}
        />
      </section>

      <SectionCard title="Detalhes de pagamento e cobrança">
        <div className="payment-summary">
          <strong>Próximo pagamento</strong>
          <span>30 de junho de 2026</span>
          <small>●●●● ●●●● ●●●● 7186</small>
        </div>
        <TopicRow
          icon={CreditCard}
          title="Gerenciar forma de pagamento"
          onClick={() => onAction?.("Gerenciar forma de pagamento")}
        />
      </SectionCard>
    </>
  );
}

function SecurityPage({ onAction }) {
  return (
    <>
      <HeaderBlock title="Segurança" subtitle="Detalhes da conta" />

      <SectionCard>
        <TopicRow icon={KeyRound} title="Senha" onClick={() => onAction?.("Senha")} />
        <TopicRow
          icon={Mail}
          title="Email"
          description="emanuella.gbrito@gmail.com • Requer verificação"
          onClick={() => onAction?.("Email")}
        />
        <TopicRow
          icon={Phone}
          title="Celular"
          description="(83) 99634-9384"
          onClick={() => onAction?.("Celular")}
        />
      </SectionCard>

      <SectionCard title="Acesso e privacidade">
        <TopicRow
          icon={MonitorSmartphone}
          title="Acesso e aparelhos"
          description="Gerenciar aparelhos conectados"
          onClick={() => onAction?.({ id: "devices", title: "Aparelhos" })}
        />
        <TopicRow
          icon={UserRoundCheck}
          title="Transferência de perfil"
          description="Ativ."
          badge="Novo"
          onClick={() => onAction?.("Transferência de perfil")}
        />
        <TopicRow
          icon={ShieldCheck}
          title="Acesso a dados pessoais"
          description="Solicite uma cópia dos seus dados pessoais"
          onClick={() => onAction?.("Acesso a dados pessoais")}
        />
        <TopicRow
          icon={Beaker}
          title="Teste de recurso"
          description="Ativ."
          onClick={() => onAction?.("Teste de recurso")}
        />
      </SectionCard>

      <button className="delete-account-button" onClick={() => onAction?.("Excluir conta")}>
        Excluir conta
      </button>
    </>
  );
}

function DevicesPage({ onAction }) {
  return (
    <>
      <HeaderBlock title="Aparelhos" subtitle="Acesso à conta" />

      <SectionCard>
        <TopicRow
          icon={MonitorSmartphone}
          title="Acesso e aparelhos"
          description="Gerenciar aparelhos conectados"
          onClick={() => onAction?.("Acesso e aparelhos")}
        />
      </SectionCard>

      <SectionCard title="Download em celulares e tablets">
        <TopicRow
          icon={Download}
          title="Aparelhos de download móveis"
          description="0 de 2 aparelhos de download em uso"
          onClick={() => onAction?.("Aparelhos de download móveis")}
        />
      </SectionCard>
    </>
  );
}

function GenericPage({ details, onGoTo, onAction }) {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <button className="account-topic-back" onClick={() => onGoTo?.("profiles-settings")}>
        <ArrowLeft size={20} />
        <span>Voltar para perfis</span>
      </button>

      <HeaderBlock title={details.title} subtitle={details.subtitle} />

      <div className="account-topic-card">
        <p className="account-topic-description">{details.description}</p>

        <div className="account-topic-list">
          {details.items.map((item) => (
            <button key={item} onClick={() => onAction?.(item)}>
              <CheckCircle2 size={22} />
              <span>{item}</span>
              <ChevronRight size={20} />
            </button>
          ))}
        </div>

        <div className="account-topic-actions">
          <button className="account-topic-primary" onClick={() => setSaved(true)}>
            Salvar alterações
          </button>
          <button className="account-topic-secondary" onClick={() => onGoTo?.("profiles-settings")}>
            Cancelar
          </button>
        </div>

        {saved && <p className="account-topic-saved">Alterações salvas com sucesso.</p>}
      </div>
    </>
  );
}

function genericContent(topic) {
  const title = topic.title || "Tópico";

  return {
    title,
    subtitle: topic.subtitle || "Configurações da conta",
    description: topic.description || "Revise e atualize as opções deste tópico da sua conta IESPFLIX.",
    items: topic.items || ["Revisar configurações atuais", "Atualizar preferências", "Ver histórico e detalhes"]
  };
}

export default function AccountTopicPage({ topic, onGoTo, onAction }) {
  const normalized = normalizeTopic(topic);
  const activeItem = topicId(normalized);

  return (
    <main className="account-page">
      <div className="account-page-shell">
        <SidebarAccount activeItem={activeItem} onGoTo={onGoTo} onAction={onAction} />

        <section className="account-topic">
          {activeItem === "subscription" && <SubscriptionPage onAction={onAction} />}
          {activeItem === "security" && <SecurityPage onAction={onAction} />}
          {activeItem === "devices" && <DevicesPage onAction={onAction} />}
          {!["subscription", "security", "devices"].includes(activeItem) && (
            <GenericPage details={genericContent(normalized)} onGoTo={onGoTo} onAction={onAction} />
          )}
        </section>
      </div>

      <FooterAccount onAction={onAction} />
    </main>
  );
}
