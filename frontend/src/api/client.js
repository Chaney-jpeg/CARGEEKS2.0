const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  health: () => request("/health"),
  users: () => request("/users"),
  landing: () => request("/landing"),
  posts: () => request("/posts"),
  postDetail: (postId) => request(`/posts/${postId}`),
  profile: (userId) => request(`/profile/${userId}`),
  forYou: (userId, interest) => {
    const payload = Array.isArray(interest) ? interest.join(",") : interest;
    return request(`/for-you?userId=${encodeURIComponent(userId)}&interest=${encodeURIComponent(payload)}`);
  },
  createPost: (payload) =>
    request("/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  likePost: (postId) =>
    request(`/posts/${postId}/like`, {
      method: "POST",
    }),
  savePost: (postId) =>
    request(`/posts/${postId}/save`, {
      method: "POST",
    }),
  followUser: (userId) =>
    request(`/users/${userId}/follow`, {
      method: "POST",
    }),
  addComment: (postId, comment) =>
    request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
};
