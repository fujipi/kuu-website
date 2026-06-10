"use client";

import { type FormEvent, useState } from "react";
import { FORMSPREE_NEWSLETTER, trackEvent } from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ニュースレター登録（メールアドレスのみの1フィールド）。
 * Formspree に form_type: newsletter として送信する。
 */
export default function NewsletterSignup() {
	const [status, setStatus] = useState<Status>("idle");
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const email = String(new FormData(form).get("email") ?? "").trim();
		if (!EMAIL_RE.test(email)) {
			setError("メールアドレスの形式が正しくありません");
			return;
		}
		setError(null);
		setStatus("submitting");
		try {
			const body = new FormData(form);
			body.set("form_type", "newsletter");
			body.set("_subject", "ニュースレター登録");
			const res = await fetch(FORMSPREE_NEWSLETTER, {
				method: "POST",
				body,
				headers: { Accept: "application/json" },
			});
			if (res.ok) {
				setStatus("success");
				trackEvent("newsletter_signup");
				form.reset();
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	};

	if (status === "success") {
		return (
			<p
				role="status"
				style={{ fontSize: "0.8rem", color: "var(--gray-light)" }}
			>
				ご登録ありがとうございます。最新記事・ユースケースをお届けします。
			</p>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate className="newsletter-form">
			<input
				type="text"
				name="_gotcha"
				style={{ display: "none" }}
				tabIndex={-1}
				autoComplete="off"
			/>
			<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
				<input
					type="email"
					name="email"
					required
					placeholder="メールアドレス"
					aria-label="ニュースレター登録用メールアドレス"
					style={{
						flex: "1 1 200px",
						background: "rgba(255,255,255,0.03)",
						border: "1px solid var(--gray-dark)",
						borderRadius: "3px",
						padding: "0.55rem 0.8rem",
						color: "var(--white)",
						fontSize: "0.8rem",
						fontFamily: "var(--font-body)",
						outline: "none",
					}}
				/>
				<button
					type="submit"
					disabled={status === "submitting"}
					style={{
						background: "transparent",
						border: "1px solid var(--gray-medium)",
						borderRadius: "3px",
						color: "var(--white)",
						fontSize: "0.75rem",
						fontFamily: "var(--font-heading)",
						letterSpacing: "0.05em",
						padding: "0.55rem 1.2rem",
						cursor: "pointer",
					}}
				>
					{status === "submitting" ? "登録中…" : "登録"}
				</button>
			</div>
			{error ? (
				<p className="form-error" role="alert" style={{ marginTop: "0.5rem" }}>
					{error}
				</p>
			) : null}
			{status === "error" ? (
				<p className="form-error" role="alert" style={{ marginTop: "0.5rem" }}>
					登録に失敗しました。時間をおいて再度お試しください。
				</p>
			) : null}
		</form>
	);
}
