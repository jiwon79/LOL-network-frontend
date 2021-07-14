var nodes = null;
var edges = null;
var visnodes = null;
var visedges = null;

var network = null;
var container = null;
var options = null;
var data = null;


function draw() {

  fetch("https://lol-network-api.herokuapp.com/")
    .then((response) => response.json())
    .then((inpData) => {
      console.log(inpData)
      nodes = []
      options = {
        layout: {
          // randomSeed: 0
        },
        nodes: {
          borderWidth: 0,
          shape: "circularImage",
          image: 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon1394.jpg?image=q_auto:best&v=1518361200',
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
          color: "#757575"
        },
      };

      for (var i = 0; i < inpData.node.length; i++) {
        inpData.node[i].label = inpData.node[i].id;
        if (inpData.node[i].label == '루모그래프') {
          inpData.node[i].shape = 'circularImage';
          inpData.node[i].image = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon4661.jpg?image=q_auto:best&v=1518361200';
        }
      }
      nodes = inpData.node


      edges = inpData.edge


      container = document.getElementById("mynetwork");

      visnodes = new vis.DataSet(nodes);
      visedges = new vis.DataSet(edges);
      data = {
        nodes: visnodes,
        edges: visedges,
      };
      console.log(edges)
      network = new vis.Network(container, data, options);



    });
}

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
      }, function (error) {
        console.log('FAILED...', error);
      });
  });
}
window.addEventListener("load", () => {
  contactForm()
  draw();
  setTimeout(function () {

    edges.push({
      from: "new",
      value: 10,
      to: "꿀벌지민"
    })
    edges.push({
      from: "new",
      value: 20,
      to: "마리마리착마리"
    })


    edges.push({
      from: "new2",
      value: 10,
      to: "new"
    })
    edges.push({
      from: "new2",
      value: 20,
      to: "마리마리착마리"
    })

    edges.push({
      from: "new2",
      value: 30,
      to: "리듬타지마"
    })

    nodes.push({
      label: 'new',
      id: 'new',
    })
    nodes.push({
      label: 'new2',
      id: 'new2',
    })
    visedges.update(edges)
    visnodes.update(nodes)
    // netwk.selectNodes([updatedIds[0]]);
    // netwk.editNode();
  }, 8000)
});