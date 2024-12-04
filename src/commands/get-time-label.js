import chalk from "chalk";
import { getEpicIssueId } from "../lib/jira-client.js";
import { copyToClipboard } from "../utils/clipboard.util.js";
import { promptIssue } from "../utils/jira-client.util.js";

const epicLabelPattern = "EPIC <EPIC_ID>";
const ticketLabelPattern = "TICKET <TICKET_ID>";

export async function getTimeLabel() {
  const issueId = await promptIssue();
  console.log(`Issue ID: ${chalk.green(issueId.id)}`);

  const epicId = await getEpicIssueId(issueId.id);
  console.log(`Epic Issue ID: ${chalk.green(epicId)}`);

  const label = buildLabel(issueId.id, epicId);
  console.log(`TIME activity label: ${chalk.green(label)}`);

  await copyToClipboard(label);
  console.log("The label has been copied to the clipboard");
}

function buildLabel(issueId, epicId) {
  const tokens = [];

  if (epicId) {
    const epicToken = epicLabelPattern.replace('<EPIC_ID>', epicId);
    tokens.push(epicToken)
  }

  const issueToken = ticketLabelPattern.replace('<TICKET_ID>', issueId);
  tokens.push(issueToken);

  return tokens.join(' ');
}
