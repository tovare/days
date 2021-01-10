import { define, html, render } from "hybrids";

var mylist = [
  { id: 0, t: "zero" },
  { id: 1, t: "one" },
  { id: 2, t: "two" }
]

mylist = mylist.sort( function(a,b) {
    if (a.id > b.id) {
        return 1
    } else{
        return -1
    } 
})




const CompX1 = {
  d: mylist,
  render: ({d}) => html`
    <h1>List</h1>
    <ol>
      ${mylist.map(({ id, t }) => html`<li>item: ${t}</li>`.key(id))}
    </ol>
  `,
};

define("t-x1", CompX1);
