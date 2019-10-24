var caseID = "";
var CurrentRequestID = "";
var load_indicator = document.createElement("IMG");
load_indicator.setAttribute("src", "img/loading.gif");

function parseResponse(myJson) {
  caseID = myJson.CaseData.CaseID;
  CurrentRequestID = myJson.RequestAndResponse.CurrentRequestID;
  if (typeof CurrentRequestID !== "undefined") {
    var CurrentRequestText = myJson.RequestAndResponse.CurrentRequestText;
    var ResponseList = myJson.RequestAndResponse.ResponseList;
    var options = "";
    for (var t in ResponseList) {
      options += `<option value='${ResponseList[t].Text}'>${ResponseList[t].Text}</option>"`;
    }
    var field_inline = "";
    if (ResponseList.length === 1) {
      field_inline = "display:none;";
    }

    document.getElementById(
      "response"
    ).innerHTML = `<div><div class='field-item'><label>Case ID</label><span>${caseID}</span></div><div class='field-item'><label>CurrentRequestID</label><span>${CurrentRequestID}</span></div><div class='form-el field-stacked'><label>${CurrentRequestText}</label><select style='${field_inline}' id='requestvalue'>${options}</select></div><div class='form-el field-stacked'><button class='form-el' onclick='submitAnswer()'>Continue</button></div><div>`;
  } else {
    var action = myJson.RequestAndResponse.Action;
    document.getElementById(
      "response"
    ).innerHTML = `<div><div class='field-item'><label>Case ID</label><span>${caseID}</span></div><div class='field-item'>Thank you - the request was completed - ${action}</div><div>`;
  }
}

function clearForm() {
  var elements = document.getElementsByClassName("form-el");
  Array.prototype.forEach.call(elements, function(el, i) {
    el.parentNode.removeChild(el);
  });
  document.getElementById("response").firstElementChild.appendChild(load_indicator);
}

async function startTroubleshooter() {
  document.getElementById("response").innerHTML = "<div>Please wait while we check your system....</div>";
  const phoneNumber = document.getElementById("phonenumber").value;
  const response = await fetch("/createcase", {
    method: "post",
    headers: {
      "Content-type": "text/json"
    },
    body: `{
        "AppID": "KNOCKOUT",
        "Inventory": {
            "ServiceID": "${phoneNumber}"
        }
    }`
  });
  const myJson = await response.json();
  parseResponse(myJson);
}

async function submitAnswer() {
  var chosenResponse = document.getElementById("requestvalue").value;
  clearForm();
  const response = await fetch("/submitflow", {
    method: "post",
    headers: {
      "Content-type": "text/json"
    },
    body: `{
        "CaseData":{
            "CaseID":"${caseID}"},
            "RequestAndResponse":{
                "CurrentRequestID":"${CurrentRequestID}",
                "ChosenResponse":"${chosenResponse}"
            }
        }`
  });
  const myJson = await response.json();
  parseResponse(myJson);
}
