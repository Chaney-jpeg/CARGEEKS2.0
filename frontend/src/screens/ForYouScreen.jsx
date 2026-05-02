import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function ForYouScreen({ data, interests, onNavigateToTab, onInterestChange }) {
  const interestOptions = [
    { label: 'Porsche', color: '#c0392b' },
    { label: 'Restoration', color: '#854f0b' },
    { label: 'Italian classics', color: '#185fa5' },
    { label: 'Track days', color: '#3b6d11' },
    { label: 'JDM', color: '#534ab7' },
    { label: 'EV builds', color: '#0f6e56' },
  ];

  const feedCards = data?.recommended || [];
  const following = data?.following || [];
  const suggested = data?.suggested || [];
  const interestSummary = interests.length > 0 ? interests.join(', ') : 'car culture';

  const cardColors = [
    { bg: '#1c1c2e', fill: '#c0392b', stroke: '#444', featured: true },
    { bg: '#1a0010', fill: '#8B0050', stroke: '#cc0066', featured: false },
    { bg: '#001220', fill: '#0055a5', stroke: '#0077cc', featured: false },
  ];

  const avatarColors = [
    { bg: 'var(--red-tint)', color: 'var(--red)' },
    { bg: '#fbeaf0', color: '#993556' },
    { bg: '#e6f1fb', color: '#185fa5' },
  ];

  const initials = (name) => {
    if (!name) return 'CG';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div>
      <div className="nav">
        <div className="logo">Car<span>Geeks</span></div>
        <div className="nav-pill-group">
          <div className="nav-pill-item">Home</div>
          <div className="nav-pill-item active">For you</div>
          <div className="nav-pill-item" style={{ cursor: 'pointer' }} onClick={() => onNavigateToTab?.('profile')}>Following</div>
          <div className="nav-pill-item" style={{ cursor: 'pointer' }} onClick={() => onNavigateToTab?.('landing')}>Explore</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--warm-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#666" strokeWidth="1.3">
              <path d="M6.5 1a3.5 3.5 0 013.5 3.5v2.5l1 2H2l1-2V4.5A3.5 3.5 0 016.5 1z" />
              <path d="M5 10.5a1.5 1.5 0 003 0" />
            </svg>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', position: 'absolute', top: '5px', right: '5px' }} />
          </div>
          <div className="nav-ava">AK</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 240px' }}>
        <div style={{ padding: '18px 14px 18px 20px', borderRight: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.7px', color: '#bbb', fontWeight: '500', marginBottom: '10px' }}>Menu</div>
          {[
            { label: 'For you', active: true, iconColor: 'var(--red-tint)', badge: null },
            { label: 'Following', active: false, iconColor: '#f1efe8', badge: null, onClick: () => onNavigateToTab?.('profile') },
            { label: 'Explore', active: false, iconColor: '#f1efe8', badge: null, onClick: () => onNavigateToTab?.('landing') },
            { label: 'Saved', active: false, iconColor: '#f1efe8', badge: '24' },
          ].map(({ label, active, iconColor, badge, onClick }) => (
            <div key={label} className={`rail-item${active ? ' active' : ''}`} style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
              <div className="rail-icon" style={{ background: iconColor }}>
                {label === 'For you' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#c0392b" strokeWidth="1.4"><path d="M1 6l5-4.5L11 6v5H8V8H4v3H1z" /></svg>}
                {label === 'Following' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#888" strokeWidth="1.4"><circle cx="6" cy="6" r="4.5" /><path d="M6 3.5v2.5l1.5 1.5" /></svg>}
                {label === 'Explore' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#888" strokeWidth="1.4"><circle cx="5.5" cy="5.5" r="4" /><path d="M10 10l2 2" /></svg>}
                {label === 'Saved' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#888" strokeWidth="1.4"><path d="M2 2h3v3H2zM7 2h3v3H7zM2 7h3v3H2zM7 7h3v3H7z" /></svg>}
              </div>
              <span className="rail-name">{label}</span>
              {badge && <span style={{ fontSize: '10px', color: '#bbb', marginLeft: 'auto' }}>{badge}</span>}
            </div>
          ))}
          <div style={{ height: '1px', background: 'var(--card-border)', margin: '14px 0' }} />
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.7px', color: '#bbb', fontWeight: '500', marginBottom: '10px' }}>Your interests</div>
          {interestOptions.map((item) => {
            const active = interests.includes(item.label);
            return (
              <button
                key={item.label}
                className={`interest-pill${active ? ' on' : ''}`}
                onClick={() => onInterestChange(item.label)}
                type="button"
              >
                <div className="i-dot" style={{ background: active ? item.color : 'var(--warm-border)' }} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '20px 22px', borderRight: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '900' }}>
                Your <em style={{ color: 'var(--red)' }}>feed</em>
              </div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Picked for you based on {interestSummary}</div>
            </div>
            <button style={{ fontSize: '11px', color: 'var(--red)', fontWeight: '500', cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap' }} onClick={() => onNavigateToTab?.('profile')}>Tune preferences </button>
          </div>
          <div className="filter-row" style={{ marginBottom: '18px' }}>
            <span className="pill pill-dark">All</span>
            <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Builds</span>
            <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Reviews</span>
            <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Restorations</span>
            <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Track</span>
          </div>

          {feedCards.slice(0, 3).map((row, idx) => {
            const c = cardColors[idx % cardColors.length];
            const av = avatarColors[idx % avatarColors.length];
            return (
              <div key={row.id}>
                {idx === 1 && (
                  <div className="divider-lbl">
                    <div className="dl-line" />
                    <div className="dl-text">Because you follow Italian classics</div>
                    <div className="dl-line" />
                  </div>
                )}
                {idx === 2 && (
                  <div className="divider-lbl">
                    <div className="dl-line" />
                    <div className="dl-text">Trending in restoration</div>
                    <div className="dl-line" />
                  </div>
                )}
                <div className={`feed-card${c.featured ? ' featured' : ''}`} style={{ cursor: 'pointer' }} onClick={() => onSelectPost?.(row.id)}>
                  <div className="fc-top">
                    <div className="author-ava" style={{ background: av.bg, color: av.color, width: '30px', height: '30px', fontSize: '11px' }}>
                      {initials(row.author_name)}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{row.author_name}</div>
                      <div style={{ fontSize: '10px', color: '#aaa' }}>{row.handle}  2h ago</div>
                    </div>
                    <span className="pill pill-red" style={{ marginLeft: 'auto' }}>{row.category}</span>
                  </div>
                  <div style={{ height: idx === 0 ? '140px' : idx === 1 ? '110px' : '100px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="240" height="100" viewBox="0 0 240 100" fill="none">
                      <ellipse cx="38" cy="82" rx="17" ry="17" fill={c.bg} stroke={c.stroke} strokeWidth="1.5" />
                      <ellipse cx="202" cy="82" rx="17" ry="17" fill={c.bg} stroke={c.stroke} strokeWidth="1.5" />
                      <path d="M8 72 L28 40 L52 22 L180 20 L212 48 L226 68 L226 76Z" fill={c.fill} />
                      <path d="M52 22 L58 48 L180 48 L180 20Z" fill={c.bg} opacity="0.72" />
                    </svg>
                  </div>
                  <div className="fc-body">
                    <div className="fc-title">{row.title}</div>
                    <div className="fc-excerpt">{row.excerpt || 'A deep dive into what makes this build truly special.'}</div>
                    <div className="fc-foot">
                      <span style={{ fontSize: '11px', color: c.featured ? 'var(--red)' : '#aaa' }}> {row.likes}</span>
                      <span style={{ fontSize: '11px', color: '#aaa' }}> {Math.floor(row.likes / 35)}</span>
                      <span style={{ fontSize: '11px', color: '#aaa', marginLeft: 'auto' }}>6 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '18px 20px 18px 16px' }}>
          <div className="sidebar-card">
            <div className="sidebar-label">Trending this week</div>
            {[
              { title: 'Ferrari SF90 daily driver  6 months in', meta: 'Luca F.  5.4k likes' },
              { title: 'Full 911 RSR bare-metal repaint', meta: 'Alex K.  3.1k likes' },
              { title: 'Widebody R34 Skyline build log', meta: 'Kenji N.  8.2k likes' },
              { title: 'Stage 3 Audi RS3 full breakdown', meta: 'Dylan M.  990 likes' },
            ].map((item, i) => (
              <div className="trending-item" key={i}>
                <div className="t-num">{i + 1}</div>
                <div>
                  <div className="t-title">{item.title}</div>
                  <div className="t-meta">{item.meta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <div className="sidebar-label">Suggested for you</div>
            {suggested.length > 0 ? suggested.slice(0, 4).map((u, i) => {
              const avc = [
                { bg: '#eaf3de', color: '#3b6d11' },
                { bg: '#faeeda', color: '#854f0b' },
                { bg: '#e6f1fb', color: '#185fa5' },
                { bg: 'var(--red-tint)', color: 'var(--red)' },
              ];
              const c = avc[i % avc.length];
              return (
                <div className="suggested-item" key={u.handle}>
                  <div className="s-ava" style={{ background: c.bg, color: c.color }}>{initials(u.first_name + ' ' + u.last_name)}</div>
                  <div>
                    <div className="s-name">{u.first_name} {u.last_name}</div>
                    <div className="s-why">{u.interest_note || 'Similar interests'}</div>
                  </div>
                  <button className="s-follow" onClick={async () => { try { await api.followUser(u.id); alert('Followed ' + u.first_name); } catch { alert('Failed'); } }}>Follow</button>
                </div>
              );
            }) : [
              { name: 'Kenji Nakamura', why: 'JDM & widebody builds', c: { bg: '#e6f1fb', color: '#185fa5' } },
              { name: 'Tom Whitfield', why: 'Restoration specialist', c: { bg: '#eaf3de', color: '#3b6d11' } },
            ].map((u, i) => (
              <div className="suggested-item" key={i}>
                <div className="s-ava" style={{ background: u.c.bg, color: u.c.color }}>{initials(u.name)}</div>
                <div>
                  <div className="s-name">{u.name}</div>
                  <div className="s-why">{u.why}</div>
                </div>
                <button className="s-follow">Follow</button>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <div className="sidebar-label">Your reading streak</div>
            <div className="streak-bar">
              {[1,1,1,1,1,0,0].map((on, i) => (
                <div key={i} className="streak-day" style={{ background: on ? 'var(--red)' : 'var(--warm-border)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ccc', marginBottom: '8px' }}>
              {['M','T','W','T','F','S','S'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div style={{ fontSize: '11px', color: '#888' }}>5-day streak   keep it going!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
