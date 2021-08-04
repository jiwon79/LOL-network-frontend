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
const userName = urlParams.get('input')

const progressBar = document.querySelector('.progress-bar');

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

function userEdge(userName) {
  var url = "https://lol-network-api.azurewebsites.net/friend/"+userName;
  return fetch(url).then(function(response) {
    return response.json();
  })
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

function draw(userName) {
  fetch("https://lol-network-api.azurewebsites.net/friend/"+userName)
  .then((response) => response.json())
  .then((inpData) => {
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
      friends.push(nickName);
    }
    drawNetwork(nodes, edges)
    document.getElementById('loading').style.display = "none";
    progressBar.style.width = String(100/(friends.length+1))+'%';
  })
  .then(async () => {
    console.log(friends);
    for (var i=0; i<friends.length; i++) {
      // draw edge from friends[i]
      var userInfo = await userEdge(friends[i]);
      console.log(userInfo);
      progressBar.style.width = String(100*(i+2)/(friends.length+1))+'%';
      if (i==friends.length-1) {
        document.querySelector('.progress').style.display = "none";
        document.querySelector('.progress-text').style.display = "none";
      }
      var count = 0;

      function adjectionNode(element, index, array) {
        if (element['id'] == friends[i]) {
          return index;
        }
        return false;
      }
      index = nodes.findIndex(adjectionNode);
      nodes[index]['image'] = userInfo['profileImage'];
      
      friend = userInfo.friend;
      var randomColor = COLOR[Math.floor(Math.random() * COLOR.length)];
      
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
            return edges["to"] == friends[i] && edges["from"] == nickName
          }
        )
        if (commonEdge.length == 0) {
          edges.push({
            "from": friends[i],
            "to": nickName,
            "value": Math.log(friend[j][nickName]),
            "color": randomColor
          })
        }
      }
      // modified network
      nodes[0]["value"] *= Math.log(nodeName.length)/2;
      for (var j=1; j<friends.length+1; j++) {
        nodes[j]["value"] *= Math.log(nodeName.length)/2;
      }
      drawNetwork(nodes, edges)
    }
  });
}

draw(userName);