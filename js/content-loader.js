(function () {
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatInlineMarkdown(value) {
        if (typeof value !== "string") {
            return "";
        }

        var html = escapeHtml(value);

        // Keep code spans isolated before any other inline replacements.
        html = html.replace(/`([^`]+)`/g, function (_, code) {
            return '<code>' + code + '</code>';
        });

        // [text](https://url)
        html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, label, url) {
            return '<a href="' + url + '" target="_blank" rel="noreferrer">' + label + "</a>";
        });

        // **bold**
        html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

        // *italic*
        html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

        return html;
    }

    function bySelector(selector) {
        return document.querySelector(selector);
    }

    function setText(selector, value) {
        var el = bySelector(selector);
        if (el && typeof value === "string") {
            el.textContent = value;
        }
    }

    function setAttr(selector, attr, value) {
        var el = bySelector(selector);
        if (el && typeof value === "string") {
            el.setAttribute(attr, value);
        }
    }

    function iconUrl(iconName) {
        return "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/" + iconName + ".svg";
    }

    function renderSocialLinks(items) {
        var containers = document.querySelectorAll(".social-links");
        if (!containers.length || !Array.isArray(items)) {
            return;
        }

        containers.forEach(function (container) {
            container.innerHTML = "";
            items.forEach(function (item) {
                var a = document.createElement("a");
                a.href = item.url || "#";
                a.target = "_blank";
                a.rel = "noreferrer";
                a.setAttribute("aria-label", item.name || "Social");

                var img = document.createElement("img");
                img.src = iconUrl(item.icon || "github");
                img.alt = item.name || "Social";
                a.appendChild(img);

                container.appendChild(a);
            });
        });
    }

    function renderHome(home) {
        if (!home) {
            return;
        }

        var firstName = home.firstName || "Daksh";
        var lastName = home.lastName || "Mor";
        var heading = bySelector(".hero-header h1");
        if (heading) {
            var initial = firstName.charAt(0);
            var rest = firstName.slice(1);
            heading.innerHTML =
                '<span class="name-initial">' +
                initial +
                "</span>" +
                rest +
                ' <span class="name-last">' +
                lastName +
                "</span>";
        }

        var bio = bySelector(".bio");
        if (bio && Array.isArray(home.bio)) {
            var bioParagraphs = home.bio.filter(function (item) {
                return typeof item === "string" && item.trim() !== "";
            });
            bio.innerHTML = bioParagraphs.map(formatInlineMarkdown).join("<br><br>");
        }

        var tagline = bySelector(".tagline");
        if (tagline) {
            tagline.innerHTML = formatInlineMarkdown(home.tagline || "");
        }
        var lightProfile = home.profileImage || "profile.jpg";
        var darkProfile = home.profileImageDark || lightProfile;
        var profileEl = bySelector(".profile-image img");
        if (profileEl) {
            profileEl.setAttribute("data-light-src", lightProfile);
            profileEl.setAttribute("data-dark-src", darkProfile);
            profileEl.setAttribute("src", document.documentElement.getAttribute("data-theme") === "dark" ? darkProfile : lightProfile);
            profileEl.setAttribute("alt", home.profileAlt || "Profile Photo");
        }
    }

    function renderProjects(page, projects) {
        if (page && page.title) {
            setText(".page-title", page.title);
        }

        var list = bySelector(".projects-list");
        if (!list || !Array.isArray(projects)) {
            return;
        }

        list.classList.add("timeline-road");
        list.innerHTML = "";

        var currentYear = null;
        var itemIndex = 0;

        projects.forEach(function (project) {
            // Insert Year Milestone Banner when Year changes
            var itemYear = project.year || (project.date ? project.date.split(" ")[1] : null);
            if (itemYear && itemYear !== currentYear) {
                currentYear = itemYear;
                var yearBanner = document.createElement("div");
                yearBanner.className = "timeline-year-banner";
                yearBanner.setAttribute("data-year", currentYear);
                yearBanner.innerHTML = '<span class="year-pill">' + currentYear + '</span>';
                list.appendChild(yearBanner);
                itemIndex = 0; // Reset alternating side per year group
            }

            var item = document.createElement("div");
            var sideClass = (itemIndex % 2 === 0) ? "timeline-item-left" : "timeline-item-right";
            item.className = "timeline-item " + sideClass;
            itemIndex++;

            if (project.id) {
                item.id = project.id;
            }
            if (project.category) {
                item.setAttribute("data-category", project.category);
            }
            if (project.year) {
                item.setAttribute("data-year", project.year);
            }

            var marker = document.createElement("div");
            marker.className = "timeline-marker";

            if (project.date) {
                var dateBadge = document.createElement("span");
                dateBadge.className = "project-date timeline-left-date";
                dateBadge.textContent = project.date;
                marker.appendChild(dateBadge);
            }

            var dot = document.createElement("span");
            dot.className = "timeline-dot";
            marker.appendChild(dot);

            var card = document.createElement("div");
            card.className = "project-card timeline-card";

            var imageWrap = document.createElement("div");
            imageWrap.className = "project-image";

            var image = document.createElement("img");
            image.src = project.image || "content/project-images/placeholder.jpg";
            image.alt = project.imageAlt || project.title || "Project";
            image.onerror = function() {
                this.onerror = null;
                this.style.display = "none";
                imageWrap.classList.add("image-placeholder-fallback");
                imageWrap.innerHTML = '<div class="fallback-graphic"><span class="fallback-icon">✦</span></div>';
            };

            imageWrap.appendChild(image);
            card.appendChild(imageWrap);

            var info = document.createElement("div");
            info.className = "project-info";

            var cardHeader = document.createElement("div");
            cardHeader.className = "project-card-header";

            var tagsWrap = document.createElement("div");
            tagsWrap.className = "project-tags";
            if (Array.isArray(project.tags) && project.tags.length > 0) {
                project.tags.forEach(function (tagText) {
                    var tag = document.createElement("span");
                    tag.className = "project-tag";
                    tag.textContent = tagText;
                    tagsWrap.appendChild(tag);
                });
            }
            cardHeader.appendChild(tagsWrap);

            var actionsWrap = document.createElement("div");
            actionsWrap.className = "project-card-actions";

            if (project.categoryLabel) {
                var catBadge = document.createElement("span");
                catBadge.className = "project-category-badge " + (project.category || "");
                catBadge.textContent = project.categoryLabel;
                actionsWrap.appendChild(catBadge);
            }

            var cardCopyBtn = document.createElement("button");
            cardCopyBtn.className = "card-copy-btn";
            cardCopyBtn.type = "button";
            cardCopyBtn.setAttribute("aria-label", "Copy project context for AI agent");
            cardCopyBtn.setAttribute("title", "Copy project context for AI agent");
            cardCopyBtn.innerHTML = GITHUB_COPY_SVG;
            cardCopyBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                var projectMd = buildSingleProjectMarkdown(project);
                copyTextToClipboard(projectMd, "Copied " + (project.title || "project") + " context to clipboard", cardCopyBtn);
            });
            actionsWrap.appendChild(cardCopyBtn);

            cardHeader.appendChild(actionsWrap);
            info.appendChild(cardHeader);

            var title = document.createElement("h2");
            title.className = "project-title";
            title.textContent = project.title || "Project Title";
            info.appendChild(title);

            var description = document.createElement("p");
            description.className = "project-description";
            description.innerHTML = formatInlineMarkdown(project.description || "Project description.");
            info.appendChild(description);

            var linksWrap = document.createElement("div");
            linksWrap.className = "project-links";

            if (project.link) {
                var link = document.createElement("a");
                link.className = "view-project btn-link";
                link.href = project.link;
                link.target = "_blank";
                link.rel = "noreferrer";
                link.innerHTML = (project.linkLabel || "GitHub Repo") + ' <span class="arrow">↗</span>';
                linksWrap.appendChild(link);
            }

            if (project.liveUrl) {
                var liveLink = document.createElement("a");
                liveLink.className = "view-project btn-link btn-link-secondary";
                liveLink.href = project.liveUrl;
                liveLink.target = "_blank";
                liveLink.rel = "noreferrer";
                liveLink.innerHTML = (project.liveLabel || 'Live Demo') + ' <span class="arrow">↗</span>';
                linksWrap.appendChild(liveLink);
            }

            if (project.itchUrl) {
                var itchLink = document.createElement("a");
                itchLink.className = "view-project btn-link btn-link-secondary";
                itchLink.href = project.itchUrl;
                itchLink.target = "_blank";
                itchLink.rel = "noreferrer";
                itchLink.innerHTML = (project.itchLabel || 'itch.io') + ' <span class="arrow">↗</span>';
                linksWrap.appendChild(itchLink);
            }

            info.appendChild(headerMeta);
            info.appendChild(title);
            info.appendChild(description);
            info.appendChild(linksWrap);

            card.appendChild(imageWrap);
            card.appendChild(info);

            item.appendChild(marker);
            item.appendChild(card);
            list.appendChild(item);
        });

        setupCategoryFilters();
    }

    function setupCategoryFilters() {
        var buttons = document.querySelectorAll(".category-filters .filter-btn");
        var items = document.querySelectorAll(".timeline-item");
        var banners = document.querySelectorAll(".timeline-year-banner");
        if (!buttons.length || !items.length) {
            return;
        }

        buttons.forEach(function(btn) {
            btn.addEventListener("click", function() {
                buttons.forEach(function(b) { b.classList.remove("active"); });
                btn.classList.add("active");

                var cat = btn.getAttribute("data-category");
                var visibleYears = {};

                items.forEach(function(item) {
                    var itemCat = item.getAttribute("data-category");
                    var itemYear = item.getAttribute("data-year");
                    if (cat === "all" || itemCat === cat) {
                        item.style.display = "flex";
                        if (itemYear) {
                            visibleYears[itemYear] = true;
                        }
                    } else {
                        item.style.display = "none";
                    }
                });

                banners.forEach(function(banner) {
                    var bannerYear = banner.getAttribute("data-year");
                    if (cat === "all" || visibleYears[bannerYear]) {
                        banner.style.display = "flex";
                    } else {
                        banner.style.display = "none";
                    }
                });
            });
        });
    }

    function setupThemeToggle() {
        var button = bySelector(".theme-toggle");
        if (!button) {
            return;
        }

        var storageKey = "portfolio-theme";

        function getPreferredTheme() {
            var saved = window.localStorage.getItem(storageKey);
            if (saved === "dark" || saved === "light") {
                return saved;
            }

            return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        function applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);
            button.textContent = theme === "dark" ? "☀" : "☾";
            button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
            button.setAttribute("title", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");

            var profileEl = bySelector(".profile-image img");
            if (profileEl) {
                var lightSrc = profileEl.getAttribute("data-light-src") || profileEl.getAttribute("src");
                var darkSrc = profileEl.getAttribute("data-dark-src") || lightSrc;
                profileEl.setAttribute("src", theme === "dark" ? darkSrc : lightSrc);
            }

            var emailEl = bySelector(".email");
            if (emailEl) {
                var lightEmail = emailEl.getAttribute("data-light-email") || "";
                var darkEmail = emailEl.getAttribute("data-dark-email") || lightEmail;
                emailEl.textContent = theme === "dark" ? darkEmail : lightEmail;
            }
        }

        var currentTheme = getPreferredTheme();
        applyTheme(currentTheme);

        button.addEventListener("click", function () {
            currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            window.localStorage.setItem(storageKey, currentTheme);
            applyTheme(currentTheme);
        });
    }

    // Initialize theme toggle immediately so it works even if content fetch fails.
    setupThemeToggle();

    fetch("content/site.json?t=" + Date.now(), { cache: "no-store" })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.site) {
                if (data.site.title) {
                    document.title = data.site.title;
                }
                setText(".logo-mark", data.site.logo || "DM");
                setAttr(".nav-links a[href$='resume.pdf']", "href", data.site.resume || data.site.resumeBackup || "resume.pdf");
            }

            renderSocialLinks(data.social);
            var emailEl = bySelector(".email");
            if (emailEl) {
                var lightEmail = (data.contact && data.contact.email) || "";
                var darkEmail = (data.contact && data.contact.darkEmail) || lightEmail;
                emailEl.setAttribute("data-light-email", lightEmail);
                emailEl.setAttribute("data-dark-email", darkEmail);

                var activeTheme = document.documentElement.getAttribute("data-theme") || "light";
                emailEl.textContent = activeTheme === "dark" ? darkEmail : lightEmail;
            }

            if (bySelector(".hero")) {
                renderHome(data.home);
            }

            if (bySelector(".projects-list")) {
                renderProjects(data.projectsPage, data.projects);
            }

            if (bySelector(".experience-list")) {
                renderExperience(data.experiences);
            }

            if (bySelector(".milestones-list")) {
                renderMilestones(data.milestones);
            }

            setupCopyButton(data);

            // Setup Floating Scroll Nav Button (Projects Section)
            var scrollBtn = bySelector(".projects-scroll-btn");
            if (scrollBtn) {
                var arrowEl = scrollBtn.querySelector(".scroll-btn-arrow");
                var textEl = scrollBtn.querySelector(".scroll-btn-text");

                function updateScrollBtnState() {
                    var scrollY = window.scrollY || window.pageYOffset;
                    var docHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
                    
                    if (scrollY > docHeight * 0.68) {
                        scrollBtn.classList.add("is-up");
                        if (arrowEl) arrowEl.textContent = "↑";
                        if (textEl) textEl.textContent = "Back to Top";
                        scrollBtn.setAttribute("title", "Scroll to top");
                    } else {
                        scrollBtn.classList.remove("is-up");
                        if (arrowEl) arrowEl.textContent = "↓";
                        if (textEl) textEl.textContent = "Scroll Down";
                        scrollBtn.setAttribute("title", "Scroll down timeline");
                    }
                }

                window.addEventListener("scroll", updateScrollBtnState, { passive: true });
                updateScrollBtnState();

                scrollBtn.addEventListener("click", function () {
                    if (scrollBtn.classList.contains("is-up")) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                        var targetEl = bySelector(".category-filters-bottom") || bySelector(".milestones-section");
                        if (targetEl) {
                            var targetY = targetEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 40;
                            window.scrollTo({ top: targetY, behavior: "smooth" });
                        } else {
                            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
                        }
                    }
                });
            }
        })
        .catch(function () {
            console.warn("Could not load content/site.json");
        });

    function renderExperience(experiences) {
        var wrap = bySelector(".experience-list");
        if (!wrap || !Array.isArray(experiences)) {
            return;
        }

        wrap.innerHTML = "";
        experiences.forEach(function (exp) {
            var node = document.createElement("div");
            node.className = "exp-horizontal-node";

            var circle = document.createElement("div");
            circle.className = "exp-node-circle";

            var shortCompany = exp.company;
            if (exp.company.indexOf("National University of Singapore") !== -1) {
                shortCompany = "NUS";
            } else if (exp.company.indexOf("Google Summer of Code") !== -1) {
                shortCompany = "GSoC";
            }

            var shortRole = exp.role.split("(")[0].trim();
            if (shortRole.indexOf("Open Source Contributor") !== -1) {
                shortRole = "Contributor";
            }

            var company = document.createElement("span");
            company.className = "exp-node-company";
            company.textContent = shortCompany;

            var role = document.createElement("span");
            role.className = "exp-node-role";
            role.textContent = shortRole;

            circle.appendChild(company);
            circle.appendChild(role);

            var time = document.createElement("span");
            time.className = "exp-node-time";
            time.textContent = exp.period;

            var popover = document.createElement("div");
            popover.className = "exp-node-popover";

            var popTitle = document.createElement("div");
            popTitle.className = "popover-title";
            popTitle.textContent = exp.company + " — " + exp.role;

            var popDesc = document.createElement("p");
            popDesc.className = "popover-desc";
            popDesc.textContent = exp.summary;

            popover.appendChild(popTitle);
            popover.appendChild(popDesc);

            node.appendChild(circle);
            node.appendChild(time);
            node.appendChild(popover);

            wrap.appendChild(node);
        });
    }

    function renderMilestones(milestones) {
        var wrap = bySelector(".milestones-list");
        if (!wrap || !Array.isArray(milestones)) {
            return;
        }

        wrap.innerHTML = "";
        milestones.forEach(function (m) {
            var item = document.createElement("div");
            item.className = "milestone-item";

            var dot = document.createElement("span");
            dot.className = "milestone-bullet";
            dot.textContent = "✦";

            var content = document.createElement("div");
            content.className = "milestone-content";

            var title = document.createElement("div");
            title.className = "milestone-title";
            title.textContent = m.title;

            content.appendChild(title);

            if (m.detail) {
                var detail = document.createElement("div");
                detail.className = "milestone-detail";
                detail.textContent = m.detail;
                content.appendChild(detail);
            }

            item.appendChild(dot);
            item.appendChild(content);
            wrap.appendChild(item);
        });
    }

    var GITHUB_COPY_SVG = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>';
    var GITHUB_CHECK_SVG = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>';

    function setupCopyButton(data) {
        var copyBtn = bySelector(".nav-copy-btn");
        if (!copyBtn) return;

        copyBtn.innerHTML = GITHUB_COPY_SVG;

        copyBtn.addEventListener("click", function () {
            var markdownText = buildAgentMarkdown(data);
            copyTextToClipboard(markdownText, "Copied context of website to clipboard", copyBtn);
        });
    }

    function copyTextToClipboard(text, toastMsg, btnEl) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                onCopySuccess(toastMsg, btnEl);
            }).catch(function () {
                fallbackCopyText(text, toastMsg, btnEl);
            });
        } else {
            fallbackCopyText(text, toastMsg, btnEl);
        }
    }

    function onCopySuccess(toastMsg, btnEl) {
        showCopyToast(toastMsg);
        if (btnEl) {
            btnEl.classList.add("copy-success");
            btnEl.innerHTML = GITHUB_CHECK_SVG;
            setTimeout(function () {
                btnEl.classList.remove("copy-success");
                btnEl.innerHTML = GITHUB_COPY_SVG;
            }, 2000);
        }
    }

    function showCopyToast(msg) {
        var existing = bySelector(".copy-toast");
        if (existing) {
            existing.remove();
        }

        var toast = document.createElement("div");
        toast.className = "copy-toast";
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.classList.add("show");
        }, 10);

        setTimeout(function () {
            toast.classList.remove("show");
            setTimeout(function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2500);
    }

    function fallbackCopyText(text, toastMsg, btnEl) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            onCopySuccess(toastMsg, btnEl);
        } catch (err) {
            console.error("Could not copy text: ", err);
        }
        document.body.removeChild(textArea);
    }

    function buildSingleProjectMarkdown(p) {
        var lines = [];
        lines.push("# " + p.title + " — Deep Technical Specification");
        lines.push("");
        lines.push("## Overview");
        lines.push("- **Category**: " + (p.categoryLabel || p.category || "Project"));
        lines.push("- **Date**: " + (p.date || "N/A"));
        lines.push("- **Summary**: " + p.description);
        if (p.link) lines.push("- **GitHub**: " + p.link);
        if (p.liveUrl) lines.push("- **" + (p.liveLabel || "Live") + "**: " + p.liveUrl);
        if (p.itchUrl) lines.push("- **" + (p.itchLabel || "itch.io") + "**: " + p.itchUrl);
        if (Array.isArray(p.tags) && p.tags.length > 0) {
            lines.push("- **Tech Stack**: " + p.tags.join(", "));
        }
        lines.push("");

        if (p.roleBreakdown) {
            lines.push("## Role-Tailored Technical Breakdown");
            lines.push("");
            if (p.roleBreakdown.sde) {
                lines.push("### 🛠️ Software Engineering (SDE Perspective)");
                lines.push(p.roleBreakdown.sde);
                lines.push("");
            }
            if (p.roleBreakdown.ml) {
                lines.push("### 🧠 Machine Learning & AI (ML Perspective)");
                lines.push(p.roleBreakdown.ml);
                lines.push("");
            }
            if (p.roleBreakdown.quant) {
                lines.push("### 📈 Quantitative Modeling & Applied Math (Quant Perspective)");
                lines.push(p.roleBreakdown.quant);
                lines.push("");
            }
        }

        return lines.join("\n");
    }

    function buildAgentMarkdown(data) {
        var lines = [];
        lines.push("# Daksh Mor — Portfolio & Profile Context");
        lines.push("");
        if (data.agentBio) {
            lines.push("## Candidate Overview");
            lines.push(data.agentBio);
            lines.push("");
        }

        lines.push("## Bio & Mission");
        if (data.home && Array.isArray(data.home.bio)) {
            lines.push(data.home.bio.join("\n\n"));
        }
        lines.push("");
        lines.push("- **Role**: CSE Undergraduate at IIT Dhanbad '27");
        lines.push("- **Email**: " + ((data.contact && data.contact.email) || "daksh3982@gmail.com"));
        if (Array.isArray(data.social)) {
            var linksStr = data.social.map(function(s) { return s.name + ": " + s.url; }).join(", ");
            lines.push("- **Links**: " + linksStr);
        }
        lines.push("");

        lines.push("## Work Experience");
        if (Array.isArray(data.experiences)) {
            data.experiences.forEach(function(exp) {
                lines.push("- **" + exp.company + "** (" + exp.period + "): " + exp.role);
                lines.push("  " + exp.summary);
            });
        }
        lines.push("");

        lines.push("## Key Milestones & Achievements");
        if (Array.isArray(data.milestones)) {
            data.milestones.forEach(function(m) {
                lines.push("- **" + m.title + "**: " + m.detail);
            });
        }
        lines.push("");

        lines.push("## Deep Projects Portfolio (16 Projects with SDE, ML & Quant Breakdowns)");
        lines.push("");
        if (Array.isArray(data.projects)) {
            data.projects.forEach(function(p, idx) {
                lines.push("### " + (idx + 1) + ". " + p.title + " (" + p.date + ")");
                lines.push("- **Category**: " + (p.categoryLabel || p.category || "Project"));
                lines.push("- **Summary**: " + p.description);
                if (p.link) lines.push("- **GitHub**: " + p.link);
                if (p.liveUrl) lines.push("- **" + (p.liveLabel || "Live") + "**: " + p.liveUrl);
                if (p.itchUrl) lines.push("- **" + (p.itchLabel || "itch.io") + "**: " + p.itchUrl);
                if (Array.isArray(p.tags) && p.tags.length > 0) {
                    lines.push("- **Tech**: " + p.tags.join(", "));
                }
                if (p.roleBreakdown) {
                    lines.push("- **SDE Perspective**: " + p.roleBreakdown.sde);
                    lines.push("- **ML Perspective**: " + p.roleBreakdown.ml);
                    lines.push("- **Quant Perspective**: " + p.roleBreakdown.quant);
                }
                lines.push("");
            });
        }

        return lines.join("\n");
    }
})();
