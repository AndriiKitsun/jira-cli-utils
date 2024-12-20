import { input } from "@inquirer/prompts";

const issueNumberRegex = /[A-Z]{2,}-\d+/;
const issueTitleRegex = /\[.*?]|\{.*?}|-/g;

export async function promptIssue() {
  const issueStr = await input({ message: "Enter issue URL or ID", required: true });

  return extractIssueNumber(issueStr);
}

export function normalizeIssueTitle(str) {
  const title = str.replace(issueTitleRegex, ' ').trim();

  return title.charAt(0).toUpperCase() + title.slice(1);
}

function extractIssueNumber(str) {
  const result = issueNumberRegex.exec(str);
  const issueId = result?.[0];

  if (!issueId) {
    throw new Error("Provided issue ID is invalid");
  }

  const [code, number] = issueId.split('-');

  return {
    id: issueId,
    code,
    number
  }
}
