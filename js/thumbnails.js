/* ============================================================================
   ML Algo Studio — Clean Vector SVG Thumbnails for Home & Gallery Cards
   ============================================================================ */

(function () {
  function makeSVG(type, accentColor) {
    const c = accentColor || 'var(--accent)';
    const cA = '#0072b2';
    const cB = '#e69f00';
    const cC = '#009e73';
    const cErr = '#d55e00';

    const shapes = {
      linear_reg: `
        <line x1="20" y1="88" x2="180" y2="24" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="42" y1="70" x2="42" y2="79" stroke="${cErr}" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="95" y1="45" x2="95" y2="58" stroke="${cErr}" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="145" y1="48" x2="145" y2="38" stroke="${cErr}" stroke-width="1.5" stroke-dasharray="2,2"/>
        <circle cx="42" cy="70" r="4" fill="${cA}"/><circle cx="68" cy="74" r="4" fill="${cA}"/>
        <circle cx="95" cy="45" r="4" fill="${cA}"/><circle cx="122" cy="52" r="4" fill="${cA}"/>
        <circle cx="145" cy="48" r="4" fill="${cA}"/><circle cx="166" cy="26" r="4" fill="${cA}"/>`,
      logistic_reg: `
        <rect x="0" y="0" width="100" height="110" fill="${cA}" opacity="0.10"/>
        <rect x="100" y="0" width="100" height="110" fill="${cB}" opacity="0.10"/>
        <path d="M18 92 C72 92, 82 55, 100 55 C118 55, 128 18, 182 18" fill="none" stroke="${c}" stroke-width="2.5"/>
        <line x1="100" y1="10" x2="100" y2="100" stroke="var(--text-muted)" stroke-width="1.2" stroke-dasharray="4,3"/>
        <circle cx="38" cy="84" r="4" fill="${cA}"/><circle cx="62" cy="76" r="4" fill="${cA}"/><circle cx="76" cy="64" r="4" fill="${cA}"/>
        <circle cx="126" cy="44" r="4" fill="${cB}"/><circle cx="148" cy="30" r="4" fill="${cB}"/><circle cx="168" cy="24" r="4" fill="${cB}"/>`,
      svm: `
        <line x1="40" y1="100" x2="160" y2="12" stroke="${c}" stroke-width="2.5"/>
        <line x1="22" y1="88" x2="142" y2="0" stroke="${c}" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.7"/>
        <line x1="58" y1="112" x2="178" y2="24" stroke="${c}" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.7"/>
        <circle cx="66" cy="55" r="5" fill="${cA}" stroke="var(--text-main)" stroke-width="2"/>
        <circle cx="128" cy="60" r="5" fill="${cB}" stroke="var(--text-main)" stroke-width="2"/>
        <circle cx="44" cy="36" r="4" fill="${cA}"/><circle cx="78" cy="26" r="4" fill="${cA}"/>
        <circle cx="150" cy="78" r="4" fill="${cB}"/><circle cx="114" cy="88" r="4" fill="${cB}"/>`,
      knn: `
        <circle cx="102" cy="56" r="34" fill="${c}" opacity="0.10" stroke="${c}" stroke-width="1.5" stroke-dasharray="4,3"/>
        <line x1="102" y1="56" x2="82" y2="42" stroke="var(--text-muted)" stroke-width="1.2"/>
        <line x1="102" y1="56" x2="122" y2="40" stroke="var(--text-muted)" stroke-width="1.2"/>
        <line x1="102" y1="56" x2="92" y2="78" stroke="var(--text-muted)" stroke-width="1.2"/>
        <circle cx="82" cy="42" r="4.5" fill="${cA}"/><circle cx="92" cy="78" r="4.5" fill="${cA}"/>
        <circle cx="122" cy="40" r="4.5" fill="${cB}"/><circle cx="152" cy="74" r="4" fill="${cB}"/>
        <circle cx="46" cy="68" r="4" fill="${cA}"/>
        <circle cx="102" cy="56" r="5.5" fill="var(--bg-surface)" stroke="${c}" stroke-width="2.5"/>`,
      naive_bayes: `
        <ellipse cx="66" cy="56" rx="34" ry="22" fill="${cA}" opacity="0.14" stroke="${cA}" stroke-width="1.5"/>
        <ellipse cx="66" cy="56" rx="18" ry="11" fill="${cA}" opacity="0.22"/>
        <ellipse cx="136" cy="54" rx="34" ry="24" fill="${cB}" opacity="0.14" stroke="${cB}" stroke-width="1.5"/>
        <ellipse cx="136" cy="54" rx="18" ry="12" fill="${cB}" opacity="0.22"/>
        <circle cx="62" cy="52" r="3.5" fill="${cA}"/><circle cx="74" cy="60" r="3.5" fill="${cA}"/>
        <circle cx="132" cy="50" r="3.5" fill="${cB}"/><circle cx="144" cy="58" r="3.5" fill="${cB}"/>`,
      decision_tree: `
        <rect x="18" y="14" width="74" height="82" fill="${cA}" opacity="0.12"/>
        <rect x="92" y="14" width="90" height="42" fill="${cB}" opacity="0.14"/>
        <rect x="92" y="56" width="90" height="40" fill="${cC}" opacity="0.14"/>
        <line x1="92" y1="14" x2="92" y2="96" stroke="${c}" stroke-width="2"/>
        <line x1="92" y1="56" x2="182" y2="56" stroke="${c}" stroke-width="2"/>
        <circle cx="48" cy="44" r="4" fill="${cA}"/><circle cx="64" cy="72" r="4" fill="${cA}"/>
        <circle cx="134" cy="34" r="4" fill="${cB}"/><circle cx="152" cy="78" r="4" fill="${cC}"/>`,
      random_forest: `
        <g stroke="${c}" stroke-width="1.5" fill="none">
          <line x1="48" y1="24" x2="32" y2="52"/><line x1="48" y1="24" x2="64" y2="52"/>
          <line x1="100" y1="24" x2="84" y2="52"/><line x1="100" y1="24" x2="116" y2="52"/>
          <line x1="152" y1="24" x2="136" y2="52"/><line x1="152" y1="24" x2="168" y2="52"/>
        </g>
        <circle cx="48" cy="24" r="6" fill="${c}"/><circle cx="100" cy="24" r="6" fill="${c}"/><circle cx="152" cy="24" r="6" fill="${c}"/>
        <circle cx="32" cy="52" r="4.5" fill="${cA}"/><circle cx="64" cy="52" r="4.5" fill="${cB}"/>
        <circle cx="84" cy="52" r="4.5" fill="${cA}"/><circle cx="116" cy="52" r="4.5" fill="${cA}"/>
        <circle cx="136" cy="52" r="4.5" fill="${cB}"/><circle cx="168" cy="52" r="4.5" fill="${cA}"/>
        <rect x="64" y="74" width="72" height="20" rx="10" fill="${c}" opacity="0.16" stroke="${c}" stroke-width="1.2"/>
        <text x="100" y="88" text-anchor="middle" font-size="9.5" font-weight="700" fill="${c}">VOTE</text>`,
      gradient_boosting: `
        <path d="M20 82 Q60 32, 100 54 T180 28" fill="none" stroke="${c}" stroke-width="2.5"/>
        <path d="M20 82 L60 58 L100 58 L140 42 L180 42" fill="none" stroke="${cB}" stroke-width="1.5" stroke-dasharray="3,2"/>
        <circle cx="36" cy="70" r="3.5" fill="${cA}"/><circle cx="72" cy="46" r="3.5" fill="${cA}"/>
        <circle cx="116" cy="54" r="3.5" fill="${cA}"/><circle cx="160" cy="34" r="3.5" fill="${cA}"/>`,
      neural_net: `
        <g stroke="var(--text-muted)" stroke-width="1.1" opacity="0.65">
          <line x1="42" y1="36" x2="100" y2="24"/><line x1="42" y1="36" x2="100" y2="55"/><line x1="42" y1="36" x2="100" y2="86"/>
          <line x1="42" y1="74" x2="100" y2="24"/><line x1="42" y1="74" x2="100" y2="55"/><line x1="42" y1="74" x2="100" y2="86"/>
          <line x1="100" y1="24" x2="158" y2="55"/><line x1="100" y1="55" x2="158" y2="55"/><line x1="100" y1="86" x2="158" y2="55"/>
        </g>
        <circle cx="42" cy="36" r="6" fill="${cA}"/><circle cx="42" cy="74" r="6" fill="${cA}"/>
        <circle cx="100" cy="24" r="6" fill="${c}"/><circle cx="100" cy="55" r="6" fill="${c}"/><circle cx="100" cy="86" r="6" fill="${c}"/>
        <circle cx="158" cy="55" r="7" fill="${cB}"/>`,
      kmeans: `
        <circle cx="58" cy="40" r="24" fill="${cA}" opacity="0.10" stroke="${cA}" stroke-width="1" stroke-dasharray="3,2"/>
        <circle cx="144" cy="44" r="24" fill="${cB}" opacity="0.10" stroke="${cB}" stroke-width="1" stroke-dasharray="3,2"/>
        <circle cx="102" cy="82" r="22" fill="${cC}" opacity="0.10" stroke="${cC}" stroke-width="1" stroke-dasharray="3,2"/>
        <circle cx="48" cy="34" r="3.5" fill="${cA}"/><circle cx="68" cy="46" r="3.5" fill="${cA}"/>
        <circle cx="136" cy="36" r="3.5" fill="${cB}"/><circle cx="154" cy="50" r="3.5" fill="${cB}"/>
        <circle cx="94" cy="86" r="3.5" fill="${cC}"/><circle cx="112" cy="78" r="3.5" fill="${cC}"/>
        <path d="M54 36l8 8m0-8l-8 8" stroke="${cA}" stroke-width="2.2"/><path d="M140 40l8 8m0-8l-8 8" stroke="${cB}" stroke-width="2.2"/><path d="M98 78l8 8m0-8l-8 8" stroke="${cC}" stroke-width="2.2"/>`,
      pca: `
        <line x1="26" y1="86" x2="174" y2="24" stroke="${c}" stroke-width="2.5"/>
        <line x1="86" y1="30" x2="114" y2="80" stroke="${cErr}" stroke-width="1.8" stroke-dasharray="3,2"/>
        <circle cx="54" cy="68" r="3.5" fill="${cA}"/><circle cx="80" cy="58" r="3.5" fill="${cA}"/>
        <circle cx="108" cy="56" r="3.5" fill="${cA}"/><circle cx="136" cy="36" r="3.5" fill="${cA}"/>
        <circle cx="152" cy="38" r="3.5" fill="${cA}"/>`,
      default: `
        <path d="M22 82 C62 22, 138 92, 178 28" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="4,3"/>
        <circle cx="44" cy="62" r="4" fill="${c}" opacity="0.7"/>
        <circle cx="100" cy="56" r="4" fill="${c}" opacity="0.85"/>
        <circle cx="156" cy="44" r="4" fill="${c}" opacity="0.7"/>`
    };

    const inner = shapes[type] || shapes.default;
    return `<svg viewBox="0 0 200 110" width="100%" height="100%" aria-hidden="true" style="display:block;">${inner}</svg>`;
  }

  window.MLThumbnails = { makeSVG };
})();
