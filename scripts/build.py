import json, re, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
d = json.loads((ROOT / "content/site.json").read_text())
P = d["profile"]
ROLES = {"sde": "Software Engineering (SDE)", "ml": "Machine Learning / AI", "quant": "Quantitative (Quant)"}
AREA = {"cs": "Core CS", "systems": "Systems", "math": "Math", "ml": "ML / AI", "quant": "Finance / Quant"}


def build(role=None):
    o = []
    a = o.append
    title = "Daksh Mor: Career Profile" + (f" ({ROLES[role]} focus)" if role else "")
    a(f"# {title}")
    a("")
    a("> Complete, up-to-date career information for Daksh Mor, kept for AI assistants that help him fill job and internship applications. Use these facts as-is; do not invent anything. If a field is not here, ask Daksh.")
    a("> Source: https://dakshmor.in · Role versions: /llms-sde.txt /llms-ml.txt /llms-quant.txt · Full: /llms.txt")
    a("")
    a("## Summary")
    a(d["agentBio"])
    a("")

    a("## Personal & Contact")
    for k, label in [("fullName", "Full name"), ("email", "Email"), ("phone", "Phone"), ("currentLocation", "Current location"), ("nationality", "Nationality"), ("workAuthorization", "Work authorization"), ("website", "Website"), ("linkedin", "LinkedIn"), ("github", "GitHub")]:
        a(f"- {label}: {P['personal'][k]}")
    for s in d["social"]:
        if s["name"] not in ("GitHub", "LinkedIn"):
            a(f"- {s['name']}: {s['url']}")
    a(f"- Resume (PDF): {d['site']['resume']}")
    a("")

    E = P["education"]
    c = E["college"]
    a("## Education")
    a(f"### {c['institute']}")
    a(f"- Degree: {c['degree']}, {c['branch']}")
    a(f"- CGPA: {c['cgpa']}")
    a(f"- Admitted: {c['admitted']} via {c['admissionVia']} · Expected graduation: {c['expectedGraduation']} · Currently in semester {c['currentSemester']}")
    a(f"- Admission number: {c['admissionNumber']}")
    a("- Semester-wise: " + " · ".join(f"S{s['semester']} SGPA {s['sgpa']} / CGPA {s['cgpa']}" for s in c["semesters"]))
    a("")
    a("### Relevant coursework (grade)")
    order = ["cs", "systems", "ml", "math", "quant"]
    if role == "ml":
        order = ["ml", "math", "cs", "systems", "quant"]
    if role == "quant":
        order = ["math", "quant", "cs", "ml", "systems"]
    courses = [x for s in c["semesters"] for x in s["courses"]]
    for ar in order:
        items = [f"{x['name']} ({x['grade']})" for x in courses if x["area"] == ar]
        if items:
            a(f"- {AREA[ar]}: " + ", ".join(items))
    a("")
    a("### Full grade sheet")
    for s in c["semesters"]:
        a(f"- Semester {s['semester']} ({s['session']}), SGPA {s['sgpa']}, CGPA {s['cgpa']}: " + "; ".join(f"{x['code']} {x['name']} [{x['credits']} cr] {x['grade']}" for x in s["courses"]))
    a("")
    a("### School")
    for x in E["school"]:
        a(f"- {x['level']}: {x['score']}")
    a("")
    a("### Competitive exams")
    for x in E["exams"]:
        a(f"- {x['exam']}: {x['result']}")
    a("")

    a("## Work Experience")
    for e in d["experiences"]:
        a(f"### {e['role']}, {e['company']} ({e['period']}, {e.get('location', '')})")
        a(e["summary"])
        for x in e.get("details", []):
            a(f"- {x}")
        a("")

    a("## Skills")
    for k, v in P["skills"].items():
        a(f"- {k}: {', '.join(v)}")
    a("")

    a("## Achievements")
    for m in d["milestones"]:
        a(f"- {m['title']}: {m['detail']}")
    a("")

    a("## Positions of Responsibility")
    for x in P["positions"]:
        a(f"- {x['role']}, {x['org']}: {x['detail']}")
    a("")

    a(f"## Projects ({len(d['projects'])})")
    for p in d["projects"]:
        a(f"### {p['title']} ({p['date']})")
        a(p["description"])
        if p.get("tags"):
            a(f"- Tech: {', '.join(p['tags'])}")
        for k, lab in [("link", "linkLabel"), ("liveUrl", "liveLabel"), ("itchUrl", "itchLabel")]:
            if p.get(k):
                a(f"- {p.get(lab) or 'Link'}: {p[k]}")
        rb = p.get("roleBreakdown") or {}
        for r in ([role] if role else ROLES):
            if rb.get(r):
                a(f"- {ROLES[r]} angle: {rb[r]}")
        a("")

    a("## Ready Answers (drafts for common application questions)")
    for q in P["readyAnswers"]:
        a(f"### {q['q']}")
        if q.get("general"):
            a(q["general"])
        for r in ([role] if role else ROLES):
            if q.get(r):
                a(f"- {ROLES[r]}: {q[r]}" if not role else q[r])
        a("")

    a("## Not on file (ask Daksh)")
    a(", ".join(P["notOnFile"]))
    a("")
    return "\n".join(o)


full = build()
(ROOT / "llms.txt").write_text(full)
for r in ROLES:
    (ROOT / f"llms-{r}.txt").write_text(build(r))

pers = P["personal"]
ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": pers["fullName"],
    "url": pers["website"],
    "email": "mailto:" + pers["email"],
    "telephone": pers["phone"],
    "image": "https://dakshmor.in/profile.jpg",
    "jobTitle": "Computer Science Undergraduate, ML Engineer",
    "alumniOf": {"@type": "CollegeOrUniversity", "name": P["education"]["college"]["institute"]},
    "sameAs": [s["url"] for s in d["social"]],
    "knowsAbout": [x for v in P["skills"].values() for x in v][:30],
    "description": d["agentBio"],
}
ld_html = '<script type="application/ld+json" id="ld-profile">' + json.dumps(ld, ensure_ascii=False) + "</script>"
sec_html = '<section id="ai-profile" class="ai-profile" aria-hidden="true"><pre>' + html.escape(full) + "</pre></section>"

for f in ["index.html", "projects.html"]:
    p = ROOT / f
    s = p.read_text()
    s = re.sub(r'\s*<script type="application/ld\+json" id="ld-profile">.*?</script>', "", s, flags=re.S)
    s = re.sub(r'\s*<section id="ai-profile".*?</section>', "", s, flags=re.S)
    s = s.replace("</head>", "    " + ld_html + "\n</head>", 1)
    s = s.replace("</body>", "    " + sec_html + "\n</body>", 1)
    p.write_text(s)

print("built llms.txt, llms-sde.txt, llms-ml.txt, llms-quant.txt, index.html, projects.html")
