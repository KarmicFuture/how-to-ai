(function () {
  const root = document.getElementById("paths-root");
  const paths = window.AI_INCOME_PATHS;
  if (!root || !paths) return;

  root.innerHTML = paths
    .map(
      (path) => `
      <article class="path-card" id="${path.id}">
        <a class="path-card-media" href="examples/${path.id}.html" aria-hidden="true" tabindex="-1">
          <img
            src="images/${path.id}.jpg"
            alt=""
            width="1200"
            height="900"
            loading="lazy"
          />
        </a>
        <div class="path-card-body">
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
              <dt>Local-friendly range</dt>
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
          <p class="path-example-link">
            <a href="examples/${path.id}.html">See an example of how this works →</a>
          </p>
        </div>
      </article>
    `
    )
    .join("");
})();
