interface ProcessEnv {
  [key: string]: string | undefined
}

interface EnvVars {
  [key: string]: string[]
}

const envVarChecker = (env: ProcessEnv, fnName: string) => {
  const requiredEnvVars: EnvVars = {
      "handleEventsFunction" : ['DYNAMODB_TABLE', 'EVENT_BUS'],
      "pollSQSFunction" : ['EVENT_BUS', 'SQS_URL', 'DYNAMODB_TABLE'],
      "completeOrderFunction": ['EVENT_BUS']
    };
  const missing: string[] = [];

  const required = requiredEnvVars[fnName] as string[];

  required.forEach((reqVar => {
    if(!env[reqVar]) {
      missing.push(reqVar);
    }
  }));

  return missing;
};

export default envVarChecker;
