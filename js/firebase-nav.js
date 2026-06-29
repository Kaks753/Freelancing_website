/**
 * NeuroDesk — Firebase Navbar Auth State
 * Loaded as type="module" on every page except portal.html and auth.html.
 * Shows user pill when signed in, "Sign In" link when logged out.
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

// Safe init: if already initialized under this name use existing app
const APP_NAME = 'neurodesk-nav';
const fbApp = getApps().find(a => a.name === APP_NAME)
  ? getApp(APP_NAME)
  : initializeApp(firebaseConfig, APP_NAME);

const auth = getAuth(fbApp);

// ── Path helpers ───────────────────────────────────────────────────────────
const inPages = window.location.pathname.includes('/pages/');
const inBlog  = window.location.pathname.includes('/blog/');
const authHref = inPages ? 'auth.html'
               : inBlog  ? '../pages/auth.html'
               :            'pages/auth.html';
const homeHref = (inPages || inBlog) ? '../index.html' : 'index.html';

// ── Auth state observer ────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  const wrap = document.getElementById('navUserWrap');
  const link = document.getElementById('navSigninLink');

  if (user) {
    // Persist minimal profile in sessionStorage for instant reads
    sessionStorage.setItem('nd_user', JSON.stringify({
      name:     user.displayName || user.email,
      email:    user.email,
      photoURL: user.photoURL || ''
    }));

    const name   = user.displayName || user.email || 'Account';
    const first  = name.split(' ')[0];
    const init   = first.charAt(0).toUpperCase();
    const photo  = user.photoURL || '';
    const avatar = photo
      ? `<img src="${photo}" alt="${init}" style="width:100%;height:100%;object-fit:cover;" />`
      : init;

    if (wrap) {
      wrap.style.display = 'flex';
      wrap.innerHTML = `
        <a href="${authHref}" class="navbar__user-btn" title="${name}">
          <span class="navbar__user-avatar">${avatar}</span>
          <span class="navbar__user-name">${first}</span>
        </a>`;
    }
    if (link) link.style.display = 'none';

  } else {
    sessionStorage.removeItem('nd_user');
    if (wrap) wrap.style.display = 'none';
    if (link) {
      link.style.display = 'flex';
      link.href = authHref;
    }
  }
});

// ── Global sign-out (callable via onclick="ndSignOut()") ───────────────────
window.ndSignOut = async function () {
  await signOut(auth);
  sessionStorage.removeItem('nd_user');
  window.location.href = homeHref;
};
