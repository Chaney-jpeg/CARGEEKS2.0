import { useState } from 'react';

const EMPTY = {
  user_id: '', title: '', category: 'Restoration', excerpt: '', body: '',
  horsepower: '', torque: '', drivetrain: '', platform: '',
};

export default function CreatePostScreen({ users, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [vis, setVis] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [draftStatus, setDraftStatus] = useState('Draft saved 2 min ago');
  const [feedback, setFeedback] = useState('');

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key !== 'excerpt') {
      setDraftStatus('Draft saved just now');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.user_id || !form.title || !form.body) {
      alert('Author, title, and body are required.');
      return;
    }
    await onCreate({
      ...form,
      user_id: Number(form.user_id),
      horsepower: form.horsepower || 'N/A',
      torque: form.torque || 'N/A',
      drivetrain: form.drivetrain || 'N/A',
      platform: form.platform || 'General',
      excerpt: form.excerpt || form.body.slice(0, 120),
    });
    setForm(EMPTY);
    setPreviewMode(false);
    setDraftStatus('Published just now');
  };

  const handlePreview = () => {
    setPreviewMode((prev) => !prev);
    setFeedback(previewMode ? '' : 'Preview mode enabled');
  };

  const saveDraft = () => {
    setDraftStatus('Draft saved just now');
    setFeedback('Draft saved. You can publish when ready.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const hasTitle = form.title.length > 0;
  const hasBody = form.body.length > 0;
  const hasAuthor = form.user_id !== '';

  return (
    <div>
      <div className="nav">
        <div className="logo">Car<span>Geeks</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#aaa' }}>{draftStatus}</span>
          <button type="button" onClick={handlePreview} style={{ border: '1.5px solid var(--dark)', color: 'var(--dark)', padding: '6px 16px', borderRadius: '18px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', background: 'transparent' }}>Preview</button>
          <button type="button" onClick={saveDraft} style={{ border: '1.5px solid var(--warm-border)', color: '#666', padding: '6px 16px', borderRadius: '18px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', background: 'transparent' }}>Save Draft</button>
          <button type="button" onClick={submit} style={{ background: 'var(--red)', color: '#fff', padding: '6px 18px', borderRadius: '18px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>Publish</button>
        </div>
        <div className="nav-ava">AK</div>
      </div>

      <form style={{ display: 'grid', gridTemplateColumns: '1fr 260px' }} onSubmit={submit}>
        <div style={{ padding: '22px 28px', borderRight: '1px solid var(--card-border)' }}>
          <div className="type-pills">
            {['Build', 'Review', 'Restoration', 'Track day', 'Mods'].map(cat => (
              <span
                key={cat}
                className={form.category === cat ? 'pill pill-dark' : 'pill pill-outline'}
                style={{ cursor: 'pointer' }}
                onClick={() => update('category', cat)}
              >{cat}</span>
            ))}
          </div>
          <div style={{ height: '220px', background: '#1c1c2e', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '16px' }}>
            <svg width="320" height="135" viewBox="0 0 320 135" fill="none">
              <ellipse cx="52" cy="110" rx="20" ry="20" fill="#111" stroke="#444" strokeWidth="1.5" />
              <ellipse cx="52" cy="110" rx="8" ry="8" fill="#2a2a2a" />
              <ellipse cx="268" cy="110" rx="20" ry="20" fill="#111" stroke="#444" strokeWidth="1.5" />
              <ellipse cx="268" cy="110" rx="8" ry="8" fill="#2a2a2a" />
              <path d="M10 96 L38 52 L68 30 L240 28 L278 62 L300 90 L300 98Z" fill="#c0392b" stroke="#922b21" strokeWidth="1.5" />
              <path d="M68 30 L76 62 L240 62 L240 28Z" fill="#1a0505" opacity="0.72" />
            </svg>
            <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
              <div style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '7px', cursor: 'pointer' }}>+ Add more</div>
              <div style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '7px', cursor: 'pointer' }}> Remove</div>
            </div>
            <div style={{ position: 'absolute', bottom: '12px', left: '14px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '11px', padding: '3px 9px', borderRadius: '11px' }}>1 / 1 image</div>
          </div>
          <input
            style={{ width: '100%', fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: '900', color: 'var(--dark)', lineHeight: '1.15', marginBottom: '8px', border: 'none', outline: 'none', background: 'transparent' }}
            placeholder="Your post title..."
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
          <div style={{ marginBottom: '14px' }}>
            <textarea
              className="input"
              style={{ border: 'none', resize: 'none', fontSize: '13px', color: '#555', lineHeight: '1.75', minHeight: '52px', padding: '0', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit' }}
              placeholder="Short excerpt..."
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
            />
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#ccc', marginBottom: '14px' }}>
            {form.title.length} / 100
          </div>
          <div className="toolbar">
            <button type="button" className="tb-btn on"><b>B</b></button>
            <button type="button" className="tb-btn"><i>I</i></button>
            <button type="button" className="tb-btn"><u>U</u></button>
            <div className="tb-sep" />
            <button type="button" className="tb-btn" style={{ fontSize: '10px' }}>H2</button>
            <button type="button" className="tb-btn"></button>
            <div className="tb-sep" />
            <button type="button" className="tb-btn"></button>
            <button type="button" className="tb-btn"></button>
            <button type="button" className="tb-btn"></button>
            <div className="tb-sep" />
            <button type="button" className="tb-btn" style={{ fontSize: '10px', width: 'auto', padding: '0 8px' }}>Specs</button>
          </div>
          <textarea
            className="input"
            style={{ border: 'none', resize: 'none', fontSize: '14px', color: '#555', lineHeight: '1.75', minHeight: '140px', padding: '0', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit', marginBottom: '20px' }}
            placeholder="Start writing your post..."
            value={form.body}
            onChange={(e) => update('body', e.target.value)}
          />
          {previewMode ? (
            <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '900', marginBottom: '12px' }}>
                {form.title || 'Preview title'}
              </div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.75', marginBottom: '12px' }}>
                {form.excerpt || form.body.slice(0, 120)}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                <span className="pill pill-outline">{form.category}</span>
                <span className="tag-chip">Preview</span>
              </div>
            </div>
          ) : null}
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px', fontWeight: '500', color: '#555' }}>
              Car specs <span style={{ color: 'var(--red)', cursor: 'pointer' }}>Hide</span>
            </div>
            <div className="spec-grid">
              {[['Make','make'],['Model','platform'],['Year','year'],['Engine','horsepower'],['Project duration','torque'],['Total cost','drivetrain']].map(([label, field]) => (
                <div key={field}>
                  <div className="spec-field-lbl">{label}</div>
                  <input className="spec-input" placeholder={label} value={form[field] || ''} onChange={(e) => update(field, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '18px' }}>
          <div style={{ marginBottom: '18px' }}>
            <div className="sidebar-label">Post type</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
              {['Restoration', 'Build log', 'Review', 'Track day'].map((t, i) => (
                <div key={t} style={{ padding: '7px 10px', borderRadius: '9px', fontSize: '12px', fontWeight: i === 0 ? '500' : '400', border: i === 0 ? '1.5px solid var(--red)' : '1px solid var(--warm-border)', background: i === 0 ? 'var(--red-tint)' : '#fff', color: i === 0 ? 'var(--red-dark)' : '#888', cursor: 'pointer', textAlign: 'center' }} onClick={() => update('category', t)}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div className="sidebar-label">Author</div>
            <select className="input" value={form.user_id} onChange={(e) => update('user_id', e.target.value)}>
              <option value="">Select author</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.handle})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div className="sidebar-label">Tags</div>
            <div className="tags-input-row">
              {[form.category, 'CarGeeks'].filter(Boolean).map(tag => (
                <span key={tag} className="tag-chip">{tag} <span style={{ color: '#aaa', cursor: 'pointer' }}></span></span>
              ))}
              <input placeholder="Add tag..." />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div className="sidebar-label">Visibility</div>
            <div className="vis-opts">
              {[['Public','Visible to all geeks'],['Followers only','People who follow you'],['Private draft','Only you can see this']].map(([t,s], i) => (
                <div key={t} className={`vis-opt${vis === i ? ' active' : ''}`} onClick={() => setVis(i)}>
                  <div className="vis-radio" />
                  <div><div className="vis-text">{t}</div><div className="vis-sub">{s}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div className="sidebar-label">Publish checklist</div>
            <div className="checklist">
              {[
                { label: 'Title added', done: hasTitle },
                { label: 'Cover image uploaded', done: true },
                { label: 'Body content written', done: hasBody },
                { label: 'Tags added', done: true },
                { label: 'Car specs filled in', done: false },
              ].map(({ label, done }) => (
                <div key={label} className="chk-item">
                  <div className={`chk-dot${done ? ' done' : ''}`}>{done ? '' : ''}</div>
                  <span style={done ? {} : { color: '#aaa' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: '14px', borderTop: '1px solid var(--card-border)' }}>
            <button type="submit" style={{ background: 'var(--red)', color: '#fff', borderRadius: '20px', padding: '11px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', textAlign: 'center', marginBottom: '8px', width: '100%', border: 'none', fontFamily: 'inherit' }}>Publish post</button>
            <button type="button" onClick={saveDraft} style={{ border: '1px solid var(--warm-border)', color: '#666', borderRadius: '20px', padding: '9px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', textAlign: 'center', width: '100%', background: 'transparent' }}>Save as draft</button>
            {feedback ? <div className="status-note" style={{ marginTop: '10px' }}>{feedback}</div> : null}
          </div>
        </div>
      </form>
    </div>
  );
}
