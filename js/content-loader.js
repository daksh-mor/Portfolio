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

        list.innerHTML = "";
        projects.forEach(function (project) {
            var card = document.createElement("div");
            card.className = "project-card";
            if (project.id) {
                card.id = project.id;
            }

            var imageWrap = document.createElement("div");
            imageWrap.className = "project-image";

            var image = document.createElement("img");
            image.src = project.image || "https://via.placeholder.com/400x250/f0f0f0/333?text=Project";
            image.alt = project.imageAlt || project.title || "Project";
            imageWrap.appendChild(image);

            var info = document.createElement("div");
            info.className = "project-info";

            var title = document.createElement("h2");
            title.className = "project-title";
            title.textContent = project.title || "Project Title";

            var description = document.createElement("p");
            description.className = "project-description";
            description.innerHTML = formatInlineMarkdown(project.description || "Project description.");

            var link = document.createElement("a");
            link.className = "view-project";
            link.href = project.link || "#";
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = (project.linkLabel || "View Project") + " ->";

            info.appendChild(title);
            info.appendChild(description);
            info.appendChild(link);

            card.appendChild(imageWrap);
            card.appendChild(info);
            list.appendChild(card);
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

    fetch("content/site.json?v=20260412", { cache: "no-store" })
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

            // Easter egg removed by request.
        })
        .catch(function () {
            console.warn("Could not load content/site.json");
        });
})();
