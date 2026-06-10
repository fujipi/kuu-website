"use client";

import { type FormEvent, useState } from "react";
import { FORMSPREE_CONTACT, trackEvent } from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
	company?: string;
	name?: string;
	email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 問い合わせフォーム。クライアントバリデーション → fetch POST（AJAX）→
 * 成功/失敗の状態表示。JS無効環境でも素の form POST として動くよう
 * action/method は残す（プログレッシブエンハンスメント）。
 */
export default function ContactForm() {
	const [status, setStatus] = useState<Status>("idle");
	const [errors, setErrors] = useState<FieldErrors>({});

	const validate = (form: HTMLFormElement): FieldErrors => {
		const data = new FormData(form);
		const next: FieldErrors = {};
		if (!String(data.get("company") ?? "").trim()) {
			next.company = "会社名を入力してください";
		}
		if (!String(data.get("name") ?? "").trim()) {
			next.name = "お名前を入力してください";
		}
		const email = String(data.get("email") ?? "").trim();
		if (!email) {
			next.email = "メールアドレスを入力してください";
		} else if (!EMAIL_RE.test(email)) {
			next.email = "メールアドレスの形式が正しくありません";
		}
		return next;
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const fieldErrors = validate(form);
		setErrors(fieldErrors);
		if (Object.keys(fieldErrors).length > 0) return;

		setStatus("submitting");
		try {
			const res = await fetch(FORMSPREE_CONTACT, {
				method: "POST",
				body: new FormData(form),
				headers: { Accept: "application/json" },
			});
			if (res.ok) {
				setStatus("success");
				trackEvent("form_submit", { form_type: "contact" });
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
			<div className="form-success" role="status">
				<p
					style={{
						fontSize: "0.95rem",
						color: "var(--white)",
						marginBottom: "0.75rem",
					}}
				>
					送信が完了しました。
				</p>
				<p style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}>
					通常1〜2営業日以内にご返信いたします。
				</p>
			</div>
		);
	}

	return (
		<>
			<form
				className="contact-form"
				action={FORMSPREE_CONTACT}
				method="POST"
				onSubmit={onSubmit}
				noValidate
			>
				<input
					type="text"
					name="_gotcha"
					style={{ display: "none" }}
					tabIndex={-1}
					autoComplete="off"
				/>
				<div className="form-group">
					<label htmlFor="company">
						会社名 <span className="required">*</span>
					</label>
					<input
						type="text"
						id="company"
						name="company"
						required
						placeholder="例：株式会社サンプル"
						aria-invalid={!!errors.company}
					/>
					{errors.company ? (
						<p className="form-error" role="alert">
							{errors.company}
						</p>
					) : null}
				</div>
				<div className="form-group">
					<label htmlFor="name">
						お名前 <span className="required">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						placeholder="例：山田 太郎"
						aria-invalid={!!errors.name}
					/>
					{errors.name ? (
						<p className="form-error" role="alert">
							{errors.name}
						</p>
					) : null}
				</div>
				<div className="form-group">
					<label htmlFor="email">
						メールアドレス <span className="required">*</span>
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						placeholder="例：yamada@example.com"
						aria-invalid={!!errors.email}
					/>
					{errors.email ? (
						<p className="form-error" role="alert">
							{errors.email}
						</p>
					) : null}
				</div>
				<div className="form-group">
					<label htmlFor="service">お問い合わせ種別</label>
					<select id="service" name="service">
						<option value="">選択してください</option>
						<option value="プロジェクトのご相談">プロジェクトのご相談</option>
						<option value="業務提携について">業務提携について</option>
						<option value="採用について">採用について</option>
						<option value="その他">その他</option>
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="message">メッセージ</label>
					<textarea
						id="message"
						name="message"
						rows={6}
						placeholder="ご相談内容やご質問をご記入ください"
					/>
				</div>
				<button
					type="submit"
					className="btn-submit"
					disabled={status === "submitting"}
				>
					{status === "submitting" ? "送信中…" : "送信する"}
				</button>
			</form>
			{status === "error" ? (
				<p className="form-error" role="alert" style={{ marginTop: "1rem" }}>
					送信に失敗しました。お手数ですが、時間をおいて再度お試しください。
				</p>
			) : null}
			<p className="form-note">通常1〜2営業日以内にご返信いたします。</p>
		</>
	);
}
