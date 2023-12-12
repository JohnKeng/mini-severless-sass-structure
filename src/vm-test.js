const { runFunctionModule } = require('./vm.js');

// 模擬從前端接收的 functionList
const functionList = {
    a: `
        const b = require('b');
        const func = () => b();
        module.exports = func;
    `,
    b: `
        module.exports = () => '歡迎來到 mini-serverless-sass-structure!';
    `
};

// 測試模塊 'a'
try {
    const result = runFunctionModule(functionList, 'a');
    console.log("Result:", result());  // 應該輸出: 歡迎來到 mini-serverless-sass-structure!
} catch (error) {
    console.error("Error running module:", error.message);
}
