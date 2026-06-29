/**
 * NeuroDesk — Firebase Navbar Auth State
 * Uses the DEFAULT Firebase app so auth state is shared across
 * ALL pages (auth.html, portal.html, every other page).
 * Loaded as type="module" on every page.
 */
import { initializeApp, getApps, getApp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyAKcYrxurk5mFdZ-bXnogmcBm-_lros39s",
  authDomain:        "neurodesk-6ce1c.firebaseapp.com",
  projectId:         "neurodesk-6ce1c",
  storageBucket:     "neurodesk-6ce1c.firebasestorage.app",
  messagingSenderId: "542956863300",
  appId:             "1:542956863300:web:f39b2ff82ab0a3221f6111"
};

// Use DEFAULT app — same instance as auth.html & portal.html
// so Firebase Auth persistence works across all pages.
const fbApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth  = getAuth(fbApp);

// ── Path helpers ───────────────────────────────────────────────────────────
const inPages  = window.location.pathname.includes('/pages/');
const inBlog   = window.location.pathname.includes('/blog/');
const authHref    = inPages ? 'auth.html'
                 : inBlog  ? '../pages/auth.html'
                 :            'pages/auth.html';
const profileHref = inPages ? 'profile.html'
                 : inBlog  ? '../pages/profile.html'
                 :            'pages/profile.html';
const homeHref    = (inPages || inBlog) ? '../index.html' : 'index.html';

// ── Auth state observer ────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  const wrap = document.getElementById('navUserWrap');
  const link = document.getElementById('navSigninLink');
  // Also update mobile menu sign-in link if it exists
  const mobileSigninLink = document.getElementById('mobileSigninLink');

  if (user) {
    const name   = user.displayName || user.email || 'Account';
    const first  = name.split(' ')[0];
    const init   = first.charAt(0).toUpperCase();
    const photo  = user.photoURL || '';
    const avatar = photo
      ? `<img src="${photo}" alt="${init}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
      : init;

    // Desktop: replace Sign In with user avatar pill → links to profile page
    if (wrap) {
      wrap.style.display = 'flex';
      wrap.innerHTML = `
        <a href="${profileHref}" class="navbar__user-btn" title="View profile — ${name}">
          <span class="navbar__user-avatar">${avatar}</span>
          <span class="navbar__user-name">${first}</span>
        </a>`;
    }
    if (link) link.style.display = 'none';

    // Mobile: update the injected sign-in link to show profile
    if (mobileSigninLink) {
      mobileSigninLink.href = profileHref;
      mobileSigninLink.innerHTML = `<i class="fas fa-user-circle"></i> My Profile (${first})`;
      mobileSigninLink.style.color = 'var(--color-accent-cyan)';
    }

  } else {
    if (wrap) wrap.style.display = 'none';
    if (link) {
      link.style.display = 'flex';
      link.href = authHref;
    }
    if (mobileSigninLink) {
      mobileSigninLink.href = authHref;
      mobileSigninLink.innerHTML = '<i class="fas fa-user-circle"></i> Sign In / Register';
      mobileSigninLink.style.color = 'var(--color-accent-violet)';
    }
  }
});

// ── Global sign-out ────────────────────────────────────────────────────────
window.ndSignOut = async function () {
  try {
    await signOut(auth);
    window.location.href = homeHref;
  } catch (e) {
    console.error('Sign out error:', e);
  }
};
