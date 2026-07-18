(function () {
  const root = document.getElementById("paths-root");
  const paths = window.AI_INCOME_PATHS;
  if (!root || !paths) return;

  root.innerHTML = paths
    .map(
      (path) => `
      <article class="path-item" id="${path.id}">
        <div class="path-head">
          <span class="path-rank">${String(path.rank).padStart(2, "0")}</span>
          <h3>${path.title}</h3>
        </div>
        <p class="path-summary">${path.summary}</p>
        <dl class="path-meta">
          <div>
            <dt>Buyer</dt>
            <dd>${path.buyer}</dd>
          </div>
          <div>
            <dt>Offer</dt>
            <dd>${path.offer}</dd>
          </div>
          <div>
            <dt>Why it pays</dt>
            <dd>${path.whyItPays}</dd>
          </div>
          <div>
            <dt>Typical range</dt>
            <dd>${path.earnings}</dd>
          </div>
          <div>
            <dt>Speed</dt>
            <dd>${path.speed}</dd>
          </div>
        </dl>
        <div class="path-steps">
          <p class="path-steps-label">Template steps for this path</p>
          <ol>
            ${path.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      </article>
    `
    )
    .join("");
})();
