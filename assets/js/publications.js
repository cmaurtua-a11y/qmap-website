// ============================================================
//  QMAP publications list
//  To add a paper: copy one { ... } block, paste it at the top,
//  and edit the fields. "area" is one of:
//  strain, nanophotonics, excitonics, heterostructures, defects, magnetism, other
//  Optional: link: "https://doi.org/..." (otherwise the title searches
//  Google Scholar), note: "...", preprint: true
// ============================================================
window.QMAP_PUBS = [
  { year: 2026, preprint: true, area: "magnetism",
    authors: "M. H. Shaikh, D. Blach, H. Jayakumar, B. E. Solarte, K. Watanabe, T. Taniguchi, et al.",
    title: "On-demand valley control in a WSe2/CrPS4 heterostructure via optically programmed magnetic order",
    venue: "arXiv:2611.18906", link: "https://arxiv.org/abs/2611.18906" },
  { year: 2026, preprint: true, area: "defects",
    authors: "A. Ishraq, E. Herrmann, P. Agnihotri, A. Hutchinson, R. M. dos Santos, S. Asif, L. Murray, A. Puthiya Veettil, L. Stockl, M. H. Shaikh, C. Maurtua, K. Watanabe, T. Taniguchi, M. Doty, C. E. Dreyer, A. Janotti, X. Wang, C. Chakraborty",
    title: "Symmetry engineering enables deterministic ensemble polarization control in hexagonal boron nitride",
    venue: "In review · arXiv:2610.03547", link: "https://arxiv.org/abs/2610.03547" },
  { year: 2026, preprint: true, area: "magnetism",
    authors: "M. H. Shaikh, A. Puthiya Veettil, C. Maurtua, D. Q. Ho, S. Bhatt, D. T. Plouff, M. Gulawita, K. Watanabe, T. Taniguchi, J. Q. Xiao, et al.",
    title: "Anomalous magneto-optical response at the RuO2/WSe2 van der Waals interface",
    venue: "arXiv:2606.20262", link: "https://arxiv.org/abs/2606.20262" },
  { year: 2026, preprint: true, area: "defects",
    authors: "C. Maurtua, L. Stockl, A. Puthiya Veettil, M. H. Shaikh, A. Ishraq, S. Shrestha, A. Thapa, L. Holtzman, J. Hone, J. Zide, C. Chakraborty",
    title: "Host material selection for room-temperature defect-related emission in monolayer transition metal dichalcogenides",
    venue: "In review", link: "research.html#featured" },
  { year: 2026, area: "magnetism",
    authors: "M. H. Shaikh, K. Watanabe, T. Taniguchi, C. Chakraborty",
    title: "Optically tunable chiral magnetic states and exchange engineering via charge-transfer excitation in a van der Waals antiferromagnet CrPS4",
    venue: "Advanced Materials, e75391" },
  { year: 2026, area: "heterostructures",
    authors: "M. H. Shaikh, A. Hutchinson, C. Maurtua, S. Nepal, K. Watanabe, T. Taniguchi, L. N. Holtzman, K. Barmak, J. Hone, J. Q. Xiao, et al.",
    title: "Bridging precision and scalability in van der Waals assembly engineering via lens-enhanced optical transfer",
    venue: "Small Methods 10, e00011" },

  { year: 2025, area: "magnetism",
    authors: "M. H. Shaikh, M. P. Whalen, D. Q. Ho, A. Ishraq, C. Maurtua, K. Watanabe, T. Taniguchi, Y. Ren, A. Janotti, J. Q. Xiao, C. Chakraborty",
    title: "Magnetic proximity coupling to defects in a two-dimensional semiconductor",
    venue: "ACS Nano 19, 36294", link: "https://doi.org/10.1021/acsnano.5c09258" },

  { year: 2025, area: "other",
    authors: "L. L. Murray, M. P. Whalen, A. Ishraq, C. Maurtua, M. Yu, S. Law, J. Xiao, C. Chakraborty, M. Doty",
    title: "Understanding and mitigating the degradation of optical emission from exfoliated Ga2Se2",
    venue: "ACS Applied Optical Materials 3, 1757" },

  { year: 2024, area: "other",
    authors: "C. Maurtua, J. Zide, C. Chakraborty",
    title: "Molecular beam epitaxy and other large-scale methods for producing monolayer transition metal dichalcogenides",
    venue: "J. Phys.: Condens. Matter 36, 383003 (Review)" },
  { year: 2024, area: "other",
    authors: "C. Chakraborty, M. H. Shaikh",
    title: "Flatland quantum materials",
    venue: "Proc. SPIE, 2D Photonic Materials and Devices VII, PC1288805" },

  { year: 2023, area: "other",
    authors: "C. Maurtua, C. Chakraborty",
    title: "Large-scale production of 2D transition metal dichalcogenides",
    venue: "Bulletin of the American Physical Society (APS March Meeting)" },
];

