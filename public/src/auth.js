export function auth(domain, path) {
  return new Promise(async (resolve) => {
    let response;

    try {
      response = await fetch(`https://${domain}/auth/renew`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          path,
        }),
      });
    } catch(e) {
      show_error("network-error");
      return;
    }

    if (response.ok) {
      const data = await response.json();
      resolve(data.token);
      return;
    }

    if (response.status !== 401) {
      show_error("server-error");
      return;
    }

    const form = document.createElement("form");

    const user_id_p = document.createElement("p");
    user_id_p.innerText = "User ID: ";

    const user_id = document.createElement("input");
    user_id.type = "text";

    user_id_p.appendChild(user_id);

    form.appendChild(user_id_p);

    const password_p = document.createElement("p");
    password_p.innerText = "Password: ";

    const password = document.createElement("input");
    password.type = "password";
    password_p.appendChild(password);

    form.appendChild(password_p);

    const submit = document.createElement("button");
    submit.innerText = "login";
    form.appendChild(submit);

    const message_p = document.createElement("p");
    form.appendChild(message_p);

    form.onsubmit = async (e) => {
      e.preventDefault();
      message_p.innerText = "";

      const user_id_val = user_id.value;
      const password_val = password.value;

      let auth_response;

      try {
        auth_response = await fetch(`https://${domain}/auth/password`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            user_id: user_id_val,
            password: password_val,
            path,
          }),
        });
      } catch(e) {
        show_error("network-error");
        return false;
      }

      if (auth_response.ok) {
        const data = await auth_response.json();
        resolve(data.token);
        form.remove();
        return false;
      }

      if (auth_response.status !== 401) {
        show_error("server-error");
        return false;
      }

      message_p.innerText = "authentication failed";

      return false;
    };

    document.body.appendChild(form);
  });
}

function show_error(error) {
  console.log(error);
}
