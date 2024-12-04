import { input } from "@inquirer/prompts";

const issueNumberRegex = /[A-Z]{2,}-\d+/;

export async function promptIssue() {
  const issueStr = await input({ message: "Enter issue URL or ID", required: true });

  return extractIssueNumber(issueStr);
}

function extractIssueNumber(str) {
  const result = issueNumberRegex.exec(str);
  const issueId = result?.[0];

  if (!issueId) {
    throw new Error("Issue number is invalid");
  }

  const [code, number] = issueId.split('-');

  return {
    id: issueId,
    code,
    number
  }
}
