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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get('input')

const progressBar = document.querySelector('.progress-bar');
var progressBarValue = 1;


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

function remake() {
  network = new vis.Network(container, data, options);
}


function pushDepth1Node(id, value, label) {
  nodes.push({
    "id": id,
    "value": Math.log(value)*3,
    "label": label
  });
}

function pushDepth1Edge(from, to, value) {
  edges.push({
    "from": from,
    "to": to,
    "value": Math.log(value)*1.5
  });
}

function pushDetph2Node(id, value, label) {
  nodes.push({
    "id": id,
    "value": Math.log(value),
    "label": label
  })
}

function pushDetph2Edge(from, to, value, color) {
  edges.push({
    "from": from,
    "to": to,
    "value": Math.log(value),
    "color": color
  })
}


async function fetchUserFreind(userName) {
  var url = "https://lol-network-api-dev.azurewebsites.net/friend/"+userName;
  response = await fetch(url)
  return response.json()
}

async function drawDepth2Node(userName, userNameList, i) {
  var friendName = userNameList[i];
  let userInfo = await fetchUserFreind(friendName)
  nodes[i]['image'] = userInfo['profileImage'];
      
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
      pushDepth2Node(nickName, friend[j][nickName], nickName)
      nodeName.push(nickName);
    }

    var commonEdge = edges.filter(
      function(edges) {
        return edges["to"] == friends[i] && edges["from"] == nickName
      }
    )
    if (commonEdge.length == 0) {
      pushDetph2Edge(friendName, nickName, freind[j][nickName], randomColor)
    }
  }

  // modified network
  nodes[0]["value"] *= Math.log(nodeName.length)/2;
  for (var j=1; j<friends.length+1; j++) {
    nodes[j]["value"] *= Math.log(nodeName.length)/2;
  }

  progressBarValue += 100/(userNameList.length+1);
  console.log(progressBarValue);
  progressBar.style.width = String(progressBarValue)+'%';
  
  if (progressBarValue > 100) {
    document.querySelector('.progress').style.display = "none";
    document.querySelector('.progress-text').style.display = "none";
  }
  
  drawNetwork(nodes, edges)
}


async function draw(userName) {
  var inpData = await fetchUserFreind(userName);

  if (inpData["result"] == "no-summoner") {
    document.getElementById('loading').style.display = "none";
    alert("해당 소환사의 정보가 없습니다. 닉네임을 다시 확인해주세요.");
  }

  friends = [];
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
    nodeName.push(nickName);
    pushDepth1Node(nickName, friend[i][nickName], nickName);
    pushDepth1Edge(userName, nickName, friend[i][nickName])

    friends.push(nickName);
  }
  console.log(nodes, edges);
  drawNetwork(nodes, edges);
  document.getElementById('loading').style.display = "none";

  progressBarValue += 100/(friend.length+1);
  progressBar.style.width = String(progressBarValue)+'%';
    
  console.log(friends);
  for (var i=0; i<friends.length; i++) {
    drawDepth2Node(userName, friends, i)
  }
}


draw(userName);