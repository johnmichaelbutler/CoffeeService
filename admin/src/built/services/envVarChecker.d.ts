interface ProcessEnv {
    [key: string]: string | undefined;
}
declare const envVarChecker: (env: ProcessEnv, fnName: string) => string[];
export default envVarChecker;
