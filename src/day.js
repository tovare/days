import { define, html, render } from "hybrids";



// createDays populates 12 columns
function createDays() {
  // number of months:
  var allDays = [];
  for (let i = 1; i <= 12; i++) {
    days = new Date(2021, i, 0).getDate(); //  numnber of days in the month.
    for (let j = 1; j <= 31; j++) {
      allDays.push({
        id: String(i).padStart(2, "0") + String(j).padStart(2, "0"),
        date: new Date(2020, i - 1, j),
        month: i,
        day: j,
        visible: j <= days ? true : false,
        checked: false,
      });
    }
  }
  // We can sort the table by days.
  allDays = allDays.sort(function (a,b) {
      if ((a.day > b.day))  {
          return 1
      }
    if ((a.day == b.day) && (a.month > b.month)){
          return 1
    }
    return -1
  })
  console.log(JSON.stringify(allDays))
  return allDays;
}

// =======================================
// Indexdb implementation
// =======================================


// Let us open our database
var dbrequest = indexedDB.open("days", 1);

dbrequest.onerror = function (event) {
  console.log("error: ");
};

dbrequest.onsuccess = function (event) {
  db = event.target.result;
  console.log("success: " + db);
};

dbrequest.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("days", { keyPath: "id" });
  allDays = createDays();
  for (var i in allDays) {
    objectStore.add(allDays[i]);
  }
};


function getALL() {
    objectStore.getAll().onsuccess = function(event) {
        let allDays =  event.target.result;
        
    };
}



function toggleDay(host, event) {
  host.selected = !host.selected;
}

const DayElement = {
  selected: false,
  day: 0,
  render: render(
    ({ selected, day }) => html`
      <style type="text/css">
        .btnselected {
          box-shadow: 3px 4px 4px 0px #8a2a21;
          background-image: linear-gradient(#c62d1f, #f24437);
          background-color: #c62d1f;
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          border-bottom-right-radius: 18px;
          border-bottom-left-radius: 18px;
          text-indent: 0;
          border: 1px solid #d02718;
          display: inline-block;
          color: #ffffff;
          font-family: arial;
          font-size: 15px;
          font-weight: bold;
          font-style: normal;
          height: 32px;
          line-height: 32px;
          width: 32px;
          text-decoration: none;
          text-align: center;
          text-shadow: 0px 1px 0px #810e05;
        }
        .btnselected:hover {
          background-image: linear-gradient(#f24437, #c62d1f);
          background-color: #f24437;
        }
        .btnselected:active {
          position: relative;
          top: 1px;
        }

        .btn {
          box-shadow: 3px 4px 4px 0px #807f7e;
          background-image: linear-gradient(#f5f5f5, #b7bdbd);
          background-color: #c5c7c6;
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          border-bottom-right-radius: 18px;
          border-bottom-left-radius: 18px;
          text-indent: 0;
          border: 1px solid #8c8989;
          display: inline-block;
          color: #ffffff;
          font-family: arial;
          font-size: 15px;
          font-weight: bold;
          font-style: normal;
          height: 32px;
          line-height: 32px;
          width: 32px;
          text-decoration: none;
          text-align: center;
          text-shadow: 0px 1px 0px #2e2b2b;
        }
        .btn:hover {
          background-image: linear-gradient(#b7bdbd, #c5c7c6);
          background-color: #b7bdbd;
        }
        .btn:active {
          position: relative;
          top: 1px;
        }
      </style>
      ${selected &&
      html`<button class="btnselected" onclick="${toggleDay}">${day}</button>`}
      ${selected == false &&
      html`<button class="btn" onclick="${toggleDay}">${day}</button>`}
    `,
    { shadowRoot: true }
  ),
};

const tableRows = (host) => {
   s = "<h1>hello</h1>"
   return html`<p>My name${s}</p>`
};

const YearElement = {
  year: 2021,
  render: () => html`
    <table>
      <thead>
        <th>Jan</th>
        <th>Feb</th>
        <th>Mar</th>
        <th>Apr</th>
        <th>May</th>
        <th>Jun</th>
        <th>Jul</th>
        <th>Aug</th>
        <th>Sep</th>
        <th>Okt</th>
        <th>Nov</th>
        <th>Des</th>
      </thead>
      <tbody>
        ${tableRows()}
      </tbody>
    </table>
  `,
};

define("t-day", DayElement);
define("t-year", YearElement);
