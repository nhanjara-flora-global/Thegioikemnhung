"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [{ error, username }, action, pending] = useActionState(loginAction, { error: "", username: "" });
  return (
    <form action={action} className="ad-form">
      <label className="ad-field">
        <span>Tên đăng nhập</span>
        <input className="ad-input" name="username" defaultValue={username} autoComplete="username" required autoFocus={!error} />
      </label>
      <label className="ad-field">
        <span>Mật khẩu</span>
        <input className="ad-input" name="password" type="password" autoComplete="current-password" required autoFocus={Boolean(error)} />
      </label>
      {error && <p className="ad-error" role="alert">{error}</p>}
      <button className="kn-btn kn-btn--primary kn-btn--block" disabled={pending}>
        {pending ? "Đang vào…" : "Đăng nhập"}
      </button>
    </form>
  );
}
