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

  membres.forEach(m => {
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

function modifiermembre(id){
   ajout();
    const membres = JSON.parse(localStorage.getItem("lesmembres")) || [];
    const membre =membres[id];
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




window.onload=function(){
  afficherMembres()
}