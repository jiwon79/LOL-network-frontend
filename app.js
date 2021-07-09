var nodes = null;
var edges = null;
var network = null;

var netwk;
function draw() {
  // create people.
  // value corresponds with the age of the person


  fetch("https://lol-network-api.herokuapp.com")
    .then((response) => response.json())
    .then((data) => {
      console.log(data)

      nodes = []
      var options = {
        layout: {
          randomSeed: 0
        },
        nodes: {
          borderWidth : 0,
          shape: "circularImage",
          image: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon1394.jpg?image=q_auto:best&v=1518361200',
          scaling: {
            customScalingFunction: function (min, max, total, value) {
              return value / total;
            },
            min: 5,
            max: 150,
          },
          font:{
            size : 20,
            border : 2,
          }
        },
        edges:{
          color : "#757575"
        },
      };
      
      data.node.forEach(element => {
        var temp = element
        temp.label = temp.id
        if(temp.label == '루모그래프'){
          temp.shape = 'circularImage';
          temp.image = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon4661.jpg?image=q_auto:best&v=1518361200';
        }
        nodes.push(temp);

      })


      edges = data.edge


      var container = document.getElementById("mynetwork");
      var data = {
        nodes: nodes,
        edges: edges,
      };
      network = new vis.Network(container, data, options);
      netwk = network;
    });
}

window.addEventListener("load", () => {
  draw();
  setTimeout(function() {
    console.log(netwk);

  }, 3000);
});