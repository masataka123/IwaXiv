(() => {
  const form = document.querySelector("[data-filters]");
  if (!form) return;

  const monthIndex = document.querySelector("[data-month-index]");
  const months = [...document.querySelectorAll("[data-month]")].map((month) => ({
    element: month,
    link: monthIndex.querySelector(`[data-jump="${month.id}"]`),
    days: [...month.querySelectorAll("[data-day]")].map((day) => ({
      element: day,
      count: day.querySelector("[data-day-count]"),
      works: [...day.querySelectorAll("[data-kind]")],
    })),
  }));
  const total = document.querySelector("[data-total]");
  const emptyState = document.querySelector("[data-no-results]");
  const clear = document.querySelector("[data-clear]");
  const languageLinks = document.querySelectorAll("[data-preserve-filters]");
  const filterNames = ["type", "topic"];

  function readFilters() {
    const params = new URLSearchParams(window.location.search);

    for (const name of filterNames) {
      const select = form.elements.namedItem(name);
      select.value = params.get(name) ?? "";
      if (select.selectedIndex === -1) select.value = "";
    }
  }

  function formatCount(element, count) {
    const pattern = count === 1 ? element.dataset.singular : element.dataset.plural;
    return pattern.replace("%n%", count);
  }

  function updateDay(day, type, topic) {
    let visible = 0;
    for (const work of day.works) {
      const matchesType = !type || work.dataset.kind === type;
      const matchesTopic = !topic || work.dataset.topics.split(" ").includes(topic);
      work.hidden = !(matchesType && matchesTopic);
      if (!work.hidden) visible += 1;
    }
    day.element.hidden = visible === 0;
    day.count.textContent = `(${formatCount(day.count, visible)})`;
    return visible;
  }

  function render(filters) {
    const type = filters.get("type");
    const topic = filters.get("topic");
    let visible = 0;

    for (const month of months) {
      let monthTotal = 0;
      for (const day of month.days) {
        monthTotal += updateDay(day, type, topic);
      }
      month.element.hidden = monthTotal === 0;
      month.link.hidden = monthTotal === 0;
      visible += monthTotal;
    }

    total.textContent = formatCount(total, visible);
    monthIndex.hidden = visible === 0;
    emptyState.hidden = visible !== 0;
    clear.hidden = !type && !topic;

    for (const link of languageLinks) {
      link.href = filteredUrl(link.href, filters).href;
    }
  }

  function filteredUrl(address, filters) {
    const url = new URL(address);

    for (const name of filterNames) {
      const value = filters.get(name);
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    }
    return url;
  }

  function applyFilters() {
    const filters = new FormData(form);
    history.replaceState(null, "", filteredUrl(window.location.href, filters));
    render(filters);
  }

  form.addEventListener("change", applyFilters);
  form.addEventListener("submit", (event) => event.preventDefault());
  window.addEventListener("popstate", () => {
    readFilters();
    render(new FormData(form));
  });
  clear.addEventListener("click", () => {
    form.reset();
    applyFilters();
    form.elements.namedItem("type").focus();
  });

  readFilters();
  render(new FormData(form));
  form.hidden = months.length === 0;
})();
