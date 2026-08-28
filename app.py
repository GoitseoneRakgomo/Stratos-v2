from pathlib import Path

from flask import Flask, redirect, render_template, request, send_from_directory, session, url_for


BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["SECRET_KEY"] = "stratos-local-development-key"

USERS = {
    "client": {"password": "stratos2026", "role": "client", "display_name": "Client"},
    "admin": {"password": "stratos2026", "role": "admin", "display_name": "Admin"},
}


@app.get("/")
def home():
    return render_template("home.html")


@app.get("/logo")
def logo():
    return send_from_directory(BASE_DIR, "STRATOS Primary Logo.svg.svg")


@app.get("/images/<path:filename>")
def image_asset(filename):
    return send_from_directory(BASE_DIR / "images", filename)


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        username = request.form.get("username", "").strip().lower()
        password = request.form.get("password", "")
        selected_role = request.form.get("role", "client")
        user = USERS.get(username)
        if user and user["password"] == password and user["role"] == selected_role:
            session["username"] = username
            session["role"] = user["role"]
            session["display_name"] = user["display_name"]
            return redirect(url_for("client_dashboard" if user["role"] == "client" else "admin_dashboard"))
        error = "The portal, username, or password does not match."
    return render_template("login.html", error=error)


@app.get("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.get("/client/")
def client_dashboard():
    if session.get("role") != "client":
        return redirect(url_for("login"))
    return render_template("client/dashboard.html")


@app.get("/admin/")
def admin_dashboard():
    if session.get("role") != "admin":
        return redirect(url_for("login"))
    return render_template("admin/dashboard.html")


@app.get("/about")
def about():
    return render_template("about.html")


@app.get("/services")
def services():
    return render_template("services.html")


@app.get("/faqs")
def faqs():
    return render_template("faqs.html")


@app.get("/articles")
def articles():
    return render_template("articles.html")

@app.get("/cookie-policy")
def cookie_policy():
    return render_template("cookie_policy.html")

@app.get("/terms")
def terms():
    return render_template("terms.html")


@app.get("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    return render_template("contact.html")


@app.route("/appointments", methods=["GET", "POST"])
def appointments():
    return render_template("appointments.html")


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True)
