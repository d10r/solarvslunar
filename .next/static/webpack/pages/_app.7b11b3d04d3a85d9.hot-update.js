"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./src/configuration/network.ts":
/*!**************************************!*\
  !*** ./src/configuration/network.ts ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wagmi/chains */ \"./node_modules/wagmi/dist/chains.js\");\n\nconst network = {\n    ...wagmi_chains__WEBPACK_IMPORTED_MODULE_0__.polygonMumbai,\n    rpcUrls: {\n        ...wagmi_chains__WEBPACK_IMPORTED_MODULE_0__.polygonMumbai.rpcUrls,\n        alchemy: {\n            http: [\n                \"https://polygon-mumbai.g.alchemy.com/v2/alRa1D4oh5918OM3zmfCark4vdYjMbas\"\n            ]\n        }\n    },\n    subgraphUrl: \"https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai\",\n    cashToken: \"0xb891d8559feb358f4651745aaaBFe97067b3bF81\",\n    armyToken: \"0x6C357412329f9a3EE07017Be93ed0aC551faa77b\",\n    hillAddress: \"0x75ef7C347652f3a4232a0C6f6b9b26492E2E0A94\",\n    // new data to be used: \n    token: \"\",\n    contractAddress: \"\"\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object.freeze(network));\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29uZmlndXJhdGlvbi9uZXR3b3JrLnRzLmpzIiwibWFwcGluZ3MiOiI7O0FBQXNDO0FBRXRDLE1BQU1DLFVBQVU7SUFDZCxHQUFHRCx1REFBbUI7SUFDdEJHLFNBQVM7UUFDUCxHQUFHSCwrREFBMkI7UUFDOUJJLFNBQVM7WUFDUEMsTUFBTTtnQkFDSjthQUNEO1FBQ0g7SUFDRjtJQUNBQyxhQUFjO0lBQ2RDLFdBQVc7SUFDWEMsV0FBVztJQUNYQyxhQUFhO0lBQ2Isd0JBQXdCO0lBQ3hCQyxPQUFPO0lBQ1BDLGlCQUFpQjtBQUVuQjtBQUVBLCtEQUFlQyxPQUFPQyxNQUFNLENBQUNaLFFBQVFBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbmZpZ3VyYXRpb24vbmV0d29yay50cz84N2NjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoYWluIGZyb20gXCJ3YWdtaS9jaGFpbnNcIjtcclxuXHJcbmNvbnN0IG5ldHdvcmsgPSB7XHJcbiAgLi4uY2hhaW4ucG9seWdvbk11bWJhaSxcclxuICBycGNVcmxzOiB7XHJcbiAgICAuLi5jaGFpbi5wb2x5Z29uTXVtYmFpLnJwY1VybHMsXHJcbiAgICBhbGNoZW15OiB7XHJcbiAgICAgIGh0dHA6IFtcclxuICAgICAgICBcImh0dHBzOi8vcG9seWdvbi1tdW1iYWkuZy5hbGNoZW15LmNvbS92Mi9hbFJhMUQ0b2g1OTE4T00zem1mQ2FyazR2ZFlqTWJhc1wiLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHN1YmdyYXBoVXJsOiBgaHR0cHM6Ly9hcGkudGhlZ3JhcGguY29tL3N1YmdyYXBocy9uYW1lL3N1cGVyZmx1aWQtZmluYW5jZS9wcm90b2NvbC12MS1tdW1iYWlgLFxyXG4gIGNhc2hUb2tlbjogXCIweGI4OTFkODU1OWZlYjM1OGY0NjUxNzQ1YWFhQkZlOTcwNjdiM2JGODFcIixcclxuICBhcm15VG9rZW46IFwiMHg2QzM1NzQxMjMyOWY5YTNFRTA3MDE3QmU5M2VkMGFDNTUxZmFhNzdiXCIsXHJcbiAgaGlsbEFkZHJlc3M6IFwiMHg3NWVmN0MzNDc2NTJmM2E0MjMyYTBDNmY2YjliMjY0OTJFMkUwQTk0XCIsXHJcbiAgLy8gbmV3IGRhdGEgdG8gYmUgdXNlZDogXHJcbiAgdG9rZW46IFwiXCIsXHJcbiAgY29udHJhY3RBZGRyZXNzOiBcIlwiLFxyXG5cclxufSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUobmV0d29yayk7XHJcbiJdLCJuYW1lcyI6WyJjaGFpbiIsIm5ldHdvcmsiLCJwb2x5Z29uTXVtYmFpIiwicnBjVXJscyIsImFsY2hlbXkiLCJodHRwIiwic3ViZ3JhcGhVcmwiLCJjYXNoVG9rZW4iLCJhcm15VG9rZW4iLCJoaWxsQWRkcmVzcyIsInRva2VuIiwiY29udHJhY3RBZGRyZXNzIiwiT2JqZWN0IiwiZnJlZXplIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/configuration/network.ts\n"));

/***/ })

});