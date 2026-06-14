import re

with open("resume.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# 1. Find the hidden section start and end, and delete it.
hidden_start = -1
hidden_end = -1
for i, line in enumerate(lines):
    if '<section class="intro-hybrid-section" style="display: none;">' in line:
        hidden_start = i
    if hidden_start != -1 and '</section>' in line:
        hidden_end = i
        if hidden_end > hidden_start:
            break

if hidden_start != -1 and hidden_end != -1:
    del lines[hidden_start:hidden_end+1]

html = "".join(lines)

# Now we only have one intro-hybrid-section inside <main>.
# Let's replace the HTML and CSS for it.

old_html = """            <div class="intro-hybrid-top">
                <div class="intro-hybrid-left">
                    <span class="intro-hybrid-num">01</span>
                    <h2 class="intro-hybrid-title">SOLVING<br>PROBLEMS<br>THROUGH ARTFUL<br>SYSTEMS AND<br>INTERFACES.</h2>
                </div>
                <div class="intro-hybrid-right">
                    <p class="intro-hybrid-desc">Hello, I am a designer who codes - a hybrid creative with nearly a decade of crafting elegant, meaningful digital experiences.</p>
                    <p class="intro-hybrid-desc">Whether it is sculpting intuitive interfaces or engineering fluid systems, I bring ideas into pixels and transform complex journeys into products that feel seamless.</p>
                    <p class="intro-hybrid-desc">I work where business strategy, marketing psychology, and UX/UI design converge, with a focus on experiences that users enjoy and products that thrive.</p>
                </div>
            </div>"""

new_html = """            <div class="intro-hybrid-header">
                <h1 class="intro-huge-title">
                    <span class="intro-text-gray">Designing experiences</span><br>
                    <span class="intro-text-black">that solve real problems.</span>
                </h1>
            </div>
            
            <div class="intro-hybrid-top new-layout">
                <div class="intro-hybrid-left">
                    <div class="intro-profile-img" style="background-image: url('assets/dinda.png');">
                        <div class="intro-social-pills">
                            <a href="#" class="intro-social-pill"><i class="fa-brands fa-dribbble"></i></a>
                            <a href="#" class="intro-social-pill"><i class="fa-brands fa-behance"></i></a>
                            <a href="#" class="intro-social-pill"><i class="fa-brands fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div class="intro-profile-info">
                        <h3 class="intro-profile-name">Dinda Pratika</h3>
                        <p class="intro-profile-role">A designer who codes</p>
                    </div>
                </div>
                <div class="intro-hybrid-right">
                    <p class="intro-hybrid-desc"><strong>Hello, I am a designer who codes</strong> - a hybrid creative with nearly a decade of crafting elegant, meaningful digital experiences.</p>
                    <p class="intro-hybrid-desc"><strong>Whether it is sculpting intuitive interfaces or engineering fluid systems,</strong> I bring ideas into pixels and transform complex journeys into products that feel seamless.</p>
                    <p class="intro-hybrid-desc"><strong>I work where business strategy, marketing psychology, and UX/UI design converge,</strong> with a focus on experiences that users enjoy and products that thrive.</p>
                </div>
            </div>"""

html = html.replace(old_html, new_html)

old_css = """                .intro-hybrid-top {
                    padding: 0 5%;
                    max-width: 1400px;
                    margin: 0 auto 4rem auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 4rem;
                }
                .intro-hybrid-left {
                    flex: 1.2;
                }
                .intro-hybrid-num {
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    display: block;
                    color: #fff;
                }
                .intro-hybrid-title {
                    font-family: var(--font-heading);
                    font-size: clamp(2rem, 4.5vw, 4rem);
                    font-weight: 900;
                    line-height: 1.05;
                    color: #fff;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: -1px;
                }
                .intro-hybrid-right {
                    flex: 1;
                    padding-top: 4.5rem;
                }
                .intro-hybrid-desc {
                    font-family: var(--font-body);
                    font-size: 1.05rem;
                    line-height: 1.8;
                    color: #e5e5e5;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }"""

new_css = """                .intro-hybrid-header {
                    padding: 0 5%;
                    max-width: 1400px;
                    margin: 0 auto 4rem auto;
                }
                .intro-huge-title {
                    font-size: clamp(3rem, 7vw, 6.5rem);
                    font-weight: 900;
                    line-height: 1.05;
                    letter-spacing: -0.04em;
                    margin: 0;
                    font-family: var(--font-heading);
                }
                .intro-text-gray {
                    color: #888;
                }
                .intro-text-black {
                    color: #fff;
                }
                .intro-hybrid-top.new-layout {
                    padding: 0 5%;
                    max-width: 1400px;
                    margin: 0 auto 4rem auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6rem;
                    align-items: start;
                }
                .intro-hybrid-left {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .intro-profile-img {
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    background-size: cover;
                    background-position: center;
                    border-radius: 20px;
                    position: relative;
                }
                .intro-social-pills {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    gap: 10px;
                }
                .intro-social-pill {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(5px);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                }
                .intro-social-pill:hover {
                    background: rgba(0,0,0,0.9);
                    transform: translateY(-3px);
                }
                .intro-profile-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                }
                .intro-profile-name {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0;
                    color: #fff;
                    font-family: var(--font-heading);
                }
                .intro-profile-role {
                    font-size: 1rem;
                    color: #aaa;
                    margin: 0;
                    font-weight: 500;
                }
                .intro-hybrid-right {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    padding-top: 2rem;
                }
                .intro-hybrid-desc {
                    font-family: var(--font-body);
                    font-size: 1.25rem;
                    line-height: 1.6;
                    color: #ccc;
                    font-weight: 400;
                    margin: 0;
                }
                .intro-hybrid-desc strong {
                    font-weight: 800;
                    color: #fff;
                }"""

html = html.replace(old_css, new_css)

# Update light theme
old_light_theme = """                body.light-theme .intro-hybrid-num,
                body.light-theme .intro-hybrid-title {
                    color: #111;
                }
                body.light-theme .intro-hybrid-desc {
                    color: #444;
                }"""
new_light_theme = """                body.light-theme .intro-text-black,
                body.light-theme .intro-profile-name,
                body.light-theme .intro-hybrid-desc strong {
                    color: #111;
                }
                body.light-theme .intro-profile-role {
                    color: #666;
                }
                body.light-theme .intro-hybrid-desc {
                    color: #555;
                }"""
html = html.replace(old_light_theme, new_light_theme)

# Update media query
old_mq = """                @media (max-width: 1024px) {
                    .intro-hybrid-top {
                        flex-direction: column;
                        gap: 2rem;
                    }"""
new_mq = """                @media (max-width: 1024px) {
                    .intro-hybrid-top.new-layout {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }"""
html = html.replace(old_mq, new_mq)

with open("resume.html", "w", encoding="utf-8") as f:
    f.write(html)
print("done")
