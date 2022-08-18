//checking for pagAction request
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.todo == "showPageAction") {
//         chrome.tabs.query({
//             active: true,
//             currentWindow: true
//         }, function (tabs) {
//             //chrome.action.show(tabs[0].id);
//         });
//     }
// });


/* request to toggle slider whenever extension icon clicked
 */
chrome.action.onClicked.addListener(function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            todo: "toggle"
        });
    })
});