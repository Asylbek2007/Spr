class NewsAPI {
    constructor(scriptUrl) {
        this.scriptUrl = scriptUrl;
    }

    async fetchNews() {
        try {
            const response = await fetch(`${this.scriptUrl}?action=getNews`);
            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to fetch news');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    }

    async addNews(newsItem) {
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addNews',
                    ...newsItem
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding news:', error);
            throw error;
        }
    }
}

const newsAPI = new NewsAPI('https://script.google.com/macros/s/AKfycbwwfwEy1MiQG2mdDVlbDLvsNuuFO3ZfewQ1dhng0SOhEjBN1L-yp5TblVPbmek54N78/exec');
async function loadNewsContent() {
    try {
        const newsContent = document.getElementById('news-content');
        if (!newsContent) {
            console.error('News content container not found');
            return;
        }
        newsContent.innerHTML = '<div class="loading">Loading news...</div>';
        const newsData = await newsAPI.fetchNews();
        newsContent.innerHTML = '';
        newsData.forEach(item => {
            const newsItem = createNewsItem(item);
            newsContent.appendChild(newsItem);
        });
        addReadMoreListeners();

    } catch (error) {
        console.error('Failed to load news:', error);
        const newsContent = document.getElementById('news-content');
        if (newsContent) {
            newsContent.innerHTML = '<div class="error">Failed to load news. Please try again later.</div>';
        }
    }
}

function createNewsItem(item) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    newsItem.innerHTML = `
        <div class="news-image">
            <div class="news-image-placeholder">
                <img src="${item.image}" alt="" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
            </div>
        </div>
        <div class="news-content">
            <h3 class="news-title">${item.title}</h3>
            <div class="news-date">${item.date}</div>
            <p class="news-description">${item.description}</p>
            <button class="read-more-btn" data-news-id="${item.id}">Read More</button>
        </div>
    `;

    return newsItem;
}

function addReadMoreListeners() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');

    readMoreButtons.forEach(button => {
        button.addEventListener('click', function () {
            const newsId = this.getAttribute('data-news-id');
            handleReadMore(newsId);
        });
    });
}

function handleReadMore(newsId) {
    console.log(`Read more clicked for news item ${newsId}`);
    alert(`Opening detailed view for news item ${newsId}`);
}

async function refreshNews() {
    await loadNewsContent();
}

document.addEventListener('DOMContentLoaded', function () {
    loadNewsContent();
});
window.NewsManager = {
    loadNewsContent,
    refreshNews,
    newsAPI
};
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxePxJFDJdhASZL8XMXzzzYmXznzdJDXY_hDG8k6-gVRYm0yyUMM54kn5ovIiPf-5BP/exec';

function displayLeaderboard(data) {
    const container = document.getElementById('leaderboard-content');
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">No standings data available</div>';
        return;
    }

    const html = data.map((team, index) => `
        <div class="leaderboard-item">
            <span class="team-name">${index + 1}. ${team.name || team.team}</span>
            <span class="points">${team.points}</span>
        </div>
    `).join('');

    container.innerHTML = html;
}

function displayMatches(data) {
    const container = document.getElementById('matches-content');
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">No match data available</div>';
        return;
    }

    const html = data.map(match => `
        <div class="match-result">
            <div class="team">${match.homeTeam || match.home}</div>
            <div class="score">${match.homeScore || match.score.split('-')[0]} - ${match.awayScore || match.score.split('-')[1]}</div>
            <div class="team">${match.awayTeam || match.away}</div>
            <span class="status-badge">${match.status || 'CLOSED'}</span>
        </div>
    `).join('');

    container.innerHTML = html;
}

function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="error">${message}</div>`;
}

function showMessage(message, type = 'success') {
    const container = document.getElementById('form-messages');
    const className = type === 'success' ? 'success-message' : 'error';
    container.innerHTML = `<div class="${className}">${message}</div>`;

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

async function submitRegistration(formData) {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('registrationForm');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const formPayload = new FormData();
        for (const key in formData) {
            formPayload.append(key, formData[key]);
        }

        formPayload.append("timestamp", new Date().toISOString());
        formPayload.append("tournamentId", "JIHC_SPRING_CUP_25");

        const response = await fetch("https://script.google.com/macros/s/AKfycbx8uRZLS6SbBZJKeG8FQn1jFXCLgsesrDJ7qLwdKHg8iEOezwH-_FV3I8ijgvLdDA6fOQ/exec", {
            method: "POST",
            body: formPayload
        });

        if (!response.ok) {
            throw new Error("Failed to submit registration.");
        }

        const result = await response.json();
        showMessage(`🎉 Registration successful! Team "${formData.teamName}" has been registered for JIHC Spring Cup 25.`, 'success');
        form.reset();

    } catch (error) {
        console.error('Registration error:', error);
        showMessage('❌ Registration failed. Please try again later.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Register Team';
    }
}

document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    console.log(data);
    submitRegistration(data);
});

document.addEventListener('DOMContentLoaded', function () {
    const mockData = {
        leaderboard: [
            { name: "Na'Vi", points: 22 },
            { name: "JIHC UNITED", points: 19 },
            { name: "BARYS 10", points: 18 },
            { name: "FC Nomad", points: 16 },
            { name: "Avalanche FC", points: 15 }
        ],
        matches: [
            { home: "JIHC UNITED", away: "BARYS 10", score: "1-1", status: "CLOSED" },
            { home: "KazForce", away: "Acacia PTL", score: "0-1", status: "CLOSED" },
            { home: "Maxi-Tea", away: "FC Nomad", score: "3-0", status: "CLOSED" }
        ]
    };

    displayLeaderboard(mockData.leaderboard);
    displayMatches(mockData.matches);

    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function () {
            const newsItem = this.closest('.news-item');
            const title = newsItem.querySelector('.news-title').textContent;
            alert(`Opening full article: "${title}"\n\nThis would typically open a detailed news page or modal with the complete article.`);
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});