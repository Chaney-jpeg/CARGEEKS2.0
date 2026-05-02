import { api } from '../api/client';

export default function ProfileScreen({ users, selectedUserId, onSelectUser, detail, onNavigateToTab, onSelectPost }) {
  const user = detail?.user;

  const initials = (name) => {
    if (!name) return 'CG';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const garageColors = [
    { bg: '#1c1c2e', fill: '#c0392b' },
    { bg: '#1a0010', fill: '#8B0050' },
    { bg: '#001220', fill: '#0055a5' },
  ];

  const postCfgs = [
    { bg: '#1c1c2e', fill: '#c0392b', stroke: '#444', h: 160 },
    { bg: '#001220', fill: '#0055a5', stroke: '#0077cc', h: 115 },
    { bg: '#0f0a00', fill: '#a06000', stroke: '#cc8800', h: 135 },
    { bg: '#1a0010', fill: '#8B0050', stroke: '#cc0066', h: 120 },
  ];

  return (
    <div>
      <div className="nav">
        <div className="logo">Car<span>Geeks</span></div>
        <div className="nav-links">
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigateToTab?.('for-you')}>Explore</span>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigateToTab?.('landing')}>Builds</span>
          <span>Events</span>
        </div>
        <div className="nav-ava">JK</div>
      </div>

      <div className="profile-cover">
        <svg style={{ position: 'absolute', bottom: '0', width: '100%', height: '120px' }} viewBox="0 0 1100 120" preserveAspectRatio="none" fill="none">
          <path d="M40 105 L100 55 L160 28 L440 26 L540 64 L580 96 L580 110Z" fill="#c0392b" opacity="0.16" />
          <ellipse cx="112" cy="112" rx="28" ry="28" fill="#0a0a0a" opacity="0.4" />
          <ellipse cx="552" cy="112" rx="28" ry="28" fill="#0a0a0a" opacity="0.4" />
          <path d="M680 104 L730 62 L780 40 L960 38 L1040 72 L1070 98 L1070 110Z" fill="#555" opacity="0.1" />
        </svg>
      </div>

      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="user-select" className="field-label">View profile</label>
          <select
            id="user-select"
            className="input"
            style={{ maxWidth: '340px' }}
            value={selectedUserId || ''}
            onChange={(e) => onSelectUser(Number(e.target.value))}
          >
            {users.map((item) => (
              <option key={item.id} value={item.id}>{item.first_name} {item.last_name} ({item.handle})</option>
            ))}
          </select>
        </div>

        {user && (<>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', marginTop: '-38px', marginBottom: '16px' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'var(--red-tint)', border: '4px solid var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '500', color: 'var(--red)', flexShrink: '0' }}>
              {initials(user.first_name + ' ' + user.last_name)}
            </div>
            <div style={{ flex: '1', paddingBottom: '6px' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '900', color: 'var(--dark)' }}>{user.first_name} {user.last_name}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>{user.handle}  Member since 2021</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', paddingBottom: '6px' }}>
              <button type="button" style={{ background: 'var(--dark)', color: '#fff', padding: '7px 20px', borderRadius: '18px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: 'none' }} onClick={async () => { try { await api.followUser(user.id); alert('Followed ' + user.first_name); } catch { alert('Failed'); } }}> + Follow</button>
              <button type="button" style={{ border: '1.5px solid var(--dark)', color: 'var(--dark)', padding: '7px 16px', borderRadius: '18px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', background: 'transparent' }} onClick={() => alert('Message ' + user.first_name)}>Message</button>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '12px', maxWidth: '520px' }}>
            {user.bio || 'Restoration obsessive. Based in Warsaw. Specialising in air-cooled Porsche and vintage Italian.'}
          </p>
          <div style={{ display: 'flex', gap: '18px', marginBottom: '16px', fontSize: '12px', color: '#888' }}>
            <span> Warsaw, Poland</span>
            <span> Joined March 2021</span>
            <span> Top contributor 2024</span>
            <span> 38.4k total likes</span>
          </div>
          <div className="stats-row" style={{ marginBottom: '20px' }}>
            <div className="stat-item"><div className="stat-num">{detail?.stats?.posts || 0}</div><div className="stat-label">Posts</div></div>
            <div className="stat-item"><div className="stat-num">{detail?.stats?.followers || 0}</div><div className="stat-label">Followers</div></div>
            <div className="stat-item"><div className="stat-num">{detail?.stats?.following || 0}</div><div className="stat-label">Following</div></div>
            <div className="stat-item"><div className="stat-num">38.4k</div><div className="stat-label">Likes received</div></div>
            <div className="stat-item"><div className="stat-num">1,240</div><div className="stat-label">Saves</div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--card-border)', marginBottom: '16px' }}>
                <div style={{ padding: '9px 18px', fontSize: '13px', fontWeight: '500', color: 'var(--dark)', borderBottom: '2px solid var(--red)', cursor: 'pointer' }}>Posts</div>
                <div style={{ padding: '9px 18px', fontSize: '13px', color: '#aaa', cursor: 'pointer' }}>Saved</div>
                <div style={{ padding: '9px 18px', fontSize: '13px', color: '#aaa', cursor: 'pointer' }}>Builds</div>
                <div style={{ padding: '9px 18px', fontSize: '13px', color: '#aaa', cursor: 'pointer' }}>Liked</div>
              </div>
              <div className="masonry" style={{ columns: '2' }}>
                {(detail?.activity || []).slice(0, 4).map((item, idx) => {
                  const c = postCfgs[idx % postCfgs.length];
                  return (
                    <div className="pin card" key={idx} style={{ cursor: 'pointer' }} onClick={() => { onSelectPost?.(item.id); onNavigateToTab?.('post'); }}>
                      <div style={{ height: `${c.h}px`, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="155" height="70" viewBox="0 0 155 70" fill="none">
                          <ellipse cx="24" cy="57" rx="16" ry="16" fill={c.bg} stroke={c.stroke} strokeWidth="1.5" />
                          <ellipse cx="131" cy="57" rx="16" ry="16" fill={c.bg} stroke={c.stroke} strokeWidth="1.5" />
                          <path d="M5 49 L20 26 L36 14 L114 13 L134 32 L144 47 L144 51Z" fill={c.fill} />
                          <path d="M36 14 L40 32 L114 32 L114 13Z" fill={c.bg} opacity="0.7" />
                        </svg>
                      </div>
                      <div className="card-body">
                        <div className="pin-tag">{item.category}</div>
                        <div className="pin-title">{item.title}</div>
                        <div className="pin-foot">
                          <span className="pin-likes">{item.likes}</span>
                          <span style={{ fontSize: '10px', color: '#ccc' }}>2d ago</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="sidebar-card">
                <div className="sidebar-label">Garage</div>
                <div className="garage-grid">
                  {(detail?.garage || []).map((car, idx) => {
                    const c = garageColors[idx % garageColors.length];
                    return (
                      <div className="garage-card" key={idx}>
                        <div className="garage-img" style={{ background: c.bg }}>
                          <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                            <path d="M2 18 L8 8 L14 4 L34 3 L42 12 L45 17Z" fill={c.fill} />
                          </svg>
                        </div>
                        <div className="garage-info">
                          <div className="garage-car">{car.car_model}</div>
                          <div className="garage-yr">{car.car_year}  {car.status || 'In garage'}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="garage-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '74px', background: '#fafaf8', borderStyle: 'dashed', cursor: 'pointer' }}>
                    <span style={{ fontSize: '22px', color: '#ccc' }}>+</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card">
                <div className="sidebar-label">Badges</div>
                <div className="badge-row">
                  <div className="badge"><span style={{ fontSize: '13px' }}></span>Top 2024</div>
                  <div className="badge"><span style={{ fontSize: '13px' }}></span>Wrench king</div>
                  <div className="badge"><span style={{ fontSize: '13px' }}></span>Photographer</div>
                  <div className="badge"><span style={{ fontSize: '13px' }}></span>Track regular</div>
                  <div className="badge"><span style={{ fontSize: '13px' }}></span>Verified geek</div>
                </div>
              </div>

              <div className="sidebar-card">
                <div className="sidebar-label">Recent activity</div>
                {[
                  { dot: 'var(--red)', text: 'Published ', bold: 'RSR bare-metal repaint', time: '2 days ago' },
                  { dot: '#185fa5', text: 'Commented on ', bold: "Kenji's R34 build", time: '3 days ago' },
                  { dot: '#3b6d11', text: 'Saved ', bold: 'Nürburgring guide by Tom W.', time: '5 days ago' },
                  { dot: '#854f0b', text: 'Liked ', bold: 'Ferrari SF90 daily review', time: '1 week ago' },
                ].map((item, i) => (
                  <div className="activity-item" key={i}>
                    <div className="a-dot" style={{ background: item.dot }} />
                    <div>
                      <div className="a-text">{item.text}<strong>{item.bold}</strong></div>
                      <div className="a-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sidebar-card">
                <div className="sidebar-label">People {user.first_name} follows</div>
                {(detail?.following || []).map((f, i) => {
                  const colors = ['#e6f1fb', '#eaf3de', '#faeeda'];
                  const texts = ['#185fa5', '#3b6d11', '#854f0b'];
                  return (
                    <div className="following-item" key={i}>
                      <div className="f-ava" style={{ background: colors[i % 3], color: texts[i % 3] }}>
                        {initials(f.first_name + ' ' + f.last_name)}
                      </div>
                      <div className="f-info">
                        <div className="f-name">{f.first_name} {f.last_name}</div>
                        <div className="f-handle">{f.handle}</div>
                      </div>
                      <button className="f-follow">Following</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}
