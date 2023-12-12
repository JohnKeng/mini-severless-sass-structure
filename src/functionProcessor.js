const vm = require('vm');

function runFunctionModule(functionList, entryPoint) {
    const functionModuleCache = new Map();

    function buildFunctionModule(name) {
        if (functionModuleCache.has(name)) {
            return functionModuleCache.get(name);
        }

        const code = functionList[name];
        if (!code) {
            throw new Error(`Module ${name} not found`);
        }

        const customRequire = (specifier) => {
            if (functionModuleCache.has(specifier)) {
                return functionModuleCache.get(specifier);
            }
            if (functionList[specifier]) {
                return buildFunctionModule(specifier);
            }
            throw new Error(`Module ${specifier} not found in functionList`);
        };

        const ctx = {
            require: customRequire,
            module: { exports: {} },
            console: console  // 將 console 對象傳入 vm 以支持在模塊內部使用 console
        };

        const script = new vm.Script(code, { filename: `${name}.vm` });
        script.runInNewContext(ctx);

        functionModuleCache.set(name, ctx.module.exports);
        return ctx.module.exports;
    }

    try {
        const entryFunc = buildFunctionModule(entryPoint);
        const result = entryFunc();
        console.log(`Execution result of ${entryPoint}:`, result);
    } catch (error) {
        console.error(`Error executing ${entryPoint}:`, error.message);
    }
}

module.exports = {
    runFunctionModule,
};
