function ajout() {
  document.querySelector(".formmodal").classList.remove("closes");
}
function closemodal() {
  document.querySelector(".formmodal").classList.add("closes");
}

let formulaire = document.querySelector("form");
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();

  const nom = document.getElementById("nom");
  const role = document.getElementById("roles");
  const image = document.getElementById("image");
  const email = document.getElementById("email");
  const tele = document.getElementById("number");

  const rgxemail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const rgxtele = /^0[5-7]\d{8}$/;

  if (!nom.value.trim()) return alert("Le nom est obligatoire !");
  if (!role.value.trim()) return alert("Le rôle est obligatoire !");
  if (!image.value.trim()) return alert("La photo est obligatoire !");
  if (!email.value.trim()) return alert("L'email est obligatoire !");
  if (!rgxemail.test(email.value)) return alert("Email invalide !");
  if (!tele.value.trim()) return alert("Téléphone obligatoire !");
  if (!rgxtele.test(tele.value)) return alert("Numéro marocain invalide !");

  const experience = [];
  const parent = document.querySelectorAll(".experience-block");

  let erreurExperience = false;

  if (parent.length > 0) {
    parent.forEach((element, index) => {
      const company = element.querySelector(".exp-company");
      const company_role = element.querySelector(".exp-role");
      const datedebut = element.querySelector(".exp-from");
      const datefin = element.querySelector(".exp-to");

      if (
        company.value.trim() === "" ||
        company_role.value.trim() === "" ||
        datedebut.value.trim() === "" ||
        datefin.value.trim() === ""
      ) {
        alert("Tous les champs des expériences sont obligatoires !");
        erreurExperience = true;
        return;
      }

      const debut = new Date(datedebut.value);
      const fin = new Date(datefin.value);

      if (debut > fin) {
        alert("La date début doit être inférieure à la date fin !");
        erreurExperience = true;
        return;
      }

      experience.push({
        id: index + 1,
        company: company.value,
        company_role: company_role.value,
        datedebut: datedebut.value,
        datefin: datefin.value,
      });
    });
  }

  if (erreurExperience) {
    return;
  }

  let nextId;
  let attr = formulaire.getAttribute("index-edit");
  let membres = JSON.parse(localStorage.getItem("lesmembres")) || [];

  if (attr != null) {
    nextId = membres[attr].id;
  } else {
    nextId = membres.length > 0 ? membres[membres.length - 1].id + 1 : 1;
  }

  let Membre = {
    id: nextId,
    name: nom.value,
    role: role.value,
    image: photoPreview.src,
    email: email.value,
    telephone: tele.value,
    experience,
  };

  if (attr != null) {
    membres[attr] = Membre;
    formulaire.removeAttribute("index-edit");
  } else {
    membres.push(Membre);
  }
  localStorage.setItem("lesmembres", JSON.stringify(membres));

  formulaire.reset();
  document.querySelector(".formmodal").classList.add("closes");

  afficherMembres();
});

function ajoutexperience() {
  let parent = document.querySelector("#experience-container");
  let enfant = document.createElement("div");
  enfant.classList.add("experience-block");
  enfant.innerHTML = `
  <button onclick="sumpression(this)" class="btn-remove">remove</button>
    <label>Company:</label>
    <input type="text" class="exp-company" placeholder="Enter company">
    <label>Role:</label>
    <input type="text" class="exp-role" placeholder="Enter role">
    <label>From:</label>
    <input type="date" class="exp-from">
    <label>To:</label>
    <input type="date" class="exp-to"> `;
  parent.appendChild(enfant);
}

function sumpression(element) {
  const parent = element.closest(".experience-block");
  parent.remove();
}

