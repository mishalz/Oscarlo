//the onclick function to get the nominations
const getNominations = () => {
  //retrieving the values of all the 6 input fields
  const year = document.getElementById("year").value;
  const category = document.getElementById("category").value;
  const nominee = document.getElementById("nominee").value;
  const info = document.getElementById("info").value;
  const nomInfo = document.getElementById("nomInfo").value;
  const won = document.getElementById("won").value;

  //the base url
  let url = "http://localhost:8080/get-nominations?";

  //add query parameters
  year ? (url += `year=${year}&`) : null;
  category ? (url += `category=${category}&`) : null;
  nominee ? (url += `nominee=${nominee}&`) : null;
  info ? (url += `info=${info}&`) : null;
  nomInfo ? (url += `nomInfo=${nomInfo}&`) : null;
  won ? (url += `won=${won}&`) : null;

  //send a request to the created url to fetch the data
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.error)
        //if an error is returned, it is displayed
        document.getElementById("output").innerHTML =
          "<p class='error'>" + data.error + "</p>";
      else {
        //if there is no error, we display the results

        //we construct the output table
        let output =
          '<table> <thead> <tr> <th scope="col">Year</th><th scope="col">Category</th><th scope="col">Nominee</th><th scope="col">Info</th><th scope="col">Won?</th></tr></thead>';

        //for each data item, we add a row to the output table
        for (const item of data) {
          output +=
            "<tr>" +
            "<td>" +
            item.Year +
            "</td>" +
            "<td>" +
            item.Category +
            "</td>" +
            "<td>" +
            item.Nominee +
            "</td>" +
            "<td>" +
            item.Info +
            "</td>" +
            "<td>" +
            item.Won +
            "</td>";
          ("</tr>");
        }
        output += "</table>";

        //add the number of rows returned in the result in the end
        output += `<p id='content-length'>No of Rows returned: ${data.length}</p>`;

        //putting the contructed output into the html of the output div in out html
        document.getElementById("output").innerHTML = output;
      }
    });
};

//the onclick function to get the nominees
const getNominees = () => {
  //retrieving the values of the 2 required input fields
  const won = document.getElementById("won").value;
  const times = document.getElementById("times").value;

  //constructing the url with the query parameters
  let url = "http://localhost:8080/get-nominees?";
  won ? (url += `won=${won}&`) : null;
  times ? (url += `times=${times}&`) : null;

  //sending a request to the backend with the constructed url
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //if an error is returned, it is displayed
      if (data.error)
        document.getElementById("output").innerHTML =
          "<p class='error'>" + data.error + "</p>";
      else {
        //if there is no error, we display the results

        //we construct the output table
        let output =
          '<table><thead><tr><th scope="col">Nominee</th><th scope="col">Number of Times</th></tr></thead>';

        //for each data item, we add a row to the output table
        for (const item of data) {
          output +=
            "<tr><td>" + item.actor + "</td><td>" + item.times + "</td></tr>";
        }
        output += "</table>";

        //putting the contructed output into the html of the output div in out html
        document.getElementById("output").innerHTML = output;
      }
    });
};

//the onclick function to clear the output
const clearOutput = () => {
  document.getElementById("output").innerHTML = null;
  document.getElementById("output").innerText = null;
};

//the onclick function to clear the input
const clearInput = () => {
  //reset the form fields to their default values
  document.getElementById("oscar-form").reset();
};

//all the onclick functions are attached as soon as the window is loaded
window.onload = function () {
  document.getElementById("get-nominations").onclick = getNominations;
  document.getElementById("get-nominees").onclick = getNominees;
  document.getElementById("clear-input").onclick = clearInput;
  document.getElementById("clear-output").onclick = clearOutput;
};
