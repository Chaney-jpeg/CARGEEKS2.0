import { useEffect, useState } from 'react';
import { getStockImage } from '../data/stockImages';
import { api } from '../api/client';

export default function PostDetailScreen({ posts, selectedPostId, onSelectPost, detail, onBack }) {
  const post = detail?.post;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(detail?.comments || []);

  useEffect(() => {
    setLiked(false);
    setSaved(false);
    setFollowing(false);
    setCommentText('');
    setComments(detail?.comments || []);
  }, [detail]);

  const initials = (name) => {
    if (!name) return 'CG';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await api.addComment(post.id, commentText.trim());
      setComments((prev) => [
        { author_name: 'You', comment_text: commentText.trim() },
        ...prev,
      ]);
      setCommentText('');
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      await api.likePost(post.id);
      setLiked((prev) => !prev);
    } catch (err) {
      alert('Failed to like post');
    }
  };

  const handleSave = async () => {
    try {
      await api.savePost(post.id);
      setSaved((prev) => !prev);
    } catch (err) {
      alert('Failed to save post');
    }
  };

  const handleFollow = async () => {
    // Assume post.author_id or something, but since not in post, placeholder
    alert('Follow functionality');
    setFollowing((prev) => !prev);
  };

  const heroImage = getStockImage(post?.title, post?.category);

  return (
    <div>
      <div className="nav">
        <div className="logo">Car<span>Geeks</span></div>
        <div className="nav-links">
          <button type="button" style={{ background: 'var(--cream)', border: '1px solid var(--warm-border)', borderRadius: '16px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }} onClick={onBack}>
            ← Back to feed
          </button>
        </div>
        <div className="nav-ava">JK</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px' }}>
        <div style={{ padding: '24px 28px', borderRight: '1px solid var(--card-border)' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="post-select" className="field-label">View post</label>
            <select
              id="post-select"
              className="input"
              value={selectedPostId || ''}
              onChange={(e) => onSelectPost(Number(e.target.value))}
            >
              {posts.map((item) => (
                <option key={item.id} value={item.id}>{item.title} ({item.category})</option>
              ))}
            </select>
          </div>

          {!post ? (
            <div style={{ padding: '20px', color: '#aaa' }}>Select a post above to read it.</div>
          ) : (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="pill pill-red">{post.category}</span>
              <span style={{ fontSize: '11px', color: '#aaa' }}> 6 min read  March 2026</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '900', lineHeight: '1.1', color: 'var(--dark)', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              {post.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)', marginBottom: '18px' }}>
              <div className="author-ava" style={{ background: 'var(--red-tint)', color: 'var(--red)', width: '36px', height: '36px' }}>
                {initials(post.author_name)}
              </div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>{post.author_name}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{post.handle}</div>
              </div>
              <button type="button" className="button button-small" style={{ background: 'var(--dark)', color: '#fff', borderRadius: '18px', padding: '6px 16px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }} onClick={handleFollow}>
                {following ? 'Following' : '+ Follow'}
              </button>
            </div>
            <div style={{ position: 'relative', height: '320px', borderRadius: '18px', overflow: 'hidden', marginBottom: '16px' }}>
              <img
                src={heroImage}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.48) 100%)' }} />
              <div style={{ position: 'absolute', left: '24px', bottom: '24px', color: '#fff', zIndex: 1 }}>
                <div style={{ marginBottom: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{post.category} • {post.platform || 'Build'} • 6 min read</div>
                <div style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1.1', maxWidth: '520px' }}>{post.title}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '16px', height: '5px', borderRadius: '3px', background: 'var(--red)' }} />
              {[1,2,3,4].map(i => <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--warm-border)' }} />)}
            </div>
            <div className="spec-strip" style={{ marginBottom: '20px' }}>
              <div className="spec-cell"><div className="spec-lbl">Power</div><div className="spec-val">{post.horsepower || ''}</div></div>
              <div className="spec-cell"><div className="spec-lbl">Torque</div><div className="spec-val">{post.torque || ''}</div></div>
              <div className="spec-cell"><div className="spec-lbl">Drivetrain</div><div className="spec-val">{post.drivetrain || ''}</div></div>
              <div className="spec-cell"><div className="spec-lbl">Platform</div><div className="spec-val">{post.platform || ''}</div></div>
            </div>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.75', marginBottom: '14px' }}>{post.body}</p>
            <div className="pull-quote">
              <p>"The moment you see it come together  every decision, every compromise suddenly makes sense."</p>
            </div>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.75', marginBottom: '16px' }}>
              Every detail matters. From the paint depth to the panel gaps  the passion behind a true build always shows in the final result.
            </p>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '16px', paddingTop: '14px', borderTop: '1px solid var(--card-border)' }}>
              <span className="tag-chip">{post.category}</span>
              <span className="tag-chip">{post.platform || 'Build'}</span>
              <span className="tag-chip">CarGeeks</span>
            </div>
            <div className="react-bar" style={{ marginBottom: '22px' }}>
              <button className="react-btn liked" onClick={handleLike}> {liked ? post.likes + 1 : post.likes}</button>
              <button className="react-btn" onClick={() => alert('Comments')}> {detail?.comments?.length || 0}</button>
              <button className="react-btn" onClick={handleSave}> {saved ? 'Saved' : 'Save'}</button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '7px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--warm-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer' }}></div>
              </div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
              Comments <span style={{ fontSize: '14px', fontWeight: '400', color: '#aaa' }}>({detail?.comments?.length || 0})</span>
            </div>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '18px' }}>
              <div className="author-ava" style={{ background: 'var(--warm-border)', color: '#666', width: '30px', height: '30px', fontSize: '11px' }}>JK</div>
              <div style={{ flex: '1', border: '1px solid var(--warm-border)', borderRadius: '11px', background: '#fff', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  style={{ border: 'none', outline: 'none', flex: '1', fontSize: '12px', color: '#666' }}
                />
                <button type="button" style={{ background: 'var(--red)', color: '#fff', borderRadius: '7px', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer', border: 'none' }} onClick={handleCommentSubmit}>+</button>
              </div>
            </div>
            {(detail?.comments || []).map((c, idx) => {
              const avatarColors = [
                { bg: '#e6f1fb', color: '#185fa5' },
                { bg: '#eaf3de', color: '#3b6d11' },
                { bg: '#faeeda', color: '#854f0b' },
              ];
              const ac = avatarColors[idx % avatarColors.length];
              return (
                <div className="comment" key={idx}>
                  <div className="author-ava" style={{ background: ac.bg, color: ac.color, width: '28px', height: '28px', fontSize: '11px' }}>
                    {initials(c.author_name)}
                  </div>
                  <div>
                    <div className="comment-name">{c.author_name} <span className="comment-time">2h ago</span></div>
                    <div className="comment-text">{c.comment_text}</div>
                  </div>
                </div>
              );
            })}
          </>)}
        </div>

        <div style={{ padding: '20px' }}>
          {post && (<>
            <div className="sidebar-card" style={{ textAlign: 'center' }}>
              <div className="sidebar-label">Written by</div>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--red-tint)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '500', color: 'var(--red)' }}>
                {initials(post.author_name)}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '3px' }}>{post.author_name}</div>
              <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.5', marginBottom: '12px' }}>Restoration obsessive. Based in Warsaw. Air-cooled Porsche & vintage Italian.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '14px' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '16px', fontWeight: '500' }}>214</div><div style={{ fontSize: '10px', color: '#aaa' }}>Posts</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '16px', fontWeight: '500' }}>4.1k</div><div style={{ fontSize: '10px', color: '#aaa' }}>Followers</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '16px', fontWeight: '500' }}>38k</div><div style={{ fontSize: '10px', color: '#aaa' }}>Likes</div></div>
              </div>
              <div style={{ background: 'var(--dark)', color: '#fff', borderRadius: '18px', padding: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>+ Follow {post.author_name?.split(' ')[0]}</div>
            </div>

            <div className="sidebar-card">
              <div className="sidebar-label">In this post</div>
              {['Stripping to bare metal', 'Metalwork & panel repair', 'Colour matching process', 'Paint application', 'Cost breakdown'].map((item, i) => (
                <div className="toc-item" key={i}>
                  <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="sidebar-card">
              <div className="sidebar-label">More posts</div>
              {posts.filter(p => p.id !== post.id).slice(0, 3).map((p, i) => {
                const colors = ['#001220', '#1a0010', '#0f0a00'];
                const fills = ['#0055a5', '#8B0050', '#a06000'];
                return (
                  <div key={p.id} style={{ display: 'flex', gap: '9px', marginBottom: '11px', cursor: 'pointer' }} onClick={() => onSelectPost(p.id)}>
                    <div style={{ width: '50px', height: '40px', borderRadius: '8px', background: colors[i % 3], flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="42" height="20" viewBox="0 0 42 20" fill="none">
                        <path d="M1 14 L6 6 L12 2 L30 1 L37 8 L40 13Z" fill={fills[i % 3]} />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#aaa' }}>{p.category}</div>
                      <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--dark)', lineHeight: '1.3' }}>{p.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
