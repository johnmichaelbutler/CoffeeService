interface ProcessEnv {
  [key: string]: string | undefined
}

const envVarChecker = (env: ProcessEnv) => {
  const required = ['DYNAMODB_TABLE', 'EVENT_BUS'];
  const missing: string[] = [];

  required.forEach((reqVar => {
    if(!env[reqVar]) {
      missing.push(reqVar);
    }
  }));

  return missing;
};

export default envVarChecker;