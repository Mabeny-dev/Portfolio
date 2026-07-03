const githubStatsCache = {
  value: null,
  expiresAt: 0,
};

const getCacheTtlMs = () =>
  (Number(process.env.GITHUB_STATS_CACHE_MINUTES) || 5) * 60 * 1000;

const getCachedStats = () => {
  if (githubStatsCache.value && githubStatsCache.expiresAt > Date.now()) {
    return githubStatsCache.value;
  }

  return null;
};

export const getYearlyGitHubStats = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const shouldRefresh = req.query.refresh === "true";
    const cachedStats = shouldRefresh ? null : getCachedStats();
    if (cachedStats) {
      return res.json({ ...cachedStats, cached: true });
    }

    const token = process.env.GITHUB_TOKEN;

    // // Temporary Test
    // console.log("Using token:", !!token);
    // console.log("GitHub status:", response.status);
    // console.log("GitHub message:", data.message);

    const username = process.env.GITHUB_USERNAME || "Mabeny-dev";
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;
    const today = new Date().toISOString().split("T")[0];

    const query = new URLSearchParams({
      q: `author:${username} author-date:${startOfYear}..${today}`,
      per_page: "1",
    });
    const url = `https://api.github.com/search/commits?${query.toString()}`;
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response;

    try {
      response = await fetch(url, {
        headers,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub stats request failed:", response.status, data);

      if (githubStatsCache.value) {
        return res.json({ ...githubStatsCache.value, cached: true, stale: true });
      }

      return res.json({
        commitsThisYear: 0,
        year: currentYear,
        cached: false,
        unavailable: true,
      });
    }

    const stats = {
      commitsThisYear: data.total_count || 0,
      year: currentYear,
      lastFetchedAt: new Date().toISOString(),
    };

    githubStatsCache.value = stats;
    githubStatsCache.expiresAt = Date.now() + getCacheTtlMs();

    return res.json({ ...stats, cached: false });
  } catch (error) {
    console.error("GitHub stats error:", error);

    if (githubStatsCache.value) {
      return res.json({ ...githubStatsCache.value, cached: true, stale: true });
    }

    return res.json({
      commitsThisYear: 0,
      year: new Date().getFullYear(),
      cached: false,
      unavailable: true,
    });
  }
};
