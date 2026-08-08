
    (function () {
        function init() {
            var sidebar = document.getElementById("palmi-gb-sidebar");
            var items = sidebar.querySelectorAll(".palmi-gb-item");
            var sections = document.querySelectorAll(".palmi-gb-section");
            var catBtns = sidebar.querySelectorAll(".palmi-gb-cat-btn");

            // Accordéon : ouvrir la catégorie qui contient l'item actif au chargement
            catBtns.forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var cat = btn.closest(".palmi-gb-cat");
                    var wasOpen = cat.classList.contains("open");
                    sidebar.querySelectorAll(".palmi-gb-cat").forEach(function (c) {
                        c.classList.remove("open");
                    });
                    if (!wasOpen) cat.classList.add("open");
                });
            });

            function activateSection(id, pushHash) {
                sections.forEach(function (s) {
                    s.classList.toggle("active", s.id === id);
                });
                items.forEach(function (a) {
                    a.classList.toggle("active", a.dataset.section === id);
                });

                // Ouvrir la bonne catégorie dans la sidebar desktop
                var activeItem = sidebar.querySelector(
                    '.palmi-gb-item[data-section="' + id + '"]',
                );
                if (activeItem) {
                    var cat = activeItem.closest(".palmi-gb-cat");
                    sidebar.querySelectorAll(".palmi-gb-cat").forEach(function (c) {
                        c.classList.remove("open");
                    });
                    cat.classList.add("open");

                    // Mettre à jour le libellé mobile
                    var catLabel = cat.querySelector(
                        ".palmi-gb-cat-btn span",
                    ).textContent;
                    var mobileLabel = document.getElementById("palmi-gb-mobile-current");
                    if (mobileLabel)
                        mobileLabel.textContent = catLabel + " — " + activeItem.textContent;
                }

                if (pushHash !== false) {
                    history.replaceState(null, "", "#" + id);
                }

                // Scroll en haut du contenu sur mobile
                var content = document.querySelector(".palmi-gb-content");
                if (content && window.innerWidth < 900) {
                    content.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }

            items.forEach(function (a) {
                a.addEventListener("click", function (e) {
                    e.preventDefault();
                    activateSection(a.dataset.section);
                    closeMobileSidebar();
                });
            });

            // Activation initiale : via hash d'URL sinon premier item
            var initial = location.hash ? location.hash.slice(1) : null;
            if (initial && document.getElementById(initial)) {
                activateSection(initial, false);
            } else {
                var first = sidebar.querySelector(".palmi-gb-item");
                if (first) activateSection(first.dataset.section, false);
            }

            // ===== MOBILE : bouton "catégories" ouvre la sidebar slide-in =====
            var mobileToggle = document.getElementById("palmi-gb-mobile-toggle");
            var mobileSidebar = document.getElementById("palmi-gb-mobile-sidebar");
            var mobileOverlay = document.getElementById("palmi-gb-mobile-overlay");
            var mobileClose = document.getElementById("palmi-gb-mobile-close");
            var mobileItemsWrap = document.getElementById(
                "palmi-gb-mobile-sidebar-items",
            );
            var mobileSidebarTitle = document.getElementById(
                "palmi-gb-mobile-sidebar-title",
            );

            function buildMobileSidebar() {
                mobileItemsWrap.innerHTML = "";
                sidebar.querySelectorAll(".palmi-gb-cat").forEach(function (cat) {
                    var catLabel = cat.querySelector(
                        ".palmi-gb-cat-btn span",
                    ).textContent;
                    var group = document.createElement("div");
                    group.className = "palmi-gb-mobile-group";

                    var groupTitle = document.createElement("div");
                    groupTitle.className = "palmi-gb-mobile-group-title";
                    groupTitle.textContent = catLabel;
                    group.appendChild(groupTitle);

                    cat.querySelectorAll(".palmi-gb-item").forEach(function (item) {
                        var link = document.createElement("a");
                        link.href = "#";
                        link.className = "palmi-gb-mobile-item";
                        link.textContent = item.textContent;
                        link.dataset.section = item.dataset.section;
                        link.addEventListener("click", function (e) {
                            e.preventDefault();
                            activateSection(link.dataset.section);
                            closeMobileSidebar();
                        });
                        group.appendChild(link);
                    });

                    mobileItemsWrap.appendChild(group);
                });
            }

            function openMobileSidebar() {
                buildMobileSidebar();
                mobileSidebar.classList.add("open");
                mobileOverlay.classList.add("open");
            }

            function closeMobileSidebar() {
                mobileSidebar.classList.remove("open");
                mobileOverlay.classList.remove("open");
            }

            if (mobileToggle)
                mobileToggle.addEventListener("click", openMobileSidebar);
            if (mobileClose)
                mobileClose.addEventListener("click", closeMobileSidebar);
            if (mobileOverlay)
                mobileOverlay.addEventListener("click", closeMobileSidebar);

            // ===== RECHERCHE =====
            var search = document.getElementById("palmi-gb-search");
            if (search) {
                search.addEventListener("input", function () {
                    var q = search.value.trim().toLowerCase();
                    var anyMatch = false;
                    sidebar.querySelectorAll(".palmi-gb-cat").forEach(function (cat) {
                        var catMatch = false;
                        cat.querySelectorAll(".palmi-gb-item").forEach(function (item) {
                            var match = !q || item.textContent.toLowerCase().indexOf(q) !==
                                -1;
                            item.style.display = match ? "" : "none";
                            if (match) catMatch = true;
                        });
                        cat.style.display = catMatch ? "" : "none";
                        if (catMatch && q) cat.classList.add("open");
                        if (catMatch) anyMatch = true;
                    });
                });
            }
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", init);
        } else {
            init();
        }
    })();

    /* === Palmi - Codebox from raw source (script type="text/plain") === */

    function palmiInitCodeboxCopy() {
        document.querySelectorAll(".codebox").forEach(function (box) {
            if (box.dataset.copyDone) return;
            box.dataset.copyDone = "1";

            var label = box.querySelector("p");
            var source = box.querySelector(
                'script[type="text/plain"].palmi-code-source',
            );
            var code = box.querySelector("code");
            if (!label || !code) return;

            // Si une source brute existe, on l'utilise pour remplir le code (préserve tout tel quel)
            if (source) {
                var raw = source.textContent;
                // Retirer l'indentation commune en trop au début/fin
                raw = raw.replace(/^\n/, "").replace(/\s+$/, "");
                code.textContent = raw;
                code.style.whiteSpace = "pre-line";
                code.style.display = "block";
            }

            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "palmi-code-copy-btn";
            btn.textContent = "Copier";

            btn.addEventListener("click", function () {
                var text = code.innerText;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard
                        .writeText(text)
                        .then(function () {
                            palmiCodeCopyFeedback(btn);
                        })
                        .catch(function () {
                            palmiCodeCopyFallback(text, btn);
                        });
                } else {
                    palmiCodeCopyFallback(text, btn);
                }
            });

            label.appendChild(btn);
        });
    }

    function palmiCodeCopyFallback(text, btn) {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
        } catch (e) {
            void 0;
        }
        document.body.removeChild(ta);
        palmiCodeCopyFeedback(btn);
    }

    function palmiCodeCopyFeedback(btn) {
        var original = btn.textContent;
        btn.textContent = "Copié !";
        btn.classList.add("palmi-code-copy-btn--done");
        setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove("palmi-code-copy-btn--done");
        }, 1500);
    }

    $(document).ready(function () {
        palmiInitCodeboxCopy();
    });