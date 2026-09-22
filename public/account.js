// account.js — optional email/password auth (Supabase's built-in auth.users).
// Anonymous usage keeps working everywhere else; signing in just lets new
// QBank attempts and flashcard decks attach to a real user instead of the
// anonymous attempt-id / localStorage owner-id.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

export async function mountAccount(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading account&hellip;</div>`;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    renderSignedIn(appEl, supabase, user);
  } else {
    renderSignedOut(appEl, supabase);
  }
}

function renderSignedIn(appEl, supabase, user) {
  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Account</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:20px;">
      Signed in. New QBank attempts and flashcards you create from here on are attached to this account instead of this browser only.
    </p>
    <div class="block-card" style="max-width:420px;">
      <h3>Signed in as</h3>
      <p>${escapeHtml(user.email || user.id)}</p>
      <button class="exam-btn primary" id="btn-sign-out">Sign out</button>
    </div>
  `;

  appEl.querySelector('#btn-sign-out').addEventListener('click', async () => {
    await supabase.auth.signOut();
    mountAccount(appEl, supabase);
  });
}

function renderSignedOut(appEl, supabase) {
  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Account</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:20px;">
      Optional — QBank and Flashcards work fully anonymously, no account needed.
      Signing in just attaches new attempts and decks to your account so they follow you across devices.
    </p>

    <div class="section-label">Sign in</div>
    <form id="signin-form" class="block-card" style="max-width:420px;display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
      <input id="signin-email" type="email" autocomplete="email" placeholder="Email" required
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;">
      <input id="signin-password" type="password" autocomplete="current-password" placeholder="Password" required
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;">
      <button class="exam-btn primary" type="submit" style="width:fit-content;">Sign in</button>
      <div id="signin-msg" style="font-size:12.5px;"></div>
    </form>

    <div class="section-label">Create an account</div>
    <form id="signup-form" class="block-card" style="max-width:420px;display:flex;flex-direction:column;gap:8px;">
      <input id="signup-email" type="email" autocomplete="email" placeholder="Email" required
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;">
      <input id="signup-password" type="password" autocomplete="new-password" placeholder="Password (min 6 characters)" minlength="6" required
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;">
      <button class="exam-btn primary" type="submit" style="width:fit-content;">Sign up</button>
      <div id="signup-msg" style="font-size:12.5px;"></div>
    </form>
  `;

  appEl.querySelector('#signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = appEl.querySelector('#signin-email').value.trim();
    const password = appEl.querySelector('#signin-password').value;
    const msg = appEl.querySelector('#signin-msg');
    msg.textContent = '';

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      msg.style.color = 'var(--incorrect)';
      msg.textContent = error.message;
      return;
    }
    mountAccount(appEl, supabase);
  });

  appEl.querySelector('#signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = appEl.querySelector('#signup-email').value.trim();
    const password = appEl.querySelector('#signup-password').value;
    const msg = appEl.querySelector('#signup-msg');
    msg.textContent = '';

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      msg.style.color = 'var(--incorrect)';
      msg.textContent = error.message;
      return;
    }
    if (data.session) {
      // Email confirmation is off on this project — signUp already returned a session.
      mountAccount(appEl, supabase);
    } else {
      msg.style.color = 'var(--correct)';
      msg.textContent = 'Account created. Check your email to confirm, then sign in above.';
    }
  });
}
