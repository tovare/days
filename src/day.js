import { define, html, render } from "hybrids";
import { openDB, deleteDB, wrap, unwrap } from "idb";
import { stringify } from "postcss";

// createDays populates 12 columns
function createDays() {
  // number of months:
  var allDays = [];
  for (let i = 1; i <= 12; i++) {
    days = new Date(2021, i, 0).getDate(); //  numnber of days in the month.
    for (let j = 1; j <= 31; j++) {
      allDays.push({
        id: "M"+String(i).padStart(2, "0")+"D"+ String(j).padStart(2, "0"),
        date: new Date(2020, i - 1, j),
        month: i,
        day: j,
        visible: j <= days ? true : false,
        checked: false,
      });
    }
  }
  // We can sort the table by days.
  return sortDays(allDays);
}

// =======================================
// Indexdb implementation
// =======================================

async function OpenDaysDatabase() {
  const db = await openDB("days", undefined, {
    upgrade(db, oldVersion, newVersion, transaction) {
      objectStore = db.createObjectStore("days", { keyPath: "id" });
      allDays = createDays();
      for (var i in allDays) {
        objectStore.add(allDays[i]);
      }
    },
    blocked() {
      console.log("Older version blocking");
    },
    blocking() {
      console.log("DB connection is blocking new version");
    },
    terminated() {
      console.log("Database connection terminated");
    },
  });
  const store = db.transaction("days").objectStore("days");
  value = await store.getAll();
  value = sortDays(value);
  groupedByDay = [];
  currentDay = 0;
  for (let i = 0; i <= value.length - 1; i++) {
    if (value[i].day > currentDay) {
      currentDay++;
      groupedByDay.push([]);
    }
    groupedByDay[currentDay - 1].push(value[i]);
  }
  return groupedByDay;
}

//var values = OpenDaysDatabase();

function sortDays(allDays) {
  allDays = allDays.sort(function (a, b) {
    if (a.day > b.day) {
      return 1;
    }
    if (a.day == b.day && a.month > b.month) {
      return 1;
    }
    return -1;
  });
  return allDays;
}

function toggleDay(host, event) {
  host.selected = !host.selected;
  console.log("id of host: " + host.id);
  console.log("day of host: " + host.day);
  console.log("selected: " + host.selected);

  async function newFunction() {
    const db = await openDB("days")
      .catch(function (err) {
        console.log("Error: " + err);
      })
      .then(
        function (db) {
          console.log("database:"+ db);
          const value = db.get("days", host.id)
            .then(function (value) {
                console.log("value object:"+ JSON.stringify(value))
                value.selected = host.selected
                db.put("days", value).catch(
                    function(err) {
                        console.log("Saving: "+err)
                    }
                )
                console.log("Updated " + host.id + " to " + host.selected);
            }).catch(
              function (err) {
                  console.log("Error during get: "+err)
              }
            )
          }
      )
  }
  newFunction();
  //
  //
  //
}

const DayElement = {
  selected: false,
  id: "",
  day: 0,
  render: ({ selected, day }) => html`
    <link
      href="//fonts.googleapis.com/css?family=Orbitron&display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      button {
        font-family: "Orbitron", sans-serif;
      }
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
};

const tableRows = function (d) {
  return html`
    ${d.map(function (row) {
      return html`<tr>
        ${row.map(function ({ id, day, date, visible,selected }) {
          return html` <td>
            ${visible && html`<t-day id="${id}" day=${day} selected=${selected}></t-day>`}
          </td>`;
        })}
      </tr>`;
    })}
  `;
};

const YearElement = {
  year: 2021,
  d: () => OpenDaysDatabase(),
  render: ({ d }) => html`
    <link
      href="//fonts.googleapis.com/css?family=Orbitron&display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      th,
      td {
        font-family: "Orbitron", sans-serif;
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 2px;
      }
    </style>
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
        ${html.resolve(d.then((res) => tableRows(res)))}
      </tbody>
    </table>
  `,
};

define("t-day", DayElement);
define("t-year", YearElement);
