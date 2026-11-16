document.addEventListener("nav", () => {
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="insight-category"]')
  const filter = () => {
    const selected = document.querySelector<HTMLInputElement>('input[name="insight-category"]:checked')?.value ?? "All"
    const cards = document.querySelectorAll<HTMLElement>("#article-list [data-category]")
    let count = 0
    cards.forEach(card => { card.hidden = selected !== "All" && card.dataset.category !== selected; if (!card.hidden) count++ })
    const status = document.querySelector(".filter-count")
    if (status) status.textContent = `${count} ${count === 1 ? "article" : "articles"}`
    const empty = document.querySelector<HTMLElement>(".filter-empty")
    if (empty) empty.hidden = count !== 0
  }
  radios.forEach(radio => { radio.addEventListener("change", filter); window.addCleanup(() => radio.removeEventListener("change", filter)) })
  const form = document.querySelector<HTMLFormElement>(".knowledge-search")
  const search = (event: Event) => {
    event.preventDefault()
    const query = document.querySelector<HTMLInputElement>("#knowledge-query")?.value ?? ""
    document.querySelector<HTMLButtonElement>(".nav-tools .search-button")?.click()
    const input = document.querySelector<HTMLInputElement>(".search-container.active .search-bar")
    if (input) { input.value = query; input.dispatchEvent(new Event("input", { bubbles: true })); input.focus() }
  }
  form?.addEventListener("submit", search)
  window.addCleanup(() => form?.removeEventListener("submit", search))
  const menu = document.querySelector<HTMLDetailsElement>(".mobile-navigation")
  const close = (event: KeyboardEvent) => { if (event.key === "Escape" && menu?.open) { menu.open = false; menu.querySelector("summary")?.focus() } }
  document.addEventListener("keydown", close)
  window.addCleanup(() => document.removeEventListener("keydown", close))
})