// ---------- renderer (no need to edit below) ----------
(function () {
  const list = document.getElementById("pub-list");
  if (!list) return;
  const search = document.getElementById("pub-search");
  const filterBox = document.getElementById("pub-filters");
  const count = document.getElementById("pub-count");
  const areas = {
    all: "All", strain: "Strain", nanophotonics: "Nanophotonics", excitonics: "2D excitonics",
    heterostructures: "Heterostructures", defects: "Quantum defects", magnetism: "Magnetism", other: "Other",
  };
  // Always show Chitraleema Chakraborty in every author list, even when it is shortened with "et al."
  window.QMAP_PUBS.forEach((p) => {
    if (/Chakraborty/.test(p.authors)) return;
    if (p.year >= 2021) p.authors = p.authors.replace(/,?\s*et al\.?$/, "") + ", …, C. Chakraborty";
    else p.authors = p.authors.replace(/,?\s*et al\.?$/, "") + ", …, C. Chakraborty, …";
  });
  let area = "all";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const GROUP = /(C\. Chakraborty|A\. Ishraq|M\. H\. Shaikh|C\. Maurtua|A\. Puthiya Veettil|L\. Stockl|S\. Shrestha|A\. Thapa|A\. Hutchinson)/g;
  const bold = (authors) => esc(authors).replace(GROUP, "<b>$1</b>");

  // Only offer filter buttons for areas that have at least one paper
  Object.entries(areas).filter(([key]) => key === "all" || window.QMAP_PUBS.some((p) => p.area === key)).forEach(([key, label]) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = label; b.setAttribute("aria-pressed", String(key === area));
    b.addEventListener("click", () => {
      area = key;
      filterBox.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
    filterBox.appendChild(b);
  });

  function render() {
    const q = (search.value || "").toLowerCase().trim();
    const pubs = window.QMAP_PUBS.filter((p) =>
      (area === "all" || p.area === area) &&
      (!q || (p.title + " " + p.authors + " " + p.venue + " " + p.year).toLowerCase().includes(q)));
    count.textContent = pubs.length + (pubs.length === 1 ? " paper" : " papers");
    if (!pubs.length) { list.innerHTML = '<p class="empty">No papers match that search.</p>'; return; }
    const years = [...new Set(pubs.map((p) => (p.preprint ? "Preprints & in review" : p.year)))];
    list.innerHTML = years.map((y) => {
      const items = pubs.filter((p) => (p.preprint ? "Preprints & in review" : p.year) === y).map((p) => {
        const href = p.link || "https://scholar.google.com/scholar?q=" + encodeURIComponent('"' + p.title + '"');
        return `<li class="pub">
          <a class="t" href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(p.title)}</a>
          <span class="a">${bold(p.authors)}</span>
          <span class="j">${esc(p.venue)} · ${p.year}</span>
          ${p.note ? `<span class="n">${esc(p.note)}</span>` : ""}
        </li>`;
      }).join("");
      return `<section class="pub-year"><h2>${y}</h2><ol>${items}</ol></section>`;
    }).join("");
  }
  search.addEventListener("input", render);
  render();
})();
