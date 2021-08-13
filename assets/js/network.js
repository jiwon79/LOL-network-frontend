var nodes = null;
var edges = null;
var visnodes = null;
var visedges = null;

var network = null;
var container = null;
var options = null;
var data = null;

const DEPTH_LIMIT_1 = 15;
const DEPTH_LIMIT_2 = 8;
const COLOR = ["#FC9EBD", "#FFADC5", "#FFA9B0", "#FFCCCC", "#CCD1FF", "#A8C8F9", "#FFDDA6", "#B8F3B8"]

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get('input');
const depth = urlParams.get('depth');

const progressBar = document.querySelector('.progress-bar');
var progressBarValue = 1;

options = {
  layout: {
    // randomSeed: 0
  },
  nodes: {
    borderWidth: 0,
    shape: "circularImage",
    image: 'https://cdn-store.leagueoflegends.co.kr/images/v2/profileicons/4025.jpg',
    scaling: {
      customScalingFunction: function (min, max, total, value) {
        return value / total;
      },
      min: 5,
      max: 150,
    },
    font: {
      size: 20,
    }
  },
  edges: {
    color: "#CCD1FF"
  },
};

function remake() {
  network = new vis.Network(container, data, options);
}

function drawNetwork(nodes, edges) {
  container = document.getElementById("mynetwork");
  visnodes = new vis.DataSet(nodes);
  visedges = new vis.DataSet(edges);
  data = {
    nodes: visnodes,
    edges: visedges,
  };
  network = new vis.Network(container, data, options);
}

async function fetchUserFreind(userName) {
  var url = "https://lol-network-api.azurewebsites.net/friend/"+userName;
  try {
    response = await fetch(url)
    return response.json()
  } catch(error) {
    console.log(error)
    return error;
  }
}

function addProgressValue(addValue) {
  progressBarValue += addValue;
  progressBar.style.width = String(progressBarValue)+'%';
  console.log(progressBarValue);
  
  if (progressBarValue > 100) {
    document.querySelector('.progress').style.display = "none";
    document.querySelector('.progress-text').style.display = "none";
  }
}

async function drawDepth2Node(userName, friendNameList, i) {
  var friendName = friendNameList[i];
  let userInfo = await fetchUserFreind(friendName)
  console.log(userInfo);

  if (userInfo instanceof TypeError) {    
    addProgressValue(100/(friendNameList.length+1));
    return undefined;
  }
  nodes[i+1]['image'] = userInfo['profileImage'];
      
  friend = userInfo.friend;
  var randomColor = COLOR[Math.floor(Math.random() * COLOR.length)];      
  var count = 0

  for (var j=0; j<friend.length; j++) {
    if (count == DEPTH_LIMIT_2) {
      break;
    }
    var nickName = Object.keys(friend[j])[0];
    if (!nodeName.includes(nickName) && userName.replaceAll(" ","")!=nickName.replaceAll(" ","")) {
      count += 1;
      nodes.push({
        "id": nickName,
        "value": Math.log(friend[j][nickName]),
        "label": nickName
      })
      nodeName.push(nickName);
    }

    var commonEdge = edges.filter(
      function(edges) {
        return edges["to"] == friendNameList[i] && edges["from"] == nickName
      }
    )
    if (commonEdge.length == 0) {
      edges.push({
        "from": friendName,
        "to": nickName,
        "value": Math.log(friend[j][nickName]),
        "color": randomColor
      })
    }
  }

  // modified network
  nodes[0]["value"] *= Math.log(nodeName.length)/2;
  for (var j=1; j<friendNameList.length+1; j++) {
    nodes[j]["value"] *= Math.log(nodeName.length)/2;
  }

  addProgressValue(100/(friendNameList.length+1));
  drawNetwork(nodes, edges)
}


async function main(userName) {
  var inpData = await fetchUserFreind(userName);

  if (inpData["result"] == "no-summoner") {
    document.getElementById('loading').style.display = "none";
    alert("해당 소환사의 정보가 없습니다. 닉네임을 다시 확인해주세요.");
  }

  friendNameList = [];
  friend = inpData.friend;
  nodeName = [userName];
  nodes = [{
    "id": userName,
    "value": friend.length*1.3,
    "image": inpData.profileImage,
    "label": userName
  }];
  edges = []
  
  for (var i=0; i<Math.min(friend.length, DEPTH_LIMIT_1); i++) {
    var nickName = Object.keys(friend[i])[0];
    nodes.push({
      "id": nickName,
      "value": Math.log(friend[i][nickName])*3,
      "label": nickName
    });
    nodeName.push(nickName);
    edges.push({
      "from": userName,
      "to": nickName,
      "value": Math.log(friend[i][nickName])*1.5
    });
    friendNameList.push(nickName);
  }  

  document.getElementById('loading').style.display = "none";
  drawNetwork(nodes, edges)
  addProgressValue(100/(friendNameList.length+1)); 
  console.log(friendNameList);

  for (var i=0; i<friendNameList.length; i++) {
    drawDepth2Node(userName, friendNameList, i)
  }
}

main(userName);