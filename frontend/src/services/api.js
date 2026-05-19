import {
  getMockProfile,
  mockBadges,
  mockFriends,
  mockPointHistory,
  mockPurchases,
  mockShopItems,
  mockUploads,
  mockUserBadges,
  mockUsers,
} from "../data/mockData.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "The server could not complete this request.";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function withFallback(apiCall, fallbackValue) {
  try {
    return await apiCall();
  } catch (error) {
    console.warn("Using mock data fallback:", error.message);
    return typeof fallbackValue === "function" ? fallbackValue() : fallbackValue;
  }
}

export function getLoginOptions() {
  return mockUsers.filter((user) => user.role !== "ADMIN");
}

export async function getProfile(userId) {
  return withFallback(
    () => request(`/users/${userId}/profile`),
    () => getMockProfile(userId),
  );
}

export async function getPointHistory(userId) {
  return withFallback(
    () => request(`/users/${userId}/points/history`),
    () => mockPointHistory[userId] || [],
  );
}

export async function getUserBadges(userId) {
  return withFallback(
    () => request(`/users/${userId}/badges`),
    () => mockUserBadges[userId] || [],
  );
}

export async function getAllBadges() {
  return withFallback(() => request("/badges"), mockBadges);
}

export async function getUserUploads(userId) {
  return withFallback(
    () => request(`/users/${userId}/document-events`),
    () => mockUploads.filter((upload) => Number(upload.userId) === Number(userId)),
  );
}

export async function getFriends(userId) {
  return withFallback(
    () => request(`/users/${userId}/friends`),
    () => mockFriends[userId] || [],
  );
}

export async function getFriendsFeed(userId) {
  return withFallback(
    () => request(`/feed/friends/${userId}?limit=30`),
    () => {
      const friendIds = (mockFriends[userId] || []).map((friend) => friend.id);
      return mockUploads.filter((upload) => friendIds.includes(Number(upload.userId)));
    },
  );
}

export async function getGlobalFeed() {
  return withFallback(() => request("/feed?limit=30"), mockUploads);
}

export async function getShopItems() {
  return withFallback(() => request("/shop/items"), mockShopItems);
}

export async function getShopItem(itemId) {
  return withFallback(
    async () => {
      // Backend currently exposes active shop items as a collection.
      // When GET /api/shop/items/{id} exists, replace this lookup with that direct call.
      const items = await request("/shop/items");
      const item = items.find((entry) => Number(entry.id) === Number(itemId));
      if (!item) {
        throw new Error("Shop item was not found.");
      }
      return item;
    },
    () => mockShopItems.find((item) => Number(item.id) === Number(itemId)) || mockShopItems[0],
  );
}

export async function purchaseItem(userId, shopItemId) {
  return request("/shop/purchase", {
    method: "POST",
    body: JSON.stringify({ userId: Number(userId), shopItemId: Number(shopItemId) }),
  });
}

export async function getPurchases(userId) {
  return withFallback(
    () => request(`/users/${userId}/purchases`),
    () => mockPurchases[userId] || [],
  );
}

export async function getLeaderboard() {
  const rows = await withFallback(
    () => request("/leaderboard"),
    () =>
      [...mockUsers]
        .sort((first, second) => second.totalEarnedPoints - first.totalEarnedPoints)
        .map((user, index) => ({
          rank: index + 1,
          userId: user.id,
          username: user.username,
          totalEarnedPoints: user.totalEarnedPoints,
          currentPoints: user.currentPoints,
        })),
  );

  // Backend leaderboard does not include badge counts yet, so the frontend enriches
  // display data by asking the badges endpoint for each visible user.
  return Promise.all(
    rows.map(async (row) => {
      const badges = await getUserBadges(row.userId);
      return { ...row, badgeCount: badges.length };
    }),
  );
}

export async function getPublicUser(userId) {
  const [profile, badges, uploads] = await Promise.all([
    getProfile(userId),
    getUserBadges(userId),
    getUserUploads(userId),
  ]);

  return {
    ...profile,
    badges,
    uploads,
  };
}

export async function getUserDetails(userId) {
  const [profile, badges, allBadges, pointHistory, uploads, purchases, friends] = await Promise.all([
    getProfile(userId),
    getUserBadges(userId),
    getAllBadges(),
    getPointHistory(userId),
    getUserUploads(userId),
    getPurchases(userId),
    getFriends(userId),
  ]);

  return {
    profile,
    badges,
    allBadges,
    pointHistory,
    uploads,
    purchases,
    friends,
  };
}
