var friendsMatch =  /<span class="text">(.*?)<\/span>/g;
function getUserNamesFromFriends(data) {
  var reg = friendsMatch;
  var hits = data.match(reg);
  for(i=0; i<hits.length;i++){
    hits[i]=
      hits[i]
      .replace("<span class=\"text\">", "")
      .replace("</span>", "")
      .replace(/\(.*?\)/, "");       
  }
  Logger.log(hits);
  return hits;
}


var groupMatch = /role=\"button\">(.*?)<\/a>/g;
function getUserNamesFromGroup(data) {
  const groupNamePattern = /href=".\/(.+?)_files\//;
  var names = data.match(groupNamePattern);
  var groupName = names[0]
    .replace("href=\"./", "")
    .replace("_files/", "");
    
  Logger.log("group name = " + groupName);
  var reg = groupMatch;  
  var hits = data.match(reg);
  var result = [];  
  result.push("グループ【" + groupName + "】のメンバー一覧");
  for(i=0; i<hits.length;i++){
    hits[i]=
      hits[i]
      .replace("role=\"button\">", "")
      .replace("<\/a>", "")
//      .replace(/<img.*>/, "")
      .replace(/<.*$/, "")
      .replace(/設定/, "")
      .replace(/最近/, "")
      .replace(/メッセージリクエスト/, "")
      .replace(/すべて既読にする/, "")
      .replace(/ポップアップを閉じて戻る/, "")
      .replace(/English.*/, "")
      .replace(/Español.*/, "")
      .replace(/Português.*/, "")
      .replace(/Français.*/, "")
      .replace(groupName, "")
      ;
    Logger.log(hits[i] + "len = " + hits[i].length);
    if(0 === hits[i].trim().length) continue;
    
    if(result.indexOf(hits[i]) < 0) {
       result.push(hits[i]);
    }
  }
  
  Logger.log(result);
  return result;
}


var groupChatMatch = /<div class="_4jeg">(.*?)<\/div>/g;
function getUserNamesFromGroupChat(data) {
  var reg = groupChatMatch;
  var hits = data.match(reg);
  var result = [];  
  for(i=0; i<hits.length;i++){
    hits[i]=
      hits[i]
      .replace("<div class=\"_4jeg\">", "")
      .replace("<\/div>", "")
      .replace(/<.*$/, "")
      ;       
    if(0 === hits[i].trim().length) continue;
    
    if(result.indexOf(hits[i]) < 0) {
       result.push(hits[i]);
    }
  }
  Logger.log(result);
  return result;
}


function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function test (){
  var formObject = new Object();
  formObject.myFile = DriveApp.getFileById("1X4EiJNtru4n-3rxQEo5NOZleFFzkBP8V");
  processForm(formObject);
}

function getNames(formObject) {
  var formBlob = formObject.myFile;
  var data = formBlob.getBlob().getDataAsString();
  
  var kind = formObject.fileKind;
//  var json = JSON.parse(data);
  Logger.log("kind:" + kind);
  var names = null;
//  if(data.match(friendsMatch)){
  if(kind === "friends"){
    Logger.log("This file is friends");
    names = getUserNamesFromFriends(data);
  }
//  else if(data.match(groupMatch)){
  else if(kind === "group"){
      Logger.log("This file is group");
    names = getUserNamesFromGroup(data);
  }
//  else if(data.match(groupChatMatch)){
  else if(kind === "groupchat"){
      Logger.log("This file is group chat");
    names = getUserNamesFromGroupChat(data);
  }
  
  else{
    return "";
  }
  
  var newText= names.join("\n");
  
  return newText;

}


function processForm(formObject) {
  var formBlob = formObject.myFile;
  var data = formBlob.getBlob().getDataAsString();
  
  var kind = formObject.fileKind;
//  var json = JSON.parse(data);
  Logger.log("kind:" + kind);
  var names = null;
//  if(data.match(friendsMatch)){
  if(kind === "friends"){
    Logger.log("This file is friends");
    names = getUserNamesFromFriends(data);
  }
//  else if(data.match(groupMatch)){
  else if(kind === "group"){
      Logger.log("This file is group");
    names = getUserNamesFromGroup(data);
  }
//  else if(data.match(groupChatMatch)){
  else if(kind === "groupchat"){
      Logger.log("This file is group chat");
    names = getUserNamesFromGroupChat(data);
  }
  
  else{
    return "";
  }
  
  var newText= names.join("\n");
  var driveFile = DriveApp.createFile(formBlob);
  driveFile.setContent(newText);

  
  return driveFile.getUrl();

}


