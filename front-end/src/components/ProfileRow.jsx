import { ChevronRight } from "lucide-react";

export default function ProfileRow({ profile, onSelect }) {
  return (
    <button className="account-profile-row" onClick={onSelect}>
      <span className="account-profile-avatar" style={{ background: profile.color }}>
        {profile.avatar && profile.avatar !== "smile" && profile.avatar !== "kids" ? (
          <span className="account-profile-avatar-icon">{profile.avatar}</span>
        ) : (
          profile.initials
        )}
      </span>

      <span className="account-profile-name">{profile.name}</span>

      {profile.isCurrent && <span className="account-profile-badge">Seu perfil</span>}

      <ChevronRight size={22} />
    </button>
  );
}
