export const getYearlyGitHubStats = async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const username = "Mabeny-dev";
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;
    const today = new Date().toISOString().split("T")[0];

    const url = `https://api.github.com/search/commits?q=author:Mabeny-dev+committer-date:${startOfYear}..${today}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    const data = await response.json();

    return res.json({
      commitsThisYear: data.total_count || 0,
      year: currentYear,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch commit stats" });
  }
};
