/* ═══════════════════════════════════════════════════════
   Auflösung24.de – JavaScript
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────
       SLOGAN: fit full container width
    ──────────────────────────────────────────── */
    function fitSlogan() {
        const wrap = document.querySelector('.hero-slogan-wrap');
        const slogan = document.getElementById('heroSlogan');
        if (!wrap || !slogan) return;
        slogan.style.fontSize = '12px';
        const ratio = wrap.offsetWidth / slogan.scrollWidth;
        slogan.style.fontSize = Math.floor(12 * ratio * 0.98) + 'px';
    }
    fitSlogan();
    window.addEventListener('resize', fitSlogan);

    /* ────────────────────────────────────────────
       NAVBAR scroll effect
    ──────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ────────────────────────────────────────────
       MOBILE NAV toggle
    ──────────────────────────────────────────── */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ────────────────────────────────────────────
       SCROLL REVEAL
    ──────────────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 6) * 0.08}s`;
        revealObserver.observe(el);
    });

    /* ────────────────────────────────────────────
       SMOOTH SCROLL
    ──────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ────────────────────────────────────────────
       FAQ ACCORDION
    ──────────────────────────────────────────── */
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ────────────────────────────────────────────
       SERVICES ACCORDION
    ──────────────────────────────────────────── */
    document.querySelectorAll('.svc-item').forEach(item => {
        const toggle = item.querySelector('.svc-toggle');
        const body = item.querySelector('.svc-body');
        toggle.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.svc-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.svc-toggle').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ────────────────────────────────────────────
       CITIES TOGGLE
    ──────────────────────────────────────────── */
    const citiesToggle = document.getElementById('citiesToggle');
    const citiesList = document.getElementById('citiesList');
    const citiesArrow = document.getElementById('citiesArrow');
    if (citiesToggle) {
        citiesToggle.addEventListener('click', () => {
            const isOpen = citiesList.classList.toggle('open');
            citiesArrow.classList.toggle('open', isOpen);
        });
    }

    /* ────────────────────────────────────────────
       ENTRÜMPELUNG CALCULATOR
    ──────────────────────────────────────────── */
    const calcData = {};
    const totalSteps = 6;

    // PLZ input → enable next
    const plzInput = document.getElementById('calcPlz');
    const next1Btn = document.getElementById('calcNext1');
    if (plzInput) {
        plzInput.addEventListener('input', () => {
            const val = plzInput.value.trim();
            const valid = /^\d{5}$/.test(val);
            next1Btn.disabled = !valid;
            if (valid) calcData.plz = val;
        });
    }

    // m² input → enable next
    const qmInput = document.getElementById('calcQm');
    const next4Btn = document.getElementById('calcNext4');
    if (qmInput) {
        qmInput.addEventListener('input', () => {
            const val = parseInt(qmInput.value);
            const valid = val >= 5 && val <= 5000;
            next4Btn.disabled = !valid;
            if (valid) calcData.qm = val;
        });
    }

    // Choice buttons
    document.querySelectorAll('.calc-choice').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const val = btn.dataset.val;

            // Deselect siblings with same key
            document.querySelectorAll(`.calc-choice[data-key="${key}"]`).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            calcData[key] = val;

            // Special UI for Gewerbe hint
            if (key === 'kunde') {
                const hint = document.getElementById('gewerbeHint');
                if (hint) hint.style.display = val === 'Gewerbe' ? 'block' : 'none';
                document.getElementById('calcNext2').disabled = false;
            }

            // Extrem hint
            if (key === 'fuellgrad') {
                const eh = document.getElementById('extremHint');
                if (eh) eh.style.display = val === 'Extrem' ? 'block' : 'none';
            }

            // Enable next on step 3 (need both objekt + fuellgrad)
            if (key === 'objekt' || key === 'fuellgrad') {
                if (calcData.objekt && calcData.fuellgrad) {
                    document.getElementById('calcNext3').disabled = false;
                }
            }

            // Step 5 (etage + aufzug)
            if (key === 'etage' || key === 'aufzug') {
                if (calcData.etage && calcData.aufzug) {
                    document.getElementById('calcNext5').disabled = false;
                }
            }

            // Step 6 (parkplatz) → enable calc button
            if (key === 'parkplatz') {
                document.getElementById('calcCalcBtn').disabled = false;
            }
        });
    });

    // Step navigation – next
    document.querySelectorAll('.calc-next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            goToStep(nextStep);
        });
    });

    // Step navigation – back
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            const backStep = parseInt(btn.dataset.back);
            goToStep(backStep);
        });
    });

    function goToStep(stepNum) {
        document.querySelectorAll('.calc-pane').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('calcStep' + stepNum) || document.getElementById('calcResult');
        if (target) target.classList.add('active');

        // Update step dots
        document.querySelectorAll('.calc-step-dot').forEach(dot => {
            const s = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'done');
            if (s === stepNum) dot.classList.add('active');
            else if (s < stepNum) dot.classList.add('done');
        });
        document.querySelectorAll('.calc-step-line').forEach((line, idx) => {
            line.classList.toggle('done', idx < stepNum - 1);
        });
    }

    // Calculate price
    const calcCalcBtn = document.getElementById('calcCalcBtn');
    if (calcCalcBtn) {
        calcCalcBtn.addEventListener('click', () => {
            const price = calculatePrice();
            showResult(price);
        });
    }

    function calculatePrice() {
        const qm = calcData.qm || 50;
        const fuell = calcData.fuellgrad || 'Normal';
        const etage = calcData.etage || 'EG';
        const aufzug = calcData.aufzug || 'Nein';
        const parkplatz = calcData.parkplatz || 'Ja';

        // Base price per m²
        let basePerM2 = 12;
        if (fuell === 'Wenig') basePerM2 = 9;
        if (fuell === 'Extrem') basePerM2 = 17;

        let base = Math.max(qm * basePerM2, 350);

        // Floor surcharge (no elevator)
        if (aufzug === 'Nein') {
            const floors = { 'EG': 0, '1. OG': 1, '2. OG': 2, '3. OG': 3, '4+ OG': 4 };
            base += (floors[etage] || 0) * 80;
        }

        // Parking surcharge
        if (parkplatz === 'Nein') base += 150;

        // Range ±12%
        const low = Math.round(base * 0.88 / 50) * 50;
        const high = Math.round(base * 1.12 / 50) * 50;

        return { low, high };
    }

    function showResult({ low, high }) {
        const display = document.getElementById('calcPriceDisplay');
        if (display) {
            display.textContent = low.toLocaleString('de-DE') + ' € — ' + high.toLocaleString('de-DE') + ' €';
        }

        // Summary list
        const list = document.getElementById('calcSummaryList');
        if (list) {
            const labels = {
                plz: 'PLZ', objekt: 'Objekt', fuellgrad: 'Füllgrad',
                qm: 'Fläche', etage: 'Etage', aufzug: 'Aufzug', parkplatz: 'Parkplatz', kunde: 'Kundentyp'
            };
            const displayMap = { qm: (v) => v + ' m²' };
            list.innerHTML = Object.entries(labels)
                .filter(([k]) => calcData[k] !== undefined)
                .map(([k, label]) => {
                    const val = displayMap[k] ? displayMap[k](calcData[k]) : calcData[k];
                    return `<li>• ${label}: <span>${val}</span></li>`;
                }).join('');
        }

        // Show result pane
        document.querySelectorAll('.calc-pane').forEach(p => p.classList.remove('active'));
        document.getElementById('calcResult').classList.add('active');

        // Update all step dots to done
        document.querySelectorAll('.calc-step-dot').forEach(d => d.classList.add('done'));
        document.querySelectorAll('.calc-step-line').forEach(l => l.classList.add('done'));
    }

    // Summary toggle
    const summaryToggle = document.getElementById('calcSummaryToggle');
    const summaryBody = document.getElementById('calcSummaryBody');
    const summaryArrow = document.getElementById('calcSummaryArrow');
    if (summaryToggle) {
        summaryToggle.addEventListener('click', () => {
            const isOpen = summaryBody.classList.toggle('open');
            summaryArrow.textContent = isOpen ? '▲' : '▼';
        });
    }

    // Reset
    const resetBtn = document.getElementById('calcResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.keys(calcData).forEach(k => delete calcData[k]);
            document.querySelectorAll('.calc-choice').forEach(b => b.classList.remove('selected'));
            document.querySelectorAll('.calc-pane').forEach(p => p.classList.remove('active'));
            document.getElementById('calcStep1').classList.add('active');
            document.querySelectorAll('.calc-step-dot').forEach((d, i) => {
                d.classList.remove('active', 'done');
                if (i === 0) d.classList.add('active');
            });
            document.querySelectorAll('.calc-step-line').forEach(l => l.classList.remove('done'));
            if (plzInput) plzInput.value = '';
            if (qmInput) qmInput.value = '';
            if (next1Btn) next1Btn.disabled = true;
            if (next4Btn) next4Btn.disabled = true;
            document.getElementById('calcNext2').disabled = true;
            document.getElementById('calcNext3').disabled = true;
            document.getElementById('calcNext5').disabled = true;
            document.getElementById('calcCalcBtn').disabled = true;
            const eh = document.getElementById('extremHint');
            if (eh) eh.style.display = 'none';
            const gh = document.getElementById('gewerbeHint');
            if (gh) gh.style.display = 'none';
        });
    }

    // WhatsApp button
    const waBtn = document.getElementById('calcWhatsappBtn');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const low = calculatePrice().low;
            const high = calculatePrice().high;
            const msg = encodeURIComponent(
                `Hallo, ich habe gerade meinen Preis auf Ihrer Website berechnet.\n\n` +
                `Meine Angaben:\n` +
                `- PLZ: ${calcData.plz || '–'}\n` +
                `- Objekt: ${calcData.objekt || '–'}\n` +
                `- Füllgrad: ${calcData.fuellgrad || '–'}\n` +
                `- Fläche: ${calcData.qm || '–'} m²\n` +
                `- Etage: ${calcData.etage || '–'}\n` +
                `- Aufzug: ${calcData.aufzug || '–'}\n` +
                `- Parkplatz: ${calcData.parkplatz || '–'}\n\n` +
                `Geschätzter Preis: ${low}\u202F€ – ${high}\u202F€\n\n` +
                `Ich hätte gerne ein verbindliches Angebot.\nIch kann auch Fotos senden.`
            );
            window.open(`https://wa.me/4915000000000?text=${msg}`, '_blank', 'noopener');
        });
    }

    /* ────────────────────────────────────────────
       CONTACT FORM + SOURCE POPUP
    ──────────────────────────────────────────── */
    const contactForm = document.getElementById('contactForm');
    const sourceOverlay = document.getElementById('sourceOverlay');
    const sourceOptions = document.getElementById('sourceOptions');
    const sourceThanks = document.getElementById('sourceThanks');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Wird gesendet…';
            btn.disabled = true;

            // Simulate submission
            setTimeout(() => {
                btn.textContent = '✓ Anfrage gesendet';
                btn.style.background = '#22c55e';
                contactForm.reset();
                const fl = document.getElementById('fileList');
                if (fl) fl.innerHTML = '';

                // Show source popup after short delay
                setTimeout(() => {
                    if (sourceOverlay) sourceOverlay.classList.add('active');
                }, 600);

                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }, 1400);
        });
    }

    // Source buttons
    if (sourceOptions) {
        sourceOptions.querySelectorAll('.source-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sourceOptions.querySelectorAll('.source-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                const selected = btn.dataset.val;
                console.log('Quelle:', selected); // Replace with actual API call / email

                // Show thanks
                setTimeout(() => {
                    sourceOptions.style.display = 'none';
                    const h3 = sourceOverlay.querySelector('h3');
                    if (h3) h3.style.display = 'none';
                    sourceThanks.style.display = 'block';

                    // Auto-close after 5s
                    setTimeout(() => {
                        sourceOverlay.classList.remove('active');
                        sourceOptions.style.display = '';
                        if (h3) h3.style.display = '';
                        sourceThanks.style.display = 'none';
                        sourceOptions.querySelectorAll('.source-btn').forEach(b => b.classList.remove('selected'));
                    }, 5000);
                }, 300);
            });
        });
    }

    // Close modal on overlay click
    if (sourceOverlay) {
        sourceOverlay.addEventListener('click', (e) => {
            if (e.target === sourceOverlay) sourceOverlay.classList.remove('active');
        });
    }

    /* ────────────────────────────────────────────
       FILE UPLOAD DISPLAY
    ──────────────────────────────────────────── */
    const photosInput = document.getElementById('photos');
    const fileList = document.getElementById('fileList');
    if (photosInput && fileList) {
        photosInput.addEventListener('change', () => {
            fileList.innerHTML = '';
            Array.from(photosInput.files).forEach(f => {
                const chip = document.createElement('span');
                chip.className = 'file-chip';
                chip.textContent = f.name;
                fileList.appendChild(chip);
            });
        });
    }

    /* ────────────────────────────────────────────
       COOKIE BANNER
    ──────────────────────────────────────────── */
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    const cookieFab = document.getElementById('cookieFab');

    function hideBanner() {
        cookieBanner.classList.remove('visible');
    }

    // Show on load if no consent saved
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1200);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            hideBanner();
        });
    }
    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            hideBanner();
        });
    }
    // FAB re-opens banner
    if (cookieFab) {
        cookieFab.addEventListener('click', () => {
            cookieBanner.classList.toggle('visible');
        });
    }

    /* ────────────────────────────────────────────
       LEAFLET MAP – Einsatzgebiet NRW
    ──────────────────────────────────────────── */
    const mapEl = document.getElementById('coverageMap');
    if (mapEl && typeof L !== 'undefined') {
        const darkTiles = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd', maxZoom: 19
        }
        );

        const map = L.map('coverageMap', {
            center: [51.4, 7.4], zoom: 8,
            layers: [darkTiles],
            scrollWheelZoom: false, zoomControl: true
        });

        const accentIcon = L.divIcon({
            className: 'map-marker',
            html: '<div class="map-marker-dot"></div><div class="map-marker-ring"></div>',
            iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -14]
        });
        const hqIcon = L.divIcon({
            className: 'map-marker map-marker-hq',
            html: '<div class="map-marker-dot"></div><div class="map-marker-ring"></div><div class="map-marker-pulse"></div>',
            iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -16]
        });

        const cities = [
            { name: 'Krefeld', lat: 51.3388, lng: 6.5853, hq: true },
            { name: 'Köln', lat: 50.9375, lng: 6.9603 },
            { name: 'Düsseldorf', lat: 51.2277, lng: 6.7735 },
            { name: 'Dortmund', lat: 51.5136, lng: 7.4653 },
            { name: 'Essen', lat: 51.4556, lng: 7.0116 },
            { name: 'Duisburg', lat: 51.4344, lng: 6.7624 },
            { name: 'Bochum', lat: 51.4818, lng: 7.2162 },
            { name: 'Wuppertal', lat: 51.2562, lng: 7.1508 },
            { name: 'Bielefeld', lat: 52.0302, lng: 8.5325 },
            { name: 'Bonn', lat: 50.7374, lng: 7.0982 },
            { name: 'Münster', lat: 51.9607, lng: 7.6261 },
            { name: 'Gelsenkirchen', lat: 51.5178, lng: 7.0857 },
            { name: 'Aachen', lat: 50.7753, lng: 6.0839 },
            { name: 'Mönchengladbach', lat: 51.1805, lng: 6.4428 },
            { name: 'Oberhausen', lat: 51.4700, lng: 6.8517 },
            { name: 'Hagen', lat: 51.3671, lng: 7.4631 },
            { name: 'Hamm', lat: 51.6739, lng: 7.8224 },
            { name: 'Herne', lat: 51.5386, lng: 7.2242 },
            { name: 'Leverkusen', lat: 51.0459, lng: 6.9836 },
            { name: 'Solingen', lat: 51.1663, lng: 7.0833 },
            { name: 'Neuss', lat: 51.1983, lng: 6.6914 },
            { name: 'Münster', lat: 51.9607, lng: 7.6261 },
            { name: 'Paderborn', lat: 51.7190, lng: 8.7540 },
            { name: 'Bottrop', lat: 51.5236, lng: 6.9228 },
            { name: 'Mülheim a.d.R.', lat: 51.4272, lng: 6.8830 },
            { name: 'Moers', lat: 51.4515, lng: 6.6260 },
            { name: 'Siegen', lat: 50.8750, lng: 8.0243 },
            { name: 'Gütersloh', lat: 51.9065, lng: 8.3805 },
            { name: 'Remscheid', lat: 51.1794, lng: 7.1897 },
            { name: 'Bergisch Gladbach', lat: 50.9944, lng: 7.1343 },
        ];

        cities.forEach(city => {
            const icon = city.hq ? hqIcon : accentIcon;
            const label = city.hq
                ? `<strong>📍 ${city.name}</strong><br/>Unser Standort`
                : `<strong>${city.name}</strong>`;
            L.marker([city.lat, city.lng], { icon })
                .addTo(map)
                .bindPopup(label);
        });

        // Open HQ popup
        const hq = cities.find(c => c.hq);
        if (hq) {
            L.marker([hq.lat, hq.lng], { icon: hqIcon })
                .addTo(map)
                .bindPopup(`<strong>📍 ${hq.name}</strong><br/>Unser Standort`)
                .openPopup();
        }

        map.on('click', () => map.scrollWheelZoom.enable());
        map.on('mouseout', () => map.scrollWheelZoom.disable());
    }

    /* ────────────────────────────────────────────
       ACTIVE NAV HIGHLIGHT on scroll
    ──────────────────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinkList = document.querySelectorAll('.nav-links a[href^="#"]');
    const highlightNav = () => {
        const pos = window.scrollY + 120;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                navLinkList.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${sec.id}` ? 'var(--accent)' : '';
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

});
