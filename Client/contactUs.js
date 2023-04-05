// const { response } = require('express');

const API_URL = "http://localhost:5000/contact";

document.addEventListener("DOMContentLoaded", function () {
  // contact us button
  const contactusForm = document.querySelector("#ContactusForm");
  contactusForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactusForm);
    const Dname = formData.get("Dname");
    const Email = formData.get("Email");
    const Message = formData.get("Message");

    const contactUsData = {
      Dname,
      Email,
      Message,
    };

    console.log(contactUsData, API_URL);

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(contactUsData),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        alert("Your query has been recieved");
      })
      .catch((error) => {
        const emailError = error?.Email?._errors?.toString() ?? "No Errors";
        const nameError = error?.Dname?._errors?.toString() ?? "No Errors";
        const messegeError = error?.Message?._errors?.toString() ?? "No Errors";
        const errorMsg = [
          `EMAIL: ${emailError}`,
          `NAME: ${nameError}`,
          `MESSEGE: ${messegeError}`,
        ].toString();
        alert(`Error: ${errorMsg}`);
      });

    // .then((response) => {
    //   return {
    //     data: response.json(),
    //     statusCode: response.status,
    //   };
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

    // .then(
    //   ((response) => ({
    //     data: response.json(),
    //     statusCode: response.status,
    //   })).then(({ data, statusCode }) => {
    //     if (statusCode === 422) {
    //       console.log(data);
    //     }

    //     if (statusCode === 200) {
    //       alert("Your query has been recieved");
    //     }
    //   })
    // );
  });
});
