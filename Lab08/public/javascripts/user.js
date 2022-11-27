let data = sessionStorage.getItem("loggedId");
async function loggedIsAdmin() {
  await axios.get("http://localhost:3000/api/users/").then((response) => {
    const admin = response.data.filter((el) => el._id === data.toString())[0]
      .admin;
    const idMatch = document.getElementById(data);
    if (admin || idMatch) {
      document
        .querySelectorAll("button")
        .forEach((el) => (el.style.opacity = "1"));
    }
  });
}
loggedIsAdmin();
async function deleteUser(id) {
  await axios
    .delete(`http://localhost:3000/api/users/${id}`)
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
  const result = confirm("Are you sure?");
  if (result) {
    document.getElementById(id).remove();
    location.href = `http://localhost:3000/`;
  }
}
function editUser(id) {
  const userLogin = document.getElementById(id).firstElementChild.textContent;
  const userEmail = document.getElementById(id).children[1].innerHTML;
  var loginInput = document.createElement("input");
  loginInput.type = "text";
  loginInput.placeholder = userLogin;
  var emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.placeholder = userEmail;
  console.log(emailInput);
  document.getElementById(id).appendChild(loginInput);
  document.getElementById(id).appendChild(emailInput);
  const confirmButton = document.createElement("button");
  confirmButton.innerHTML = "SAVE";
  confirmButton.addEventListener("click", () => {
    axios
      .put(`http://localhost:3000/api/users/${id}`, {
        email: document.getElementById(id).children[5].value,
        login: document.getElementById(id).children[4].value,
      })
      .then((response) => location.reload())
      .catch((err) => console.log(err));
  });
  document.getElementById(id).appendChild(confirmButton);
}
