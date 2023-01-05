function getEmailAddressesFromPage() {
    console.log("Getting email addresses from field...");
    var htmlCollection = document.getElementsByClassName("tile-name");
    var arr = [].slice.call(htmlCollection);
    var mappedArr = arr.map(x => x.title);
    console.log(mappedArr);
    return mappedArr;
}

function getSubjectFromPage() {
    console.log("Getting subject from field...");
    var subjectVals = document.getElementsByClassName('subject');
    if (subjectVals.length > 0) {
        var subject = subjectVals[0].value;
        console.log("subject=" + subject);
        return subject;
    }
    return "";
}

function openMailProvider(emailAddresses, recipientField, subject, mailProvider) {
    chrome.runtime.sendMessage({
        emailAddresses: emailAddresses,
        recipientField: recipientField,
        subject: subject,
        mailProvider: mailProvider
    }, function(response) {
        console.log(response);
    });
}

function getSelectedMailProvider() {
    var ele = document.getElementsByName("emailProviderCopier");
      
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked) {
            return ele[i].value;
        }
    }

    return "gmail";
}

function sendMsg(recipientField) {
    // get all email addresses on the page
    var emailAddresses = getEmailAddressesFromPage();
    var subject = getSubjectFromPage();

    var emailProvider = getSelectedMailProvider();

    if (emailAddresses.length > 20 && recipientField != "bcc") {
        if (confirm("You are sending an email to or CC more than 20 people, are you sure you wish to do so or would you like to BCC instead?")) {
            openMailProvider(emailAddresses, recipientField, subject, emailProvider);
        }
    } else {
        openMailProvider(emailAddresses, recipientField, subject, emailProvider);
    }
}

function initMailProviders() {

    var mailProviders = [
        {
            "id": "gmailProviderCopier",
            "name": "gmail",
            "label": "Gmail"
        },
        {
            "id": "yahooProviderCopier",
            "name": "yahoo",
            "label": "Yahoo!"
        },
        {
            "id": "mailtoProviderCopier",
            "name": "mailto",
            "label": "System-Default"
        },
    ];

    var emailCopierDiv = document.createElement("div");
    var paragraph = document.createElement("p");
    paragraph.innerHTML = "Please select an email provider to use:";
    emailCopierDiv.appendChild(paragraph);

    // select gmail or mailto
    mailProviders.forEach(
        provider => {
            var radioButton = document.createElement("input");
            radioButton.setAttribute("type", "radio");
            radioButton.setAttribute("id", provider.id);
            radioButton.setAttribute("name", "emailProviderCopier");
            radioButton.setAttribute("value", provider.name);
            radioButton.style.float = "left";

            var label = document.createElement("label");
            label.setAttribute("for", provider.id);
            label.innerHTML = provider.label;
            label.style.float = "left";
            label.style.padding = "0px 1em 0px 8px";

            emailCopierDiv.appendChild(radioButton);
            emailCopierDiv.appendChild(label);
            emailCopierDiv.appendChild(document.createElement("br"));
            emailCopierDiv.appendChild(document.createElement("br"));
        }
    );

    return emailCopierDiv;
}


const init = function() {
    var emailCopierDiv = initMailProviders();

    var sendToButton = document.createElement("button");
    sendToButton.innerHTML = "Send To Recipients";
    sendToButton.onclick = () => sendMsg("to");
    emailCopierDiv.appendChild(sendToButton);

    var sendCCButton = document.createElement("button");
    sendCCButton.innerHTML = "Send CC Recipients";
    sendCCButton.onclick = () => sendMsg("cc");
    emailCopierDiv.appendChild(sendCCButton);

    var sendBCCButton = document.createElement("button");
    sendBCCButton.innerHTML = "Send BCC Recipients";
    sendBCCButton.onclick = () => sendMsg("bcc");
    emailCopierDiv.appendChild(sendBCCButton);

    document.body.appendChild(emailCopierDiv);
};

init();
