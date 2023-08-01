fetch(chrome.runtime.getURL('img/filters.svg'), {
  method: "GET"
})
.then(res => res.text())
.then(str => {
  const filter = new window.DOMParser().parseFromString(str, "text/xml").documentElement;
  filter.style.display = "none";
  filter.width = 0;
  filter.height = 0;
  document.body.appendChild(filter);
})
.catch((err) => {
  console.error(err);
})