function afficherMembres() {
  const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
  const container = document.querySelector(".containermembre");
  const titre = document.querySelector(".titre");
  container.textContent = "";

  membres.forEach((m) => {
    if (!m.assignedZone) {
      container.innerHTML += `
        <div class="membre" data-id="${m.id}">
          <div class="membre-photo" style="background-image: url('${m.image}');"></div>
          <div class="membre-info">
            <p><b>Nom :</b> ${m.name}</p>
            <p><b>Role :</b> ${m.role}</p>
          </div>
          <button class="edit-btn" onclick="modifiermembre(${m.id})">Modifier</button>
        </div>
      `;
    }

    titre.textContent = "";
  });
}

function modifiermembre(id) {
  ajout();
  const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
  const membre = membres[id];
  document.getElementById("nom").value = membre.name;
  document.getElementById("roles").value = membre.role;
  document.getElementById("image").value = membre.image;
  document.getElementById("email").value = membre.email;
  document.getElementById("number").value = membre.telephone;
  photoPreview.src = `${membre.image}`;
  formulaire.setAttribute("index-edit", id);
}

function rechercheparnom() {
  const data = JSON.parse(localStorage.getItem("lesmembres")) || [];
  let input = document.getElementById("searchInput").value.toLowerCase();
  const container = document.querySelector(".containermembre");
  container.textContent = "";
  data.forEach((e, index) => {
    if (e.name.toLowerCase().includes(input)) {
      container.innerHTML += `
            <div class="membre">
                <div class="membre-photo" 
                    style="background-image: url('${e.image}');"></div>
                <div class="membre-info">
                    <p><b>Nom :</b> <span>${e.name}</span></p>
                    <p><b>Role :</b> <span>${e.role}</span></p>
                </div>
                <button class="edit-btn" onclick="modifiermembre(${index})">
                    Modifier
                </button>
            </div>
        `;
    }
  });
}

const accessRules = {
  Réceptionniste: ["reception"],
  "Technicien IT": ["server"],
  "Agent de sécurité": ["security"],
  Manager: [
    "conference",
    "reception",
    "server",
    "security",
    "staffroom",
    "archive",
  ],
  Netoyage: ["conference", "reception", "server", "security", "staffroom"],
  Autre: ["conference", "reception", "server", "security", "staffroom"],
};

function membredisponible(zone) {
  const data = JSON.parse(localStorage.getItem("lesmembres")) || [];
  const Roles = [];
  for (let role in accessRules) {
    if (accessRules[role].includes(zone)) {
      Roles.push(role);
    }
  }
  const filtres = data.filter((m) => {
    Roles.includes(m.role) && !m.assignedZone;
  });
  afficherModalSelection(filtres, zone);
}

function afficherModalSelection(filtres, zone) {
  const modal = document.querySelector(".modaldisponible");
  if (filtres.length === 0) {
    modal.innerHTML = `<div class="close" onclick="closemodal1()">X</div>
            <h2>Aucun membre autorisé pour cette zone</h2>`;
    modal.classList.remove("closes");
    return;
  }
  modal.innerHTML = `<div class="close" onclick="closemodal1()">X</div>
            <h2>Choisir un membre pour : ${zone}</h2>`;
  filtres.forEach((m) => {
    modal.innerHTML += `<div class="listemodal"> 
                    <div class="itemmembre" onclick='detailemembre(${m.id} , "${zone}")'>
                        <img src="${m.image}" class="avatar"/>
                        <div>
                            <p><b>${m.name}</b></p>
                            <h4>${m.role}</h4>
                        </div>
                    </div>
                
`;
    modal.classList.remove("closes");
  });
}

