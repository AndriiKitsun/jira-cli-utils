#!/usr/bin/env node

import { input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import { getCommitMessage } from "../src/commands/get-commit-message.js";
import { getTimeLabel } from "../src/commands/get-time-label.js";
import { getCurrentUser, initJiraClient } from "../src/lib/jira-client.js";
import { getConfigEntry, loadAppConfig, setConfigEntry } from "../src/utils/config.util.js";

async function start() {
  try {
    await loadAppConfig();
    await resolveRequiredArgs();

    await initJiraClient();
    await verifyUser();

    const command = await promptCommand();
    await executeCommand(command);
  } catch (err) {
    console.log(chalk.red(err.message));
  }
}

async function resolveRequiredArgs() {
  let host = await getConfigEntry('host');
  let token = await getConfigEntry('token');

  if (!host) {
    host = await input({ message: "Provide Jira host name (e.g. 'jira.somehost.com'):", required: true });

    await setConfigEntry('host', host);
  } else {
    console.log(`Jira host: ${chalk.green(host)}`);
  }

  if (!token) {
    token = await password({
      message: "Provide Jira user token:", mask: true, validate: (value) => !!value
    });

    await setConfigEntry('token', token);
  } else {
    console.log(`User token: ${chalk.green("[REDACTED]")}`);
  }
}

async function verifyUser() {
  const user = await getCurrentUser();

  console.log(`Hello ${chalk.green(user.displayName)}`);
}

function promptCommand() {
  return select({
    message: "Select an option",
    loop: true,
    choices: [
      {
        name: "Generate TIME activity label",
        value: "timeLabel"
      },
      {
        name: "Generate commit message",
        value: "commitMessage"
      }
    ]
  });
}

function executeCommand(command) {
  switch (command) {
    case 'timeLabel':
      return getTimeLabel();
    case 'commitMessage':
      return getCommitMessage();
    default:
      throw new Error(`Unexpected command ${command}`);
  }
}

start();
