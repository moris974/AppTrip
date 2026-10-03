import { useRouter } from 'next/router';

const MENU = [
  { href: '/dashboard', icon: '🖥️', label: 'Dashboard', group: 1 },
  { href: '/impostazioni/dati-struttura', icon: '🏠', label: 'Dati struttura', group: 1 },
  { href: '/impostazioni/servizi', icon: '💡', label: 'Servizi', group: 1 },
  { href: '/impostazioni/informazioni-utili', icon: 'ℹ️', label: 'Informazioni utili', group: 1 },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-mark">TT</div>
        <div className="sb-logo-text">
          <h1>TravelTrip</h1>
          <p>I CONSIGLI PER I TUOI OSPITI</p>
        </div>
      </div>

      <nav className="menu">
        <div className="menu-group">
          {MENU.map((item) => (
            <div
              key={item.href}
              className={'menu-item' + (router.pathname === item.href ? ' active' : '')}
              onClick={() => router.push(item.href)}
            >
              <span className="ic">{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      </nav>

      <div className="sb-footer">Termini e Privacy</div>
    </aside>
  );
}
