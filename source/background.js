chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var emailField = request.emailAddresses.join(',');
        var mailProvider = request.mailProvider;

        var mailUrl = '';
        
        if (mailProvider === "gmail") {
            mailUrl = 'https://mail.google.com/mail?view=cm&fs=1&'
            + request.recipientField + '=' + encodeURIComponent(emailField)
            + "&su=" + encodeURIComponent(request.subject);
        } else if (mailProvider === "yahoo") {
            mailUrl = 'https://compose.mail.yahoo.com/?'
            + request.recipientField + '=' + encodeURIComponent(emailField)
            + "&subject=" + encodeURIComponent(request.subject);
        } else {
            if (request.recipientField === "to") {
                mailUrl = 'mailto:' + encodeURIComponent(emailField)
                    + "?subject=" + encodeURIComponent(request.subject);
            } else {
                mailUrl = 'mailto:?'+ request.recipientField + '=' + encodeURIComponent(emailField)
                + "&subject=" + encodeURIComponent(request.subject);
            }
        }
        
        chrome.tabs.create({ url: mailUrl });
        sendResponse({url: gmailUrl, successCode: "sent"});
});