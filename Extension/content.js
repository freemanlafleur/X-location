let lastUrl = location.href;
let locationCache = {};
let isFetching = false;

const RESERVED_PATHS = [
    'home', 'explore', 'notifications', 'messages', 'i', 'compose', 'settings',
    'bookmarks', 'jobs', 'communities', 'search', 'tos', 'privacy', 'logout', 'login'
];

function isProfilePage() {
    const path = location.pathname.split('/').filter(p => p);
    if (path.length === 0) return false;
    const username = path[0];
    if (RESERVED_PATHS.includes(username.toLowerCase())) return false;
    return username;
}

function checkUrl() {
    const username = isProfilePage();
    if (username) {
        const userNameElement = document.querySelector('[data-testid="UserName"]');
        if (userNameElement) {
            injectLocation(username, userNameElement);
        }
    }
}

const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        isFetching = false;
    }
    checkUrl();
});

observer.observe(document, { subtree: true, childList: true });

async function injectLocation(username, headerItems) {
    if (isFetching) return;

    if (locationCache[username]) {
        renderBadge(locationCache[username], headerItems);
        return;
    }

    isFetching = true;

    try {
        const locationText = await fetchLocationFromAbout(username);
        if (locationText) {
            locationCache[username] = locationText;
            renderBadge(locationText, headerItems);
        }
    } catch (e) {
        // Error handling silently
    } finally {
        isFetching = false;
    }
}

