/**
 * NeuroDesk — Legal Modals (Privacy Policy & Terms of Service)
 * Global script: drop openLegal('privacy') or openLegal('terms') anywhere.
 * Auto-injects the modal overlay + CSS on first call; no build step needed.
 */

(function () {
  'use strict';

  // ── Inject modal CSS once ─────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('nd-legal-styles')) return;
    const style = document.createElement('style');
    style.id = 'nd-legal-styles';
    style.textContent = `
      .nd-legal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(7, 17, 31, 0.72);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 99000;
        display: none;
        align-items: flex-end;
        justify-content: center;
        padding: 0;
        animation: ndOverlayIn 0.22s ease;
      }
      @media (min-width: 600px) {
        .nd-legal-overlay { align-items: center; padding: 24px; }
      }
      .nd-legal-overlay.open { display: flex; }

      @keyframes ndOverlayIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes ndSheetIn {
        from { transform: translateY(60px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }

      .nd-legal-modal {
        background: #ffffff;
        border-radius: 24px 24px 0 0;
        width: 100%;
        max-width: 720px;
        max-height: 92vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 -8px 60px rgba(7,17,31,0.22);
        animation: ndSheetIn 0.28s cubic-bezier(0.34, 1.1, 0.64, 1);
        overflow: hidden;
      }
      @media (min-width: 600px) {
        .nd-legal-modal {
          border-radius: 20px;
          max-height: 88vh;
          box-shadow: 0 24px 80px rgba(7,17,31,0.28);
        }
      }

      /* Drag handle (mobile) */
      .nd-legal-modal__handle {
        width: 36px;
        height: 4px;
        background: rgba(7,17,31,0.12);
        border-radius: 2px;
        margin: 12px auto 0;
        flex-shrink: 0;
      }
      @media (min-width: 600px) { .nd-legal-modal__handle { display: none; } }

      .nd-legal-modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 24px 16px;
        border-bottom: 1px solid rgba(7,17,31,0.08);
        flex-shrink: 0;
        gap: 12px;
      }

      .nd-legal-modal__tabs {
        display: flex;
        gap: 4px;
        background: rgba(7,17,31,0.05);
        border-radius: 10px;
        padding: 4px;
      }

      .nd-legal-tab {
        padding: 6px 16px;
        border-radius: 7px;
        font-family: 'Satoshi', 'Inter', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        color: #5e6b7c;
        cursor: pointer;
        border: none;
        background: transparent;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .nd-legal-tab.active {
        background: #ffffff;
        color: #07111f;
        box-shadow: 0 1px 6px rgba(7,17,31,0.1);
      }

      .nd-legal-modal__close {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid rgba(7,17,31,0.1);
        background: transparent;
        color: #8f9baa;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s;
        flex-shrink: 0;
        line-height: 1;
      }
      .nd-legal-modal__close:hover {
        background: rgba(240,106,106,0.08);
        border-color: rgba(240,106,106,0.25);
        color: #e05555;
      }

      .nd-legal-modal__body {
        flex: 1;
        overflow-y: auto;
        padding: 28px 28px 32px;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      @media (max-width: 480px) {
        .nd-legal-modal__body { padding: 20px 18px 28px; }
        .nd-legal-modal__header { padding: 14px 18px 14px; }
      }

      /* Typography inside modal */
      .nd-legal-modal__body h2 {
        font-family: 'Satoshi', 'Inter', sans-serif;
        font-size: 1.25rem;
        font-weight: 900;
        color: #07111f;
        margin: 0 0 4px;
      }
      .nd-legal-modal__body .nd-legal-meta {
        font-size: 0.78rem;
        color: #8f9baa;
        margin-bottom: 22px;
        display: block;
      }
      .nd-legal-modal__body h3 {
        font-family: 'Satoshi', 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: #07111f;
        margin: 24px 0 8px;
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .nd-legal-modal__body h3::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 14px;
        background: #18a8ff;
        border-radius: 2px;
        flex-shrink: 0;
      }
      .nd-legal-modal__body p {
        font-size: 0.875rem;
        color: #5e6b7c;
        line-height: 1.78;
        margin-bottom: 12px;
      }
      .nd-legal-modal__body ul {
        padding-left: 18px;
        margin-bottom: 12px;
      }
      .nd-legal-modal__body ul li {
        font-size: 0.875rem;
        color: #5e6b7c;
        line-height: 1.7;
        margin-bottom: 6px;
      }
      .nd-legal-modal__body strong { color: #07111f; font-weight: 600; }
      .nd-legal-modal__body a { color: #18a8ff; text-decoration: none; }
      .nd-legal-modal__body a:hover { text-decoration: underline; }

      .nd-legal-highlight {
        background: rgba(24,168,255,0.06);
        border: 1px solid rgba(24,168,255,0.15);
        border-radius: 10px;
        padding: 12px 16px;
        margin: 18px 0;
        font-size: 0.85rem;
        color: #07111f;
        line-height: 1.65;
      }

      /* Panel visibility */
      .nd-legal-panel { display: none; }
      .nd-legal-panel.active { display: block; }

      .nd-legal-modal__footer {
        padding: 14px 24px;
        border-top: 1px solid rgba(7,17,31,0.07);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        gap: 12px;
        background: #f8faff;
        flex-wrap: wrap;
      }
      .nd-legal-modal__footer-note {
        font-size: 0.75rem;
        color: #8f9baa;
        flex: 1;
        min-width: 160px;
      }
      .nd-legal-close-btn {
        padding: 9px 22px;
        border-radius: 50px;
        background: #07111f;
        color: #ffffff;
        border: none;
        font-family: 'Satoshi', 'Inter', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
      }
      .nd-legal-close-btn:hover { background: #1a3050; }
    `;
    document.head.appendChild(style);
  }

  // ── Build modal DOM once ──────────────────────────────────────────────────
  function buildModal() {
    if (document.getElementById('ndLegalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ndLegalOverlay';
    overlay.className = 'nd-legal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Legal documents');

    overlay.innerHTML = `
      <div class="nd-legal-modal" id="ndLegalModal">
        <div class="nd-legal-modal__handle"></div>

        <div class="nd-legal-modal__header">
          <div class="nd-legal-modal__tabs">
            <button class="nd-legal-tab active" id="ndTabPrivacy" onclick="openLegal('privacy')">
              🔒 Privacy Policy
            </button>
            <button class="nd-legal-tab" id="ndTabTerms" onclick="openLegal('terms')">
              📄 Terms of Service
            </button>
          </div>
          <button class="nd-legal-modal__close" onclick="closeLegal()" aria-label="Close">✕</button>
        </div>

        <div class="nd-legal-modal__body" id="ndLegalBody">

          <!-- PRIVACY POLICY PANEL -->
          <div class="nd-legal-panel active" id="ndPanelPrivacy">
            <h2>Privacy Policy</h2>
            <span class="nd-legal-meta">Effective Date: January 1, 2025 &nbsp;·&nbsp; Last updated: June 2025</span>

            <div class="nd-legal-highlight">
              NeuroDesk is operated by Stephen Muema ("we", "us", "our"). We respect your privacy and are committed to handling your personal data responsibly. This policy explains what we collect, why, and your rights — written in plain language.
            </div>

            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly when you:</p>
            <ul>
              <li><strong>Create an account</strong> — name, email address, and profile photo (optional).</li>
              <li><strong>Submit a project order or quote request</strong> — project details, deadlines, requirements, and any files you share.</li>
              <li><strong>Contact us via email or WhatsApp</strong> — your contact details and message content.</li>
              <li><strong>Use the client portal</strong> — order status checks and project updates.</li>
            </ul>
            <p>We also automatically collect standard technical data when you visit our site: IP address, browser type, device, pages visited, and time of visit. This is handled by Vercel (our hosting provider) and Firebase (our authentication and data platform).</p>

            <h3>2. How We Use Your Information</h3>
            <ul>
              <li>To deliver, manage, and communicate about your project.</li>
              <li>To send you service updates, invoices, and revision notifications.</li>
              <li>To maintain your account and verify your identity.</li>
              <li>To improve our website, troubleshoot issues, and understand usage patterns.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p>We do <strong>not</strong> sell, rent, or trade your personal information to any third party.</p>

            <h3>3. Data Sharing & Third Parties</h3>
            <p>We share data only where necessary to operate our service:</p>
            <ul>
              <li><strong>Firebase / Google</strong> — authentication, database, and storage. <a href="https://policies.google.com/privacy" target="_blank">Google Privacy Policy →</a></li>
              <li><strong>Vercel</strong> — website hosting. <a href="https://vercel.com/legal/privacy-policy" target="_blank">Vercel Privacy Policy →</a></li>
              <li><strong>WhatsApp / Meta</strong> — if you contact us via WhatsApp, Meta's policies apply to that communication.</li>
            </ul>
            <p>We do not use advertising networks, retargeting pixels, or data brokers.</p>

            <h3>4. Confidentiality of Your Work</h3>
            <p>Any project materials, academic content, datasets, source code, or business information you share with us is treated as strictly confidential. We do not share, publish, or use your work for any purpose other than completing your project. We are happy to sign a mutual NDA upon request.</p>

            <h3>5. Data Retention</h3>
            <p>We retain your account data as long as your account is active. Project-related files and communications are retained for up to 12 months after project completion to allow for revisions and support, then securely deleted unless you request otherwise.</p>

            <h3>6. Cookies</h3>
            <p>Our site uses only essential cookies — primarily Firebase authentication tokens (to keep you logged in) and basic session cookies. We do not use tracking cookies, advertising cookies, or third-party analytics cookies that identify you personally.</p>

            <h3>7. Your Rights</h3>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Object to or restrict how we process your data.</li>
              <li>Data portability (receive your data in a structured format).</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:musyokas753@gmail.com">musyokas753@gmail.com</a>. We will respond within 14 days.</p>

            <h3>8. Security</h3>
            <p>We implement industry-standard security measures: Firebase Authentication with secure tokens, HTTPS encryption on all pages, and access controls limiting who can view project data. No method of transmission over the internet is 100% secure, but we take your data security seriously.</p>

            <h3>9. Children's Privacy</h3>
            <p>Our services are intended for users aged 16 and over. We do not knowingly collect personal data from children under 16. If you believe we have inadvertently collected such data, please contact us immediately for deletion.</p>

            <h3>10. Changes to This Policy</h3>
            <p>We may update this Privacy Policy as our services evolve. Material changes will be communicated via the email address associated with your account. Continued use of the service after changes constitutes acceptance of the updated policy.</p>

            <h3>11. Contact</h3>
            <p>Questions about this policy? Reach us at:<br>
            📧 <a href="mailto:musyokas753@gmail.com">musyokas753@gmail.com</a><br>
            💬 <a href="https://wa.me/254740624253" target="_blank">WhatsApp: +254 740 624 253</a></p>
          </div>

          <!-- TERMS OF SERVICE PANEL -->
          <div class="nd-legal-panel" id="ndPanelTerms">
            <h2>Terms of Service</h2>
            <span class="nd-legal-meta">Effective Date: January 1, 2025 &nbsp;·&nbsp; Last updated: June 2025</span>

            <div class="nd-legal-highlight">
              Please read these Terms carefully before using NeuroDesk services. By placing an order, creating an account, or using this website, you agree to be bound by these Terms.
            </div>

            <h3>1. About NeuroDesk</h3>
            <p>NeuroDesk ("we", "us", "our") is a professional freelance services platform operated by Stephen Muema, providing Data Science & Machine Learning, Web Development, and Academic Writing services to clients worldwide. We are not a generic marketplace — all services are delivered by our vetted specialist(s).</p>

            <h3>2. Eligibility</h3>
            <p>You must be at least 16 years old to use our services. By using NeuroDesk, you represent that you meet this requirement. If you are using our services on behalf of an organization, you represent that you are authorized to bind that organization to these Terms.</p>

            <h3>3. Services & Orders</h3>
            <ul>
              <li><strong>Quote requests</strong> are non-binding until both parties confirm the project scope, price, and deadline in writing (email or WhatsApp).</li>
              <li>Once confirmed, an order is considered active and subject to the agreed terms.</li>
              <li>We reserve the right to decline any project that conflicts with our values, capacity, or ethical standards.</li>
              <li>Timelines are agreed per-project. We commit to delivering on time, and we communicate proactively if any delays arise.</li>
            </ul>

            <h3>4. Payments</h3>
            <ul>
              <li>Payment terms are agreed before project commencement and confirmed in writing.</li>
              <li>For new clients, a deposit (typically 50%) may be required before work begins.</li>
              <li>Final payment is due upon delivery of the completed work, before full transfer of files.</li>
              <li>Accepted payment methods are communicated at the time of order confirmation.</li>
              <li>All prices are quoted in USD unless otherwise stated. Currency conversion risk is borne by the client.</li>
            </ul>

            <h3>5. Revisions & Satisfaction Guarantee</h3>
            <p>We offer revisions until you are satisfied, within the scope of the original project brief. Revisions must be requested within <strong>14 days</strong> of delivery. A revision is a refinement of the agreed deliverable — not a new or significantly changed requirement.</p>
            <p>If your requirements change materially after work has begun, additional fees may apply and a new timeline will be agreed upon.</p>

            <h3>6. Intellectual Property & Ownership</h3>
            <ul>
              <li>Upon receipt of full payment, you receive full ownership of all deliverables produced for your project.</li>
              <li>NeuroDesk retains no rights to your deliverables after transfer, unless otherwise agreed in writing.</li>
              <li>You grant us permission to use anonymized, aggregate project data (e.g. type of project, technology used) for internal quality improvement — never your specific content.</li>
              <li>We will <strong>never</strong> publish, resell, or display your work publicly without your explicit written consent.</li>
            </ul>

            <h3>7. Confidentiality</h3>
            <p>We treat all client information, project details, and business data as strictly confidential. We are willing to sign a mutual Non-Disclosure Agreement (NDA) before project commencement upon request. Our confidentiality commitment applies indefinitely — even after a project is completed.</p>

            <h3>8. Academic Integrity</h3>
            <p>Our academic writing services are intended as reference, research assistance, model answers, and educational support materials. By commissioning academic writing, you confirm that your use complies with your institution's policies on external assistance. We produce original, plagiarism-free content; all deliverables are checked with professional plagiarism detection tools.</p>
            <p>NeuroDesk accepts no liability for misuse of academic deliverables in ways that violate an institution's academic integrity policies.</p>

            <h3>9. Refunds & Cancellations</h3>
            <ul>
              <li><strong>Before work begins:</strong> Full refund of any deposit paid.</li>
              <li><strong>After work has begun (less than 50% complete):</strong> Partial refund at our discretion, based on work completed.</li>
              <li><strong>After delivery:</strong> No refund once the final deliverable has been accepted. Revision requests will be honoured instead.</li>
              <li>Disputes must be raised within 7 days of delivery. We are committed to resolving all disputes fairly and promptly.</li>
            </ul>

            <h3>10. Prohibited Uses</h3>
            <p>You agree not to use our services to:</p>
            <ul>
              <li>Create content that is illegal, defamatory, or harmful.</li>
              <li>Infringe on any third party's intellectual property or privacy rights.</li>
              <li>Attempt to deceive, defraud, or misrepresent your identity or organizational affiliation.</li>
              <li>Engage in any activity that violates applicable law.</li>
            </ul>

            <h3>11. Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, NeuroDesk's total liability for any claim arising from our services shall not exceed the total amount paid by you for the specific project giving rise to the claim. We are not liable for indirect, incidental, consequential, or punitive damages.</p>
            <p>We are not liable for outcomes resulting from the client's misuse or misrepresentation of deliverables.</p>

            <h3>12. Governing Law</h3>
            <p>These Terms are governed by the laws of the Republic of Kenya. Any disputes that cannot be resolved amicably shall be subject to the exclusive jurisdiction of Kenyan courts, unless otherwise agreed in writing.</p>

            <h3>13. Changes to These Terms</h3>
            <p>We may update these Terms as our services evolve. Continued use of our services after changes are posted constitutes acceptance. Material changes will be communicated via email where possible.</p>

            <h3>14. Contact</h3>
            <p>Questions about these Terms? Contact us:<br>
            📧 <a href="mailto:musyokas753@gmail.com">musyokas753@gmail.com</a><br>
            💬 <a href="https://wa.me/254740624253" target="_blank">WhatsApp: +254 740 624 253</a></p>
          </div>

        </div>

        <div class="nd-legal-modal__footer">
          <span class="nd-legal-modal__footer-note">© 2025 NeuroDesk · All rights reserved · Last reviewed June 2025</span>
          <button class="nd-legal-close-btn" onclick="closeLegal()">Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLegal();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLegal();
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.openLegal = function (tab) {
    injectStyles();
    buildModal();

    const overlay    = document.getElementById('ndLegalOverlay');
    const body       = document.getElementById('ndLegalBody');
    const panelPriv  = document.getElementById('ndPanelPrivacy');
    const panelTerms = document.getElementById('ndPanelTerms');
    const tabPriv    = document.getElementById('ndTabPrivacy');
    const tabTerms   = document.getElementById('ndTabTerms');

    if (!overlay) return;

    // Switch panel
    if (tab === 'terms') {
      panelPriv.classList.remove('active');
      panelTerms.classList.add('active');
      tabPriv.classList.remove('active');
      tabTerms.classList.add('active');
    } else {
      panelTerms.classList.remove('active');
      panelPriv.classList.add('active');
      tabTerms.classList.remove('active');
      tabPriv.classList.add('active');
    }

    // Reset scroll
    if (body) body.scrollTop = 0;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLegal = function () {
    const overlay = document.getElementById('ndLegalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

})();
