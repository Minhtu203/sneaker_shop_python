import smtplib
from email.message import EmailMessage

from ..core.config import settings


def send_otp_email(to_email: str, otp: str) -> None:
    if not settings.EMAIL_USER or not settings.EMAIL_PASSWORD:
        # Không cấu hình email thì bỏ qua (dev mode)
        return

    msg = EmailMessage()
    msg["Subject"] = "OTP đặt lại mật khẩu - SneakerT"
    msg["From"] = settings.EMAIL_USER
    msg["To"] = to_email
    msg.set_content(
        f"Mã OTP của bạn là: {otp}\nMã OTP sẽ hết hạn sau 5 phút",
    )
    msg.add_alternative(
        f"""
        <h2>Mã OTP của bạn là: {otp}</h2>
        <h4>Mã OTP sẽ hết hạn sau 5 phút</h4>
        """,
        subtype="html",
    )

    # Gmail SMTP SSL
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
        server.send_message(msg)



