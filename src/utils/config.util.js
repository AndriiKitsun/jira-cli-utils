import keytar from 'keytar';

const serviceName = 'jira-utils';
const appConfig = new Map();

export function getConfigEntry(key) {
  if (!appConfig.has(key)) {
    return keytar.getPassword(serviceName, key);
  }

  return appConfig.get(key);
}

export async function setConfigEntry(key, value) {
  const valueToStore = typeof value !== 'string' ? value.toString() : value;

  await keytar.setPassword(serviceName, key, valueToStore);

  appConfig.set(key, value);
}

export async function clearConfig() {
  const credentials = await keytar.findCredentials(serviceName);

  for (let credential of credentials) {
    await keytar.deletePassword(serviceName, credential.account);
  }

  appConfig.clear();
}

export async function loadAppConfig() {
  if (!appConfig.size) {
    const credentials = await keytar.findCredentials(serviceName);

    for (const credential of credentials) {
      appConfig.set(credential.account, credential.password)
    }
  }
}

