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

/***/ "./src/context/GameContext.tsx":
/*!*************************************!*\
  !*** ./src/context/GameContext.tsx ***!
  \*************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useGameContext\": function() { return /* binding */ useGameContext; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"../../../opt/homebrew/lib/node_modules/next/node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ethers */ \"./node_modules/ethers/lib.esm/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"../../../opt/homebrew/lib/node_modules/next/node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _configuration_network__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../configuration/network */ \"./src/configuration/network.ts\");\n/* harmony import */ var _redux_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../redux/store */ \"./src/redux/store.ts\");\n\nvar _s = $RefreshSig$(), _s1 = $RefreshSig$();\n\n\n\n\nconst GameContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nconst GameContextProvider = (param)=>{\n    let { children  } = param;\n    _s();\n    /*\r\n    The game contract is:\r\n    - Receiving all the streams. Use Subgraph to calculate the sum\r\n    - Call it \"totalIncome\"\r\n\r\n    Hill is the contract\r\n    - Hill is receiving all the streams\r\n\r\n    While CashToken is the token we're using \r\n\r\n  \r\n    Looks like armyFlowRate can be used as a basis to poll the contract for the current gamble size\r\n\r\n  */ const kingRequest = _redux_store__WEBPACK_IMPORTED_MODULE_3__.rpcApi.useGetActiveKingQuery();\n    const [armyFlowRateTrigger, armyFlowRateRequest] = _redux_store__WEBPACK_IMPORTED_MODULE_3__.rpcApi.useLazyGetArmyFlowRateQuery();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        armyFlowRateTrigger();\n        setInterval(()=>{\n            armyFlowRateTrigger();\n        }, 10000);\n    }, [\n        armyFlowRateTrigger\n    ]);\n    const hillTreasureSnapshotQuery = _redux_store__WEBPACK_IMPORTED_MODULE_3__.subgraphApi.useAccountTokenSnapshotQuery({\n        chainId: _configuration_network__WEBPACK_IMPORTED_MODULE_2__[\"default\"].id,\n        id: \"\".concat(_configuration_network__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hillAddress, \"-\").concat(_configuration_network__WEBPACK_IMPORTED_MODULE_2__[\"default\"].cashToken)\n    });\n    const contextValue = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{\n        return {\n            king: kingRequest.data,\n            armyFlowRate: armyFlowRateRequest.data ? ethers__WEBPACK_IMPORTED_MODULE_4__.BigNumber.from(armyFlowRateRequest.data) : undefined,\n            treasureSnapshot: hillTreasureSnapshotQuery.data\n        };\n    }, [\n        kingRequest.data,\n        armyFlowRateRequest.data,\n        hillTreasureSnapshotQuery.data\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(GameContext.Provider, {\n        value: contextValue,\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/xiko/solarvslunar/src/context/GameContext.tsx\",\n        lineNumber: 73,\n        columnNumber: 5\n    }, undefined);\n};\n_s(GameContextProvider, \"bg05TzI9YStGyYjRalbgOoHh7gM=\", false, function() {\n    return [\n        _redux_store__WEBPACK_IMPORTED_MODULE_3__.rpcApi.useGetActiveKingQuery,\n        _redux_store__WEBPACK_IMPORTED_MODULE_3__.rpcApi.useLazyGetArmyFlowRateQuery,\n        _redux_store__WEBPACK_IMPORTED_MODULE_3__.subgraphApi.useAccountTokenSnapshotQuery\n    ];\n});\n_c = GameContextProvider;\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameContextProvider);\nconst useGameContext = ()=>{\n    _s1();\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(GameContext);\n};\n_s1(useGameContext, \"gDsCjeeItUuvgOWf1v4qoK9RF6k=\");\nvar _c;\n$RefreshReg$(_c, \"GameContextProvider\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dC9HYW1lQ29udGV4dC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDbUM7QUFRcEI7QUFHZ0M7QUFDTTtBQU9yRCxNQUFNUSw0QkFBY1Asb0RBQWFBLENBQW1CLElBQUk7QUFFeEQsTUFBTVEsc0JBQTZDLFNBQWtCO1FBQWpCLEVBQUVDLFNBQVEsRUFBRTs7SUFFOUQ7SUFpQkEsTUFBTSxDQUFDRztJQUdQVixVQUFVLElBQU07UUFDZFU7O1lBR0VBO1FBQ0YsR0FBRzs7UUFDREE7OztRQUdGTSxTQUFTZCxRQUFRZSxFQUFFOztJQUVyQjtJQUVBLE1BQU1HLGVBQWVuQixRQUFRLElBQU07b0RBQ2pDLEVBQU87WUFDTG9CLE1BQU1iLFlBQVljO1lBQ2xCQztZQUdBRyxrQkFBa0JaO1FBQ3BCO0lBQ0YsR0FBRztRQUNETixZQUFZYyxJQUFJOztRQUVoQlIsMEJBQTBCUSxJQUFJO0tBQy9CO0lBRUQsNEZBQ0dqQixJQUFZc0IsUUFBUTs7a0JBQXVCcEIsT0FBQUEsOENBQUFBOzs7Ozs7QUFFaEQ7R0FwRE1EOztRQWtCZ0JILE9BQU9NOztRQVlPTCxZQUFZVyxLQUFBQSw2REFBQUE7OztLQTlCMUNUO0FBc0ROLGVBQWVBLG9CQUFvQjtBQUVuQyxPQUFPLE1BQU11Qjs7SUFBdUI5QixHQUFBQSxTQUFBQTtBQUFzQixFQUFFO0lBQS9DOEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbnRleHQvR2FtZUNvbnRleHQudHN4P2M4YTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNjb3VudFRva2VuU25hcHNob3QgfSBmcm9tIFwiQHN1cGVyZmx1aWQtZmluYW5jZS9zZGstY29yZVwiO1xyXG5pbXBvcnQgeyBCaWdOdW1iZXIgfSBmcm9tIFwiZXRoZXJzXCI7XHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlQ29udGV4dCxcclxuICBGQyxcclxuICBQcm9wc1dpdGhDaGlsZHJlbixcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZUVmZmVjdCxcclxuICB1c2VNZW1vLFxyXG59IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyB1c2VDb250cmFjdFJlYWQgfSBmcm9tIFwid2FnbWlcIjtcclxuaW1wb3J0IEtpbmdPZlRoZUhpbGxBQkkgZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vS2luZ09mVGhlSGlsbEFCSVwiO1xyXG5pbXBvcnQgbmV0d29yayBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9uZXR3b3JrXCI7XHJcbmltcG9ydCB7IHJwY0FwaSwgc3ViZ3JhcGhBcGkgfSBmcm9tIFwiLi4vcmVkdXgvc3RvcmVcIjtcclxuXHJcbmludGVyZmFjZSBHYW1lQ29udGV4dFZhbHVlIHtcclxuICBraW5nPzogc3RyaW5nO1xyXG4gIGFybXlGbG93UmF0ZT86IEJpZ051bWJlcjtcclxuICB0cmVhc3VyZVNuYXBzaG90OiBBY2NvdW50VG9rZW5TbmFwc2hvdCB8IG51bGwgfCB1bmRlZmluZWQ7XHJcbn1cclxuY29uc3QgR2FtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0PEdhbWVDb250ZXh0VmFsdWU+KG51bGwhKTtcclxuXHJcbmNvbnN0IEdhbWVDb250ZXh0UHJvdmlkZXI6IEZDPFByb3BzV2l0aENoaWxkcmVuPiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuXHJcbiAgLypcclxuICAgIFRoZSBnYW1lIGNvbnRyYWN0IGlzOlxyXG4gICAgLSBSZWNlaXZpbmcgYWxsIHRoZSBzdHJlYW1zLiBVc2UgU3ViZ3JhcGggdG8gY2FsY3VsYXRlIHRoZSBzdW1cclxuICAgIC0gQ2FsbCBpdCBcInRvdGFsSW5jb21lXCJcclxuXHJcbiAgICBIaWxsIGlzIHRoZSBjb250cmFjdFxyXG4gICAgLSBIaWxsIGlzIHJlY2VpdmluZyBhbGwgdGhlIHN0cmVhbXNcclxuXHJcbiAgICBXaGlsZSBDYXNoVG9rZW4gaXMgdGhlIHRva2VuIHdlJ3JlIHVzaW5nIFxyXG5cclxuICBcclxuICAgIExvb2tzIGxpa2UgYXJteUZsb3dSYXRlIGNhbiBiZSB1c2VkIGFzIGEgYmFzaXMgdG8gcG9sbCB0aGUgY29udHJhY3QgZm9yIHRoZSBjdXJyZW50IGdhbWJsZSBzaXplXHJcblxyXG4gICovXHJcblxyXG5cclxuICBjb25zdCBraW5nUmVxdWVzdCA9IHJwY0FwaS51c2VHZXRBY3RpdmVLaW5nUXVlcnkoKTtcclxuICBjb25zdCBbYXJteUZsb3dSYXRlVHJpZ2dlciwgYXJteUZsb3dSYXRlUmVxdWVzdF0gPVxyXG4gICAgcnBjQXBpLnVzZUxhenlHZXRBcm15Rmxvd1JhdGVRdWVyeSgpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgYXJteUZsb3dSYXRlVHJpZ2dlcigpO1xyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgYXJteUZsb3dSYXRlVHJpZ2dlcigpO1xyXG4gICAgfSwgMTAwMDApO1xyXG4gIH0sIFthcm15Rmxvd1JhdGVUcmlnZ2VyXSk7XHJcblxyXG4gIGNvbnN0IGhpbGxUcmVhc3VyZVNuYXBzaG90UXVlcnkgPSBzdWJncmFwaEFwaS51c2VBY2NvdW50VG9rZW5TbmFwc2hvdFF1ZXJ5KHtcclxuICAgIGNoYWluSWQ6IG5ldHdvcmsuaWQsXHJcbiAgICBpZDogYCR7bmV0d29yay5oaWxsQWRkcmVzc30tJHtuZXR3b3JrLmNhc2hUb2tlbn1gLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBjb250ZXh0VmFsdWUgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGtpbmc6IGtpbmdSZXF1ZXN0LmRhdGEsXHJcbiAgICAgIGFybXlGbG93UmF0ZTogYXJteUZsb3dSYXRlUmVxdWVzdC5kYXRhXHJcbiAgICAgICAgPyBCaWdOdW1iZXIuZnJvbShhcm15Rmxvd1JhdGVSZXF1ZXN0LmRhdGEpXHJcbiAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgIHRyZWFzdXJlU25hcHNob3Q6IGhpbGxUcmVhc3VyZVNuYXBzaG90UXVlcnkuZGF0YSxcclxuICAgIH07XHJcbiAgfSwgW1xyXG4gICAga2luZ1JlcXVlc3QuZGF0YSxcclxuICAgIGFybXlGbG93UmF0ZVJlcXVlc3QuZGF0YSxcclxuICAgIGhpbGxUcmVhc3VyZVNuYXBzaG90UXVlcnkuZGF0YSxcclxuICBdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxHYW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17Y29udGV4dFZhbHVlfT57Y2hpbGRyZW59PC9HYW1lQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZUNvbnRleHRQcm92aWRlcjtcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VHYW1lQ29udGV4dCA9ICgpID0+IHVzZUNvbnRleHQoR2FtZUNvbnRleHQpO1xyXG4iXSwibmFtZXMiOlsiQmlnTnVtYmVyIiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VNZW1vIiwibmV0d29yayIsInJwY0FwaSIsInN1YmdyYXBoQXBpIiwiR2FtZUNvbnRleHQiLCJHYW1lQ29udGV4dFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJraW5nUmVxdWVzdCIsInVzZUdldEFjdGl2ZUtpbmdRdWVyeSIsImFybXlGbG93UmF0ZVRyaWdnZXIiLCJhcm15Rmxvd1JhdGVSZXF1ZXN0IiwidXNlTGF6eUdldEFybXlGbG93UmF0ZVF1ZXJ5Iiwic2V0SW50ZXJ2YWwiLCJoaWxsVHJlYXN1cmVTbmFwc2hvdFF1ZXJ5IiwidXNlQWNjb3VudFRva2VuU25hcHNob3RRdWVyeSIsImNoYWluSWQiLCJpZCIsImhpbGxBZGRyZXNzIiwiY2FzaFRva2VuIiwiY29udGV4dFZhbHVlIiwia2luZyIsImRhdGEiLCJhcm15Rmxvd1JhdGUiLCJmcm9tIiwidW5kZWZpbmVkIiwidHJlYXN1cmVTbmFwc2hvdCIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VHYW1lQ29udGV4dCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/context/GameContext.tsx\n"));

/***/ })

});