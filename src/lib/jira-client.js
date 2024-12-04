import JiraApi from 'jira-client';
import { getConfigEntry } from "../utils/config.util.js";

let api = null;

export async function initJiraClient() {
  const host = await getConfigEntry('host');
  const token = await getConfigEntry('token');

  api = new JiraApi({
    protocol: 'https',
    host,
    bearer: token,
  });
}

export function getIssue(issueId) {
  return api.findIssue(issueId);
}

export async function getEpicIssueId(issueId) {
  const issue = await api.findIssue(issueId, 'editmeta');
  const metadata = issue.editmeta.fields;

  if (issue.fields.issuetype.name === "Epic") {
    return null;
  }

  for (const metaKey in metadata) {
    const meta = metadata[metaKey];

    if (meta.name.includes("Epic")) {
      return issue.fields[meta.fieldId];
    }
  }
}

export function getCurrentUser() {
  return api.getCurrentUser();
}
