var nodes = null;
var edges = null;
var visnodes = null;
var visedges = null;

var network = null;
var container = null;
var options = null;
var data = null;

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

function userEdge(userName) {
  var url = "https://lol-network-api.herokuapp.com/friend/"+userName;
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
  fetch("https://lol-network-api.herokuapp.com/friend/"+userName)
  .then((response) => response.json())
  .then((inpData) => {
    friends = [];
    friend = inpData.friend;
    nodeName = [userName];
    nodes = [{
      "id": userName,
      "value": friend.length*1.5,
      "image": inpData.profileImage,
      "label": userName
    }];
    edges = []
    
    for (var i=0; i<friend.length; i++) {
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
        "value": friend[i][nickName]
      });
      friends.push(nickName);
    }
    drawNetwork(nodes, edges)
    document.getElementById('loading').style.display = "none";
  })
  .then(async () => {
    console.log(friends);
    for (var i=0; i<friends.length; i++) {
      // draw edge from friends[i]
      var userInfo = await userEdge(friends[i]);
      console.log(userInfo);
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
        var nickName = Object.keys(friend[j])[0];
        if (!nodeName.includes(nickName) && userName.replaceAll(" ","")!=nickName.replaceAll(" ","")) {
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
            "value": friend[j][nickName],
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


// updated 2019
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const expand = () => {
  searchBtn.classList.toggle("close");
  input.classList.toggle("square");
};

searchBtn.addEventListener("click", expand);

function remake() {
  network = new vis.Network(container, data, options);
}

function contactForm() {
  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    // generate a five digit number for the contact_number variable
    this.contact_number.value = Math.random() * 100000 | 0;
    // these IDs from the previous steps

    emailjs.sendForm('service_0gal12i', 'template_wqvlu05', this)
      .then(function () {
        console.log('SUCCESS!');
        document.getElementById('name').value = "";
        document.getElementById('email').value = "";
        document.getElementById('message').value = "";

      }, function (error) {
        console.log('FAILED...', error);
      });
  });
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get('input')

window.addEventListener("load", () => {
  if (userName != null) {
    document.querySelector(".footer").style.position = "relative";
    document.querySelector(".network__explain").style.display = "block";
    document.getElementById('search-content').style.display = "none";
    document.getElementById('mynetwork').style.display = "block";
    document.getElementById('contact-form').style.display = "block";
    document.getElementById('remake').style.display = "block";
    document.getElementById('loading').style.display = "block";

    contactForm();
    draw(userName);

  } else {
    document.getElementById('search-content').style.display = "block";
    document.querySelector(".network__explain").style.display = "none";
    document.getElementById('loading').style.display = "none";
    document.getElementById('mynetwork').style.display = "none";
    document.getElementById('contact-form').style.display = "none";
    document.getElementById('remake').style.display = "none";
  }
});