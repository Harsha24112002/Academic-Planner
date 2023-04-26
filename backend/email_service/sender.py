from flask_mail import Mail, Message
mail = Mail()

def send_email(to, subject, body):
    message = Message(subject=subject, recipients=[to], body=body)
    mail.send(message)