import { getStockImage } from '../data/stockImages';

export default function LandingScreen({ data, onExplore, onShare, onNavigateReview }) {
  if (!data) return <div style={{ padding: '40px', color: '#aaa' }}>Loading...</div>;

  const featured = data.featured?.[0];
  const sideCards = (data.recent || []).slice(0, 2);
  const masonry = (data.recent || []).slice(0, 6);

  const sideColors = [
    { bg: '#001220', fill: '#0055a5', win: '#001220' },
    { bg: '#1a1a0a', fill: '#F9A825', win: '#1a1a00' },
  ];

  const pinCfgs = [
    { bg: '#0a0a0a', fill: '#212121', stroke: '#333', h: 155 },
    { bg: '#0a0020', fill: '#5c00b8', stroke: '#6600cc', h: 110 },
    { bg: '#1a0500', fill: '#b82800', stroke: '#cc3300', h: 135 },
    { bg: '#001220', fill: '#0055a5', stroke: '#0077cc', h: 120 },
    { bg: '#001a00', fill: '#1a5c1a', stroke: '#006600', h: 90 },
    { bg: '#0f0a00', fill: '#a06000', stroke: '#cc8800', h: 100 },
  ];

  const featuredImage = getStockImage(featured?.title, featured?.category);

  return (
    <div>
      <div className="nav">
        <div className="logo">Car<span>Geeks</span></div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); onExplore?.(); }}>Explore</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateReview?.(); }}>Reviews</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onExplore?.(); }}>Builds</a>
          <a href="#" onClick={(e) => { e.preventDefault(); }}>Events</a>
          <a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); onShare?.(); }}>Join community</a>
        </div>
        <div className="nav-ava">JK</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', padding: '36px 40px 24px' }}>
        <div style={{ paddingTop: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--red-tint)', border: '1px solid var(--red-border)', color: 'var(--red-dark)', fontSize: '11px', fontWeight: '500', padding: '4px 12px', borderRadius: '18px', marginBottom: '18px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--red)' }} />
            New builds dropping daily
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '46px', fontWeight: '900', lineHeight: '1.08', color: 'var(--dark)', marginBottom: '14px', letterSpacing: '-1px' }}>
            Where <em style={{ color: 'var(--red)', fontStyle: 'italic' }}>car lovers</em> share, build &amp; obsess.
          </div>
          <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.65', maxWidth: '360px', marginBottom: '24px' }}>
            Discover stunning builds, honest reviews, and deep dives from the most passionate car community on the internet.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
            <button type="button" style={{ background: 'var(--dark)', color: '#fff', padding: '10px 22px', borderRadius: '22px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }} onClick={onExplore}>Explore builds</button>
            <button type="button" style={{ border: '1.5px solid var(--dark)', color: 'var(--dark)', padding: '10px 18px', borderRadius: '22px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }} onClick={onShare}>Share yours</button>
          </div>
          <div style={{ display: 'flex', gap: '28px' }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700' }}>{data.active_geeks || '2.4k'}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Active geeks</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700' }}>12K+</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Builds shared</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700' }}>340+</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Car marques</div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => onNavigateReview?.()}>
            <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
              <img src={featuredImage} alt={featured?.title} className="hero-image" />
              <div className="hero-image-overlay" />
              <div style={{ position: 'absolute', bottom: '12px', left: '16px', background: 'var(--red)', color: '#fff', fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '9px' }}>Featured build</div>
              <div style={{ position: 'absolute', bottom: '12px', right: '16px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '9px' }}>1 / 8</div>
            </div>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '700' }}>
                  {featured?.title || '1967 Ferrari 275 GTB  Full Restoration'}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>
                  {featured?.author_name || 'Marco Ricci'}  2h ago  {featured?.likes || '2.4k'} saves
                </div>
              </div>
              <div style={{ fontSize: '18px', color: 'var(--red)', cursor: 'pointer' }}></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
            {sideCards.map((post, idx) => {
              const c = sideColors[idx % sideColors.length];
              return (
                <div className="card" key={post.id} style={{ cursor: 'pointer' }} onClick={onExplore}>
                  <div style={{ height: '90px', position: 'relative', overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
                    <img src={getStockImage(post.title, post.category)} alt={post.title} className="card-media" />
                    <div className="card-media-overlay" />
                  </div>
                  <div className="card-body" style={{ padding: '9px 12px' }}>
                    <div className="pin-tag">{post.category}</div>
                    <div style={{ fontSize: '11px', fontWeight: '500' }}>{post.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 40px 28px' }}>
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#bbb" strokeWidth="1.4">
            <circle cx="6" cy="6" r="4" />
            <path d="M10 10l3 3" />
          </svg>
          <span>Search builds, reviews, marques...</span>
        </div>
        <div className="filter-row" style={{ marginBottom: '18px' }}>
          <span className="pill pill-dark">All</span>
          <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Builds</span>
          <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Reviews</span>
          <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Track days</span>
          <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Restorations</span>
          <span className="pill pill-outline" style={{ cursor: 'pointer' }}>Mods</span>
          <span className="pill pill-outline" style={{ cursor: 'pointer' }}>News</span>
        </div>
        <div className="masonry">
          {masonry.map((post, idx) => {
            const c = pinCfgs[idx % pinCfgs.length];
            return (
              <div className="pin card" key={post.id} style={{ cursor: 'pointer' }} onClick={onExplore}>
                <div style={{ height: `${c.h}px`, position: 'relative', overflow: 'hidden' }}>
                  <img src={getStockImage(post.title, post.category)} alt={post.title} className="card-media" />
                  <div className="card-media-overlay" />
                </div>
                <div className="card-body">
                  <div className="pin-tag">{post.category}</div>
                  <div className="pin-title">{post.title}</div>
                  <div className="pin-foot">
                    <span className="pin-likes">{post.likes}</span>
                    <span style={{ fontSize: '10px', color: '#ccc' }}>2d ago</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
