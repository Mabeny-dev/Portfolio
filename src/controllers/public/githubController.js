export const getYearlyGitHubStats = async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
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

    const response = await fetch(url, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub stats request failed:", response.status, data);
      return res.status(response.status).json({
        error: data.message || "Failed to fetch commit stats",
      });
    }

    return res.json({
      commitsThisYear: data.total_count || 0,
      year: currentYear,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch commit stats" });
  }
};
