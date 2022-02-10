import { Tenorer } from "../src/index";

let T = new Tenorer({
  APIKey: import.meta.env.VITE_APP_API_KEY,
  el: document.getElementById("box"),
});

T.$on("select", (imgObj) => {
  console.log(imgObj, "gif selected");
});

new Tenorer({
  APIKey: "4HHYQ4LSVAF2",
  el: document.getElementById("box2"),
  theme: "light",
});
