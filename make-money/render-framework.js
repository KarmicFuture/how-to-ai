(function () {
  const framework = window.AI_INCOME_FRAMEWORK;
  if (!framework) return;

  const idea = document.getElementById("framework-idea");
  const list = document.getElementById("framework-steps");
  if (idea) idea.textContent = framework.idea;
  if (!list) return;

  list.innerHTML = framework.steps
    .map(
      (step) => `
      <li class="framework-step">
        <span class="framework-num">${step.num}</span>
        <div>
          <h3>${step.title}</h3>
          <p>${step.detail}</p>
        </div>
      </li>
    `
    )
    .join("");
})();