const countryToFlag = {
    "Afghanistan": "🇦🇫", "Albania": "🇦🇱", "Algeria": "🇩🇿", "Andorra": "🇦🇩", "Angola": "🇦🇴",
    "Antigua and Barbuda": "🇦🇬", "Argentina": "🇦🇷", "Armenia": "🇦🇲", "Australia": "🇦🇺", "Austria": "🇦🇹",
    "Azerbaijan": "🇦🇿", "Bahamas": "🇧🇸", "Bahrain": "🇧🇭", "Bangladesh": "🇧🇩", "Barbados": "🇧🇧",
    "Belarus": "🇧🇾", "Belgium": "🇧🇪", "Belize": "🇧🇿", "Benin": "🇧🇯", "Bhutan": "🇧🇹",
    "Bolivia": "🇧🇴", "Bosnia and Herzegovina": "🇧🇦", "Botswana": "🇧🇼", "Brazil": "🇧🇷", "Brunei": "🇧🇳",
    "Bulgaria": "🇧🇬", "Burkina Faso": "🇧🇫", "Burundi": "🇧🇮", "Cabo Verde": "🇨🇻", "Cambodia": "🇰🇭",
    "Cameroon": "🇨🇲", "Canada": "🇨🇦", "Central African Republic": "🇨🇫", "Chad": "🇹🇩", "Chile": "🇨🇱",
    "China": "🇨🇳", "Colombia": "🇨🇴", "Comoros": "🇰🇲", "Congo": "🇨🇬", "Costa Rica": "🇨🇷",
    "Croatia": "🇭🇷", "Cuba": "🇨🇺", "Cyprus": "🇨🇾", "Czech Republic": "🇨🇿", "Denmark": "🇩🇰",
    "Djibouti": "🇩🇯", "Dominica": "🇩🇲", "Dominican Republic": "🇩🇴", "Ecuador": "🇪🇨", "Egypt": "🇪🇬",
    "El Salvador": "🇸🇻", "Equatorial Guinea": "🇬🇶", "Eritrea": "🇪🇷", "Estonia": "🇪🇪", "Eswatini": "🇸🇿",
    "Ethiopia": "🇪🇹", "Fiji": "🇫🇯", "Finland": "🇫🇮", "France": "🇫🇷", "Gabon": "🇬🇦",
    "Gambia": "🇬🇲", "Georgia": "🇬🇪", "Germany": "🇩🇪", "Ghana": "🇬🇭", "Greece": "🇬🇷",
    "Grenada": "🇬🇩", "Guatemala": "🇬🇹", "Guinea": "🇬🇳", "Guinea-Bissau": "🇬🇼", "Guyana": "🇬🇾",
    "Haiti": "🇭🇹", "Honduras": "🇭🇳", "Hungary": "🇭🇺", "Iceland": "🇮🇸", "India": "🇮🇳",
    "Indonesia": "🇮🇩", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ireland": "🇮🇪", "Israel": "🇮🇱",
    "Italy": "🇮🇹", "Jamaica": "🇯🇲", "Japan": "🇯🇵", "Jordan": "🇯🇴", "Kazakhstan": "🇰🇿",
    "Kenya": "🇰🇪", "Kiribati": "🇰🇮", "Korea, North": "🇰🇵", "Korea, South": "🇰🇷", "Kosovo": "🇽🇰",
    "Kuwait": "🇰🇼", "Kyrgyzstan": "🇰🇬", "Laos": "🇱🇦", "Latvia": "🇱🇻", "Lebanon": "🇱🇧",
    "Lesotho": "🇱🇸", "Liberia": "🇱🇷", "Libya": "🇱🇾", "Liechtenstein": "🇱🇮", "Lithuania": "🇱🇹",
    "Luxembourg": "🇱🇺", "Madagascar": "🇲🇬", "Malawi": "🇲🇼", "Malaysia": "🇲🇾", "Maldives": "🇲🇻",
    "Mali": "🇲🇱", "Malta": "🇲🇹", "Marshall Islands": "🇲🇭", "Mauritania": "🇲🇷", "Mauritius": "🇲🇺",
    "Mexico": "🇲🇽", "Micronesia": "🇫🇲", "Moldova": "🇲🇩", "Monaco": "🇲🇨", "Mongolia": "🇲🇳",
    "Montenegro": "🇲🇪", "Morocco": "🇲🇦", "Mozambique": "🇲🇿", "Myanmar": "🇲🇲", "Namibia": "🇳🇦",
    "Nauru": "🇳🇷", "Nepal": "🇳🇵", "Netherlands": "🇳🇱", "New Zealand": "🇳🇿", "Nicaragua": "🇳🇮",
    "Niger": "🇳🇪", "Nigeria": "🇳🇬", "North Macedonia": "🇲🇰", "Norway": "🇳🇴", "Oman": "🇴🇲",
    "Pakistan": "🇵🇰", "Palau": "🇵🇼", "Palestine": "🇵🇸", "Panama": "🇵🇦", "Papua New Guinea": "🇵🇬",
    "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Philippines": "🇵🇭", "Poland": "🇵🇱", "Portugal": "🇵🇹",
    "Qatar": "🇶🇦", "Romania": "🇷🇴", "Russia": "🇷🇺", "Rwanda": "🇷🇼", "Saint Kitts and Nevis": "🇰🇳",
    "Saint Lucia": "🇱🇨", "Saint Vincent and the Grenadines": "🇻🇨", "Samoa": "🇼🇸", "San Marino": "🇸🇲",
    "Sao Tome and Principe": "🇸🇹", "Saudi Arabia": "🇸🇦", "Senegal": "🇸🇳", "Serbia": "🇷🇸",
    "Seychelles": "🇸🇨", "Sierra Leone": "🇸🇱", "Singapore": "🇸🇬", "Slovakia": "🇸🇰", "Slovenia": "🇸🇮",
    "Solomon Islands": "🇸🇧", "Somalia": "🇸🇴", "South Africa": "🇿🇦", "South Sudan": "🇸🇸",
    "Spain": "🇪🇸", "Sri Lanka": "🇱🇰", "Sudan": "🇸🇩", "Suriname": "🇸🇷", "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭", "Syria": "🇸🇾", "Taiwan": "🇹🇼", "Tajikistan": "🇹🇯", "Tanzania": "🇹🇿",
    "Thailand": "🇹🇭", "Timor-Leste": "🇹🇱", "Togo": "🇹🇬", "Tonga": "🇹🇴", "Trinidad and Tobago": "🇹🇹",
    "Tunisia": "🇹🇳", "Turkey": "🇹🇷", "Turkmenistan": "🇹🇲", "Tuvalu": "🇹🇻", "Uganda": "🇺🇬",
    "Ukraine": "🇺🇦", "United Arab Emirates": "🇦🇪", "United Kingdom": "🇬🇧", "United States": "🇺🇸",
    "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿", "Vanuatu": "🇻🇺", "Vatican City": "🇻🇦", "Venezuela": "🇻🇪",
    "Vietnam": "🇻🇳", "Yemen": "🇾🇪", "Zambia": "🇿🇲", "Zimbabwe": "🇿🇼"
};

