import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client";
import TopNav from "./components/TopNav";
import CreatePostScreen from "./screens/CreatePostScreen";
import ForYouScreen from "./screens/ForYouScreen";
import LandingScreen from "./screens/LandingScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";

const TABS = [
  { key: "landing", label: "Landing page", tabLabel: "Landing", num: "01", desc: "Hero, featured post, masonry feed & topic browser" },
  { key: "post", label: "Post detail", tabLabel: "Post detail", num: "02", desc: "Article reading experience with specs, prose, comments & sidebar" },
  { key: "profile", label: "User profile", tabLabel: "Profile", num: "03", desc: "Author page, garage, badges, activity & masonry posts" },
  { key: "create", label: "Create post", tabLabel: "Create post", num: "04", desc: "Rich text editor, image upload, specs, tags & publish checklist" },
  { key: "for-you", label: "For you page", tabLabel: "For you", num: "05", desc: "Algorithmic feed with interest toggles, reason labels & trending sidebar" },
];

function findPrimaryUser(users) {
  return users.find((user) => user.handle === "@alexk_builds") || users[0] || null;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("landing");
  const [users, setUsers] = useState([]);
  const [landingData, setLandingData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [profileDetail, setProfileDetail] = useState(null);
  const [interest, setInterest] = useState(["Porsche", "Restoration", "Italian classics"]);
  const [forYouData, setForYouData] = useState(null);
  const [error, setError] = useState("");

  const primaryUser = useMemo(() => findPrimaryUser(users), [users]);
  const activeTabMeta = useMemo(
    () => TABS.find((tab) => tab.key === activeTab) || TABS[0],
    [activeTab]
  );

  const loadBootstrap = async () => {
    try {
      const [usersResult, landingResult, postsResult] = await Promise.all([
        api.users(),
        api.landing(),
        api.posts(),
      ]);

      setUsers(usersResult.users || []);
      setLandingData(landingResult);
      setPosts(postsResult.posts || []);

      const firstPostId = postsResult.posts?.[0]?.id || null;
      const alexId =
        usersResult.users?.find((user) => user.handle === "@alexk_builds")?.id ||
        usersResult.users?.[0]?.id ||
        null;

      setSelectedPostId(firstPostId);
      setSelectedUserId(alexId);

      if (firstPostId) {
        const detail = await api.postDetail(firstPostId);
        setPostDetail(detail);
      }
      if (alexId) {
        const profile = await api.profile(alexId);
        setProfileDetail(profile);
        const fy = await api.forYou(alexId, interest);
        setForYouData(fy);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load data.");
    }
  };

  useEffect(() => {
    loadBootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedPostId) return;
    api
      .postDetail(selectedPostId)
      .then(setPostDetail)
      .catch((err) => setError(err.message || "Failed to load post detail."));
  }, [selectedPostId]);

  useEffect(() => {
    if (!selectedUserId) return;
    api
      .profile(selectedUserId)
      .then(setProfileDetail)
      .catch((err) => setError(err.message || "Failed to load profile."));
  }, [selectedUserId]);

  useEffect(() => {
    if (!primaryUser) return;
    api
      .forYou(primaryUser.id, interest)
      .then(setForYouData)
      .catch((err) => setError(err.message || "Failed to load for-you feed."));
  }, [interest, primaryUser]);

  const handleCreate = async (payload) => {
    try {
      await api.createPost(payload);
      await loadBootstrap();
      setActiveTab("landing");
    } catch (err) {
      setError(err.message || "Failed to create post.");
    }
  };

  const handleInterestToggle = (label) => {
    setInterest((current) => {
      if (current.includes(label)) {
        return current.filter((item) => item !== label);
      }
      return [...current, label];
    });
  };

  const handleGotoCreate = () => setActiveTab("create");
  const handleGotoForYou = () => setActiveTab("for-you");
  const handleGotoPost = () => setActiveTab("post");

  const handleBackToFeed = () => setActiveTab("landing");

  return (
    <div className="app-shell">
      <TopNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="stage">
        <section className="screen-eyebrow">
          <div className="screen-num">{activeTabMeta.num}</div>
          <div className="screen-info">
            <div className="screen-name">{activeTabMeta.label}</div>
            <div className="screen-desc">{activeTabMeta.desc}</div>
          </div>
          <div className="screen-divider" />
        </section>

        {error ? <p className="error-text">Error: {error}</p> : null}

        <section className="mockup">
          {activeTab === "landing" ? (
            <LandingScreen
              data={landingData}
              onExplore={handleGotoForYou}
              onShare={handleGotoCreate}
              onNavigateReview={handleGotoPost}
            />
          ) : null}

          {activeTab === "post" ? (
            <PostDetailScreen
              posts={posts}
              selectedPostId={selectedPostId}
              onSelectPost={setSelectedPostId}
              detail={postDetail}
              onBack={handleBackToFeed}
            />
          ) : null}

          {activeTab === "profile" ? (
            <ProfileScreen
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              detail={profileDetail}
              onNavigateToTab={setActiveTab}
              onSelectPost={setSelectedPostId}
            />
          ) : null}

          {activeTab === "create" ? <CreatePostScreen users={users} onCreate={handleCreate} /> : null}

          {activeTab === "for-you" ? (
            <ForYouScreen
              interests={interest}
              onInterestChange={handleInterestToggle}
              data={forYouData}
              onNavigateToTab={setActiveTab}
              onSelectPost={setSelectedPostId}
            />
          ) : null}
        </section>
      </main>
      <footer className="sys-footer">
        <div className="sf-logo">Car<span>Geeks</span></div>
        <div className="sf-meta">UI System Preview &nbsp;·&nbsp; v1.0 &nbsp;·&nbsp; March 2026 &nbsp;·&nbsp; 5 screens &nbsp;·&nbsp; Playfair Display + DM Sans &nbsp;·&nbsp; #C0392B</div>
      </footer>
    </div>
  );
}
