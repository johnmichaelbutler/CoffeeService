interface ProcessEnv {
    [key: string]: string | undefined;
}
declare const envVarChecker: (env: ProcessEnv) => string[];
export default envVarChecker;
