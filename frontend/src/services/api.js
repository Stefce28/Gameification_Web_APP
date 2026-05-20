import {
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
const MOCK_STATE_KEY = "rewardHubMockState:v2";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createDefaultMockState() {
  return {
    users: clone(mockUsers),
    shopItems: clone(mockShopItems),
    purchases: clone(mockPurchases),
    pointHistory: clone(mockPointHistory),
    friendRequests: [],
  };
}

function readMockState() {
  if (!canUseStorage()) {
    return createDefaultMockState();
  }

  try {
    const stored = window.localStorage.getItem(MOCK_STATE_KEY);
    if (stored) {
      return { ...createDefaultMockState(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn("Could not read mock state:", error.message);
  }

  const initialState = createDefaultMockState();
  writeMockState(initialState);
  return initialState;
}

function writeMockState(state) {
  if (canUseStorage()) {
    window.localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("rewardHubMockStateChanged"));
  }
  return state;
}

function getStateUser(state, userId) {
  return state.users.find((user) => Number(user.id) === Number(userId)) || state.users.find((user) => user.role !== "ADMIN");
}

function getStateProfile(userId) {
  const state = readMockState();
  const user = getStateUser(state, userId);
  return {
    ...user,
    badges: mockUserBadges[user.id] || [],
  };
}

function getLegacyFriendRequestKey(requesterId, receiverId) {
  return `rewardHubFriendRequest:${requesterId}:${receiverId}`;
}

function hasLegacyFriendRequest(requesterId, receiverId) {
  return canUseStorage() && window.localStorage.getItem(getLegacyFriendRequestKey(requesterId, receiverId)) === "sent";
}

function setLegacyFriendRequest(requesterId, receiverId, value) {
  if (!canUseStorage()) {
    return;
  }

  const key = getLegacyFriendRequestKey(requesterId, receiverId);
  if (value) {
    window.localStorage.setItem(key, "sent");
  } else {
    window.localStorage.removeItem(key);
  }
}

function getPendingFriendRequest(state, requesterId, receiverId) {
  return state.friendRequests.find(
    (request) =>
      Number(request.requesterId) === Number(requesterId) &&
      Number(request.receiverId) === Number(receiverId) &&
      request.status === "PENDING",
  );
}

function applyMockPurchase(userId, shopItemId) {
  const state = readMockState();
  const user = getStateUser(state, userId);
  const shopItem = state.shopItems.find((item) => Number(item.id) === Number(shopItemId));

  if (!shopItem) {
    throw new Error("Shop item was not found.");
  }

  if (Number(shopItem.quantity) <= 0) {
    throw new Error("This reward is sold out.");
  }

  if (Number(user.currentPoints) < Number(shopItem.pricePoints)) {
    throw new Error("Not enough XP. Upload more research documents to unlock this reward.");
  }

  user.currentPoints = Number(user.currentPoints) - Number(shopItem.pricePoints);
  user.purchaseCount = Number(user.purchaseCount || 0) + 1;
  shopItem.quantity = Number(shopItem.quantity) - 1;

  const purchasedAt = new Date().toISOString();
  const purchase = {
    id: Date.now(),
    userId: Number(userId),
    username: user.username,
    shopItem: clone(shopItem),
    itemImage: shopItem.imageUrl || "/assets/game-mode-tile.png",
    pricePaid: shopItem.pricePoints,
    purchasedAt,
    expiresAt: shopItem.expirationDays
      ? new Date(Date.now() + shopItem.expirationDays * 24 * 60 * 60 * 1000).toISOString()
      : null,
    status: "ACTIVE",
  };

  state.purchases[userId] = [purchase, ...(state.purchases[userId] || [])];
  state.pointHistory[userId] = [
    {
      id: Date.now() + 1,
      userId: Number(userId),
      amount: -Number(shopItem.pricePoints),
      type: "SPENT",
      reason: `Purchase: ${shopItem.name}`,
      createdAt: purchasedAt,
    },
    ...(state.pointHistory[userId] || []),
  ];

  writeMockState(state);
  return purchase;
}

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
  return readMockState().users.filter((user) => user.role !== "ADMIN");
}

export async function getFriendRecommendations(userId) {
  const friends = await getFriends(userId);
  const state = readMockState();
  const pendingIds = state.friendRequests
    .filter((request) => Number(request.requesterId) === Number(userId) && request.status === "PENDING")
    .map((request) => Number(request.receiverId));
  const excludedIds = new Set([Number(userId), ...friends.map((friend) => Number(friend.id)), ...pendingIds]);
  return state.users.filter((user) => user.role !== "ADMIN" && !excludedIds.has(Number(user.id)));
}

export function getFriendshipStatus(requesterId, receiverId) {
  if (!requesterId || !receiverId || Number(requesterId) === Number(receiverId)) {
    return "SELF";
  }

  const acceptedFriends = mockFriends[requesterId] || [];
  if (acceptedFriends.some((friend) => Number(friend.id) === Number(receiverId))) {
    return "FRIENDS";
  }

  const state = readMockState();
  if (getPendingFriendRequest(state, requesterId, receiverId) || hasLegacyFriendRequest(requesterId, receiverId)) {
    return "REQUEST_SENT";
  }

  return "NONE";
}

export async function sendFriendRequest(requesterId, receiverId) {
  return withFallback(
    () =>
      request("/friends/request", {
        method: "POST",
        body: JSON.stringify({
          requesterId: Number(requesterId),
          receiverId: Number(receiverId),
        }),
      }),
    () => {
      const state = readMockState();
      let requestEntry = getPendingFriendRequest(state, requesterId, receiverId);

      if (!requestEntry) {
        requestEntry = {
          id: Date.now(),
          requesterId: Number(requesterId),
          receiverId: Number(receiverId),
          requester: getStateProfile(requesterId),
          receiver: getStateProfile(receiverId),
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };
        state.friendRequests = [requestEntry, ...state.friendRequests];
      }

      setLegacyFriendRequest(requesterId, receiverId, true);
      writeMockState(state);
      return requestEntry;
    },
  );
}

export async function cancelFriendRequest(requesterId, receiverId) {
  return withFallback(
    () =>
      request(`/friends/request`, {
        method: "DELETE",
        body: JSON.stringify({
          requesterId: Number(requesterId),
          receiverId: Number(receiverId),
        }),
      }),
    () => {
      const state = readMockState();
      state.friendRequests = state.friendRequests.filter(
        (request) =>
          !(
            Number(request.requesterId) === Number(requesterId) &&
            Number(request.receiverId) === Number(receiverId) &&
            request.status === "PENDING"
          ),
      );
      setLegacyFriendRequest(requesterId, receiverId, false);
      writeMockState(state);
      return { requesterId: Number(requesterId), receiverId: Number(receiverId), status: "CANCELLED" };
    },
  );
}

export async function getProfile(userId) {
  return withFallback(
    () => request(`/users/${userId}/profile`),
    () => getStateProfile(userId),
  );
}

export async function getPointHistory(userId) {
  return withFallback(
    () => request(`/users/${userId}/points/history`),
    () => readMockState().pointHistory[userId] || [],
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
  return withFallback(() => request("/shop/items"), () => readMockState().shopItems);
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
    () => readMockState().shopItems.find((item) => Number(item.id) === Number(itemId)) || readMockState().shopItems[0],
  );
}

export async function purchaseItem(userId, shopItemId) {
  return withFallback(
    () =>
      request("/shop/purchase", {
        method: "POST",
        body: JSON.stringify({ userId: Number(userId), shopItemId: Number(shopItemId) }),
      }),
    () => applyMockPurchase(userId, shopItemId),
  );
}

export async function getPurchases(userId) {
  return withFallback(
    () => request(`/users/${userId}/purchases`),
    () => readMockState().purchases[userId] || [],
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
