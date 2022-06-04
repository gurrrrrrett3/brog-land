export default class Login {
  public static async checkIfLoggedIn() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === "session") {
        //Send a check request
        fetch("/auth/status", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success) {
              //update the navbar
              let loginButton = document.getElementById("login-button");
              if (loginButton) {
                loginButton.hidden = true;

                //show logged in text
                let loggedInText = document.getElementById("logged-in");
                if (loggedInText) {
                  loggedInText.hidden = false;
                  loggedInText.innerHTML = `Logged in as <strong>${json.user.username}</strong>`;
                }
              }
            }
          });
      }
    }
  }
}