function detailemembre(id, zone) {
  const modal = document.querySelector(".modaldisponible");
  const data = JSON.parse(localStorage.getItem("lesmembres")) || [];
  let membre = data.find((m) => m.id === id);
  if (!membre) return;
  let experienceHTML = "";
  if (membre.experience && membre.experience.length > 0) {
    membre.experience.forEach((exp) => {
      experienceHTML += `
        <div class="exp-item">
            <p><b>Company :</b> ${exp.company}</p>
            <p><b>Role :</b> ${exp.company_role}</p>
            <p><b>De :</b> ${exp.datedebut}</p>
            <p><b>À :</b> ${exp.datefin}</p>
        </div>
      `;
    });
  }

  modal.innerHTML = `
        <div class="close" onclick="closemodal1()">X</div>
        <h2>Détails du membre</h2>

        <div class="detail-box">
            <img src="${membre.image}" class="avatar-big" />

            <div class="detail-info">
                <p><b>Nom:</b> ${membre.name}</p>
                <p><b>Role:</b> ${membre.role}</p>
                <p><b>Email:</b> ${membre.email}</p>
                <p><b>Téléphone:</b> ${membre.telephone}</p>
            </div>

            <h3>Expérience professionnelle</h3>
            <div class="experience-list">
                ${experienceHTML}
            </div>

            <button class="assign-btn" onclick='ajoutdanszone("${zone}", ${membre.id})'>
                Ajouter dans la zone
            </button>
        </div>
    `;

  modal.classList.remove("closes");
}

function ajoutdanszone(zone, id) {
  const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
  const zoneDiv = document.querySelector(`[data-zone ="${zone}"]`);
  const membre = membres.find((m) => {
    m.id === id;
  });
  const enfant = zoneDiv.querySelector(".content");
  enfant.innerHTML += `
    <div class="assigned-member" data-id="${membre.id}">
      <button onclick="removemembre(${membre.id}, '${zone}')" class="removemembre">X</button>
      <img src="${membre.image}" class="avatar-zone">
      <div class="contenumembre">
        <p>${membre.name}</p>
        <p>${membre.role}</p>
      </div>
    </div>
  `;
  membre.assignedZone = zone;
  localStorage.setItem("lesmembres", JSON.stringify(membres));
  afficherMembres();
  membredisponible(zone);
  closemodal1();
  zoneenrouge();
}

function removemembre(id, zone) {
  const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
  let membre = membres.find((m) => m.id === id);
  if (!membre) return;
  const zoneDiv = document.querySelector(`[data-zone="${zone}"]`);
  const assigned = zoneDiv.querySelector(`.assigned-member[data-id="${id}"]`);
  if (assigned) assigned.remove();
  membre.assigned = null;
  localStorage.setItem("lesmembres", JSON.stringify(membres));
  afficherMembres();
    membredisponible(zone);
    closemodal1();
    zoneenrouge()
}


function afficherZones() {
  const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
  membres.forEach((m) => {
    if (m.assignedZone) {
      const zoneDiv = document.querySelector(`[data-zone="${m.assignedZone}"]`);
      const enfant = zoneDiv.querySelector(".content");
      enfant.innerHTML += `
    <div class="assigned-member" data-id="${membre.id}">
      <button onclick="removemembre(${membre.id}, '${zone}')" class="removemembre">X</button>
      <img src="${membre.image}" class="avatar-zone">
      <div class="contenumembre">
        <p>${membre.name}</p>
        <p>${membre.role}</p>
      </div>
    </div>
  `;
    }
    zoneenrouge();
  });
}



function zoneenrouge(){
   const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
   const leszones = document.querySelectorAll(".box");
   leszones.forEach(zone => {
    const zoneattribute = zone.getAttribute("data-zone");
    let occupe = false;
    membres.forEach(membre => {
      if (membre.assignedZone === zoneattribute) {
        occupe = true;
      }
    });

    if (occupe) {
      zone.style.backgroundColor = "rgba(209, 225, 209, 0.3)"; 
    } else {
      zone.style.backgroundColor = "rgba(255, 0, 0, 0.3)";  
    }
  });
}




function closemodal1() {
  document.querySelector(".modaldisponible").classList.add("closes");
}
window.onload = function () {
  afficherMembres();
  //  membredisponible(zone);
  // closemodal1();
  // zoneenrouge()
};
