css_to_append = """
/* Light Theme overrides for schedule-section */
body.light-theme .schedule-section {
    background: var(--color-pear);
    color: var(--color-oxford-blue);
}

body.light-theme .schedule-section .sch-title,
body.light-theme .schedule-section .sch-desc,
body.light-theme .schedule-section .sch-badge-text,
body.light-theme .schedule-section .sch-acc-title,
body.light-theme .schedule-section .sch-acc-text-col p,
body.light-theme .schedule-section .sch-yellow-text {
    color: var(--color-oxford-blue);
}

body.light-theme .schedule-section .sch-badge-num {
    background: var(--color-oxford-blue);
    color: var(--color-pear);
}

body.light-theme .schedule-section .sch-pill-badge {
    background: rgba(0, 39, 82, 0.1);
}

body.light-theme .schedule-section .sch-accordion-list,
body.light-theme .schedule-section .sch-accordion-item {
    border-color: rgba(0, 39, 82, 0.2);
}

body.light-theme .schedule-section .sch-acc-num {
    color: rgba(0, 39, 82, 0.4);
}

body.light-theme .schedule-section .sch-acc-icon {
    color: var(--color-oxford-blue);
    background: rgba(0, 39, 82, 0.1);
}

body.light-theme .schedule-section .sch-acc-btn {
    border-color: var(--color-oxford-blue);
    color: var(--color-oxford-blue);
}
body.light-theme .schedule-section .sch-acc-btn:hover {
    background: var(--color-oxford-blue);
    color: var(--color-pear);
}

body.light-theme .schedule-section .sch-join-btn {
    background: var(--color-oxford-blue);
    color: var(--color-pear);
}

body.light-theme .schedule-section .sch-join-arrow {
    background: var(--color-pear);
    color: var(--color-oxford-blue);
}
"""

with open('css/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we don't append it twice
if "Light Theme overrides for schedule-section" not in content:
    with open('css/style.css', 'a', encoding='utf-8') as f:
        f.write(css_to_append)
    print("Appended schedule-section overrides for light theme.")
else:
    print("Overrides already exist.")
