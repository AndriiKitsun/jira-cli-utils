import chalk from "chalk";
import { getIssue } from "../lib/index.js";
import { copyToClipboard, normalizeIssueTitle, promptIssue } from "../utils/index.js";

export async function getCommitMessage() {
  const issueId = await promptIssue();
  console.log(`Issue ID: ${chalk.green(issueId.id)}`);

  const issue = await getIssue(issueId.id);
  const title = normalizeIssueTitle(issue.fields.summary);

  const label = `${issueId.id}: ${title}`;
  console.log(`Commit message: ${chalk.green(label)}`,);

  await copyToClipboard(label);
  console.log("The message has been copied to the clipboard");
}
