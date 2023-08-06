fetch(chrome.runtime.getURL('img/filters.svg'), {
  method: "GET"
})
.then(res => res.text())
.then(str => {
  const filter: HTMLElement = new window.DOMParser().parseFromString(str, "text/xml").documentElement;
  filter.style.display = "none";
  filter.style.width = "0";
  filter.style.height = "0";
  document.body.appendChild(filter);
})
.catch((err) => {
  console.error(err);
})
