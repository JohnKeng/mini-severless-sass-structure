const vm = require('vm');

/**
 * 根據提供的函數列表和模組名稱運行函數模組。
 * @param {Object} functionList - 函數列表。
 * @param {string} moduleName - 要運行的模組名稱。
 * @returns {*} 從函數模組導出的模組。
 */
function runFunctionModule(functionList, moduleName) {
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
            __require: customRequire,  // 確保 __require 函數在上下文中
            module: { exports: {} },
        };

        const wrappedCode = `
            const require = (name) => {
                return __require(name);
            };

            ${code}
        `;

        const script = new vm.Script(wrappedCode, { filename: `${name}.vm` });
        script.runInNewContext(ctx);

        functionModuleCache.set(name, ctx.module.exports);
        return ctx.module.exports;
    }

    return buildFunctionModule(moduleName);
}

module.exports = {
    runFunctionModule,
};