function getFlag(locationText) {
    if (countryToFlag[locationText]) return countryToFlag[locationText];

    const lower = locationText.toLowerCase();
    for (const [country, flag] of Object.entries(countryToFlag)) {
        if (country.toLowerCase() === lower) return flag;
    }

    if (lower.includes('united states') || lower.includes('usa')) return '🇺🇸';
    if (lower.includes('uk') || lower.includes('united kingdom')) return '🇬🇧';

    return "📍";
}

function renderBadge(locationText, container) {
    const userNameElement = document.querySelector('[data-testid="UserName"]');

    if (!userNameElement) return;

    const existingFlag = userNameElement.querySelector('.x-location-flag');
    const flagIcon = getFlag(locationText);

    if (existingFlag) {
        if (existingFlag.textContent.trim() !== flagIcon) {
            existingFlag.textContent = ` ${flagIcon}`;
            existingFlag.title = `Account based in ${locationText}`;
        }
        return;
    }

    const flagSpan = document.createElement('span');
    flagSpan.className = 'x-location-flag';
    flagSpan.textContent = ` ${flagIcon}`;
    flagSpan.title = `Account based in ${locationText}`;
    flagSpan.style.fontSize = '1.5em';
    flagSpan.style.marginLeft = '6px';
    flagSpan.style.cursor = 'help';
    flagSpan.style.verticalAlign = 'middle';

    const nameSpan = Array.from(userNameElement.querySelectorAll('span')).find(s => s.textContent.trim().length > 0);

    if (nameSpan) {
        let targetContainer = nameSpan.parentElement;

        while (targetContainer && targetContainer !== userNameElement) {
            const style = window.getComputedStyle(targetContainer);
            if (style.display === 'flex' && style.flexDirection === 'row') {
                targetContainer.appendChild(flagSpan);
                return;
            }
            targetContainer = targetContainer.parentElement;
        }

        nameSpan.parentElement.appendChild(flagSpan);
    } else {
        userNameElement.appendChild(flagSpan);
    }
}

async function fetchLocationFromAbout(username) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100px';
        iframe.style.height = '100px';
        iframe.style.visibility = 'hidden';
        iframe.style.pointerEvents = 'none';
        iframe.style.zIndex = '-9999';

        iframe.src = `${location.origin}/${username}/about?x_location_extension=true`;
        document.body.appendChild(iframe);

        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(() => {
            attempts++;
            try {
                const doc = iframe.contentDocument;
                if (doc && doc.readyState === 'complete') {
                    const result = doc.evaluate(
                        "//span[contains(text(), 'Account based in')]",
                        doc,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    );

                    const labelSpan = result.singleNodeValue;

                    if (labelSpan) {
                        const labelDiv = labelSpan.closest('div');
                        if (labelDiv) {
                            let valueDiv = labelDiv.nextElementSibling;

                            if (valueDiv) {
                                const value = valueDiv.textContent.trim();
                                if (value) {
                                    clearInterval(interval);
                                    iframe.remove();
                                    resolve(value);
                                    return;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignore errors
            }

            if (attempts >= maxAttempts) {
                clearInterval(interval);
                iframe.remove();
                resolve(null);
            }
        }, 500);
    });
}
