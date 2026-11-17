document.addEventListener("nav", () => {
  for (const collection of document.querySelectorAll<HTMLElement>("[data-collection]")) {
    const radios = collection.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    const filter = () => {
      const selected = collection.querySelector<HTMLInputElement>("input:checked")?.value ?? "All"
      let count = 0
      collection.querySelectorAll<HTMLElement>(".collection-item").forEach((card) => {
        const values = JSON.parse(card.dataset.filterValues ?? "[]") as string[]
        card.hidden = selected !== "All" && !values.includes(selected)
        if (!card.hidden) count++
      })
      const status = collection.querySelector(".filter-count")
      if (status) status.textContent = `${count} ${count === 1 ? "item" : "items"}`
      const empty = collection.querySelector<HTMLElement>(".filter-empty")
      if (empty) empty.hidden = count !== 0
    }
    radios.forEach((radio) => {
      radio.addEventListener("change", filter)
      window.addCleanup(() => radio.removeEventListener("change", filter))
    })
  }
  const form = document.querySelector<HTMLFormElement>(".knowledge-search")
  const search = (event: Event) => {
    event.preventDefault()
    const query = document.querySelector<HTMLInputElement>("#knowledge-query")?.value ?? ""
    document.querySelector<HTMLButtonElement>(".nav-tools .search-button")?.click()
    const input = document.querySelector<HTMLInputElement>(".search-container.active .search-bar")
    if (input) {
      input.value = query
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.focus()
    }
  }
  form?.addEventListener("submit", search)
  window.addCleanup(() => form?.removeEventListener("submit", search))
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-navigation")
  const close = (event: KeyboardEvent) => {
    if (event.key === "Escape" && menu?.open) {
      menu.open = false
      menu.querySelector("summary")?.focus()
    }
  }
  document.addEventListener("keydown", close)
  window.addCleanup(() => document.removeEventListener("keydown", close))
})
