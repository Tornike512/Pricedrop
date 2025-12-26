/** @type {import('semantic-release').Config} */
module.exports = {
  branches: ["main"], // Adjust if you're releasing from a different branch
  plugins: [
    "@semantic-release/commit-analyzer", // Determines version bump from commit messages
    "@semantic-release/release-notes-generator", // Builds changelog content from commits
    "@semantic-release/changelog", // Updates or creates CHANGELOG.md
    "@semantic-release/npm", // Updates package.json version
    [
      "@semantic-release/git", // Commits the changelog and version bump
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]",
      },
    ],
    "@semantic-release/github", // Publishes the release on GitHub
  ],
  preset: "conventionalcommits", // Use Conventional Commits for parsing
  tagFormat: "v${version}", // GitHub release tags like v1.2.3
};
