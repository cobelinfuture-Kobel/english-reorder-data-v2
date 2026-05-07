let hearts = 3;
let score = 0;
let bonusScore = 0;
let currentQuestionId = null;
let currentIndex = 0;
let currentLevel = "A1";
let currentScenario = null;
let currentUserId = null;
let currentUsername = "";
let currentUserRole = "";
let isSubmitting = false;
let hintUsed = false;
let questionResolved = false;
let currentAudioHintText = "";
let currentQuestionLevel = "";
let currentQuestionPattern = "";
let currentCorrectAnswer = "";
let questItems = [];
let sessionGrammar = new Set();
let sessionMistakes = [];
let learningSummaryRequestToken = 0;

const MAX_HEARTS = 3;
const NEXT_PRACTICE_STRATEGY_LABELS = {
    weak_pattern_not_attempted: "下一步建議：優先補弱句型的新題。",
    not_attempted: "下一步建議：先擴充還沒做過的題目。",
    recent_wrong_attempt: "下一步建議：先回顧最近的錯題。",
    none: "目前沒有推薦題目。",
};
const NEXT_PRACTICE_REASON_LABELS = {
    weak_pattern_not_attempted: "弱句型補強",
    not_attempted: "新題探索",
    recent_wrong_attempt: "最近錯題",
};

NEXT_PRACTICE_STRATEGY_LABELS.remediate_recent_wrong = "先複習最近錯題";
NEXT_PRACTICE_REASON_LABELS.recent_accuracy_low = "最近表現偏低，先穩固基礎";

const loginView = document.getElementById("login-view");
const usernameInput = document.getElementById("username-input");
const loginButton = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const launcherView = document.getElementById("launcher-view");
const gamePlayArea = document.getElementById("game-play-area");
const userSessionBar = document.getElementById("user-session-bar");
const userSessionText = document.getElementById("user-session-text");
const logoutButton = document.getElementById("logout-btn");
const levelButtons = Array.from(document.querySelectorAll(".level-chip"));
const scenarioButtons = Array.from(document.querySelectorAll(".scenario-card"));
const dropZone = document.getElementById("drop-zone");
const poolZone = document.getElementById("pool-zone");
const gameContainer = document.getElementById("game-container");
const header = document.getElementById("header");
const zoneLabels = Array.from(document.querySelectorAll(".zone-label"));
const scenarioDisplay = document.getElementById("scenario-display");
const translationDisplay = document.getElementById("translation-display");
const fsiInstruction = document.getElementById("fsi-instruction");
const heartsDisplay = document.getElementById("hearts");
const scoreDisplay = document.getElementById("score-display");
const progressFill = document.getElementById("progress-fill");
const feedback = document.getElementById("feedback");
const controls = document.getElementById("controls");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const replayVoiceButton = document.getElementById("replay-voice-btn");
const summaryView = document.getElementById("summary-view");
const summaryScoreText = document.getElementById("summary-score-text");
const bonusScoreNote = document.getElementById("bonus-score-note");
const resilienceBadge = document.getElementById("resilience-badge");
const coachFeedback = document.getElementById("coach-feedback");
const coachTitle = document.getElementById("coach-title");
const coachSteps = document.getElementById("coach-steps");
const finalHearts = document.getElementById("final-hearts");
const completedCount = document.getElementById("completed-count");
const masteredTopics = document.getElementById("mastered-topics");
const skillReportEmpty = document.getElementById("skill-report-empty");
const weakSkills = document.getElementById("weak-skills");
const developingSkills = document.getElementById("developing-skills");
const strongSkills = document.getElementById("strong-skills");
const restartButton = document.getElementById("restart-btn");
const gameOverView = document.getElementById("game-over-view");
const coachFeedbackOver = document.getElementById("coach-feedback-over");
const coachTitleOver = document.getElementById("coach-title-over");
const coachStepsOver = document.getElementById("coach-steps-over");
const mistakeList = document.getElementById("mistake-list");
const quitButton = document.getElementById("quit-btn");
const reviewButton = document.getElementById("review-btn");
const learningSummaryPanel = document.getElementById("learning-summary-panel");
const summaryTotalAttempts = document.getElementById("summary-total-attempts");
const summaryAccuracy = document.getElementById("summary-accuracy");
const summaryRecentAccuracy = document.getElementById("summary-recent-accuracy");
const summaryCoverage = document.getElementById("summary-coverage");
const summaryNotAttempted = document.getElementById("summary-not-attempted");
const weakPatternsPanel = document.getElementById("weak-patterns-panel");
const weakPatternsList = document.getElementById("weak-patterns-list");
const nextPracticePanel = document.getElementById("next-practice-panel");
const nextPracticeStatus = document.getElementById("next-practice-status");
const nextPracticeList = document.getElementById("next-practice-list");

const FSI_TEXTS = {
    question: "Nice. Turn it into a question.",
    negative: "Good. Now turn it into a negative sentence.",
    original: "Assemble this sentence.",
};

const COACHING_TIPS = {
    word_order_error: {
        title: "Weakness: Word Order",
        steps: [
            "Find the subject first: who does the action?",
            "Find the verb next: what happens?",
            "Put time, place, or manner near the end.",
        ],
    },
    question_structure_error: {
        title: "Weakness: Question Form",
        steps: [
            "Find the helper verb: Do, Does, or Did.",
            "Move the helper verb to the front.",
            "Place the subject right after the helper verb.",
        ],
    },
    negation_structure_error: {
        title: "Weakness: Negative Form",
        steps: [
            "Check whether the sentence needs do or does.",
            "Place not after the helper verb.",
            "Keep the main verb in its base form.",
        ],
    },
    subject_verb_error: {
        title: "Weakness: Subject Verb Agreement",
        steps: [
            "Check whether the subject is singular or plural.",
            "Use the matching verb form.",
            "Look again at third person singular endings.",
        ],
    },
    invalid_question_id: {
        title: "System Issue",
        steps: [
            "The question expired or was not found.",
            "Open a fresh question from the launcher.",
            "Try again with a new round.",
        ],
    },
    ALL_RESOLVED: {
        title: "Recovery Success",
        steps: [
            "You made mistakes but repaired them in review mode.",
            "That means the correction loop worked.",
            "Carry the same method into the next mission.",
        ],
    },
    PERFECT_RUN: {
        title: "Perfect Run",
        steps: [
            "You completed the mission without a mistake.",
            "Your sentence control stayed stable the whole round.",
            "Move up a level or try a harder scenario next.",
        ],
    },
};

const speaker = {
    lastText: "",

    play(text) {
        if (!text || !text.trim() || !("speechSynthesis" in window)) {
            return Promise.resolve();
        }

        this.lastText = text;
        window.speechSynthesis.cancel();

        updateReplayButton();
        return new Promise((resolve) => {
            let settled = false;
            const finish = () => {
                if (settled) {
                    return;
                }
                settled = true;
                resolve();
            };

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 0.85;
            utterance.pitch = 1.0;
            utterance.onend = finish;
            utterance.onerror = finish;

            const fallbackMs = Math.max(1200, Math.min(6000, text.trim().split(/\s+/).length * 450));
            setTimeout(finish, fallbackMs);
            window.speechSynthesis.speak(utterance);
        });
    },

    replay() {
        if (!this.lastText) {
            return;
        }
        this.play(this.lastText);
    },

    reset() {
        this.lastText = "";
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        updateReplayButton();
    },
};

new Sortable(dropZone, { group: "shared", animation: 150 });
new Sortable(poolZone, { group: "shared", animation: 150 });

function setSelectedLevel(level) {
    currentLevel = level;
    levelButtons.forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.level === level);
    });
}

function updateStatusBar() {
    heartsDisplay.innerText = "❤️".repeat(hearts) + "🖤".repeat(MAX_HEARTS - hearts);
    scoreDisplay.innerText = `Score: ${score}`;

    const total = questItems.length || 1;
    progressFill.style.width = `${(currentIndex / total) * 100}%`;
}

function resetBoardState() {
    dropZone.innerHTML = "";
    poolZone.innerHTML = "";
    feedback.innerText = "";
    feedback.className = "";
    nextButton.hidden = true;
    submitButton.hidden = false;
    submitButton.disabled = false;
}

function updateReplayButton() {
    if (!replayVoiceButton) {
        return;
    }

    const hasAudio = questionResolved ? !!speaker.lastText : !!currentAudioHintText;
    replayVoiceButton.disabled = !hasAudio;
    replayVoiceButton.classList.toggle("disabled", !hasAudio);
    replayVoiceButton.innerText = questionResolved ? "Replay" : "Audio Hint";
    replayVoiceButton.title = questionResolved ? "Listen again" : "Play audio hint";
}

function unlockSubmitting() {
    isSubmitting = false;
    submitButton.disabled = false;
}

function formatGrammarLabel(topic) {
    return topic
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function clearSkillReportLists() {
    weakSkills.innerHTML = "";
    developingSkills.innerHTML = "";
    strongSkills.innerHTML = "";
}

function renderSkillGroup(targetNode, items) {
    targetNode.innerHTML = "";
    items.forEach((skill) => {
        const item = document.createElement("li");
        item.innerText = formatGrammarLabel(skill);
        targetNode.appendChild(item);
    });
}

async function renderSkillReport() {
    clearSkillReportLists();
    skillReportEmpty.hidden = true;

    try {
        const data = await fetchJson(
            `/api/report/skills?user_id=${encodeURIComponent(currentUserId)}`
        );
        const skills = data.skills || {};
        const weak = [];
        const developing = [];
        const strong = [];

        Object.entries(skills).forEach(([skillName, stats]) => {
            if (stats.status === "weak") {
                weak.push(skillName);
            } else if (stats.status === "strong") {
                strong.push(skillName);
            } else {
                developing.push(skillName);
            }
        });

        renderSkillGroup(weakSkills, weak);
        renderSkillGroup(developingSkills, developing);
        renderSkillGroup(strongSkills, strong);

        if (!weak.length && !developing.length && !strong.length) {
            skillReportEmpty.hidden = false;
        }
    } catch (_error) {
        skillReportEmpty.innerText = "Skill report unavailable.";
        skillReportEmpty.hidden = false;
    }
}

function setGameSectionsHidden(hidden) {
    header.hidden = hidden;
    dropZone.hidden = hidden;
    poolZone.hidden = hidden;
    zoneLabels.forEach((node) => {
        node.hidden = hidden;
    });
    controls.hidden = hidden;
    feedback.hidden = hidden;
}

function getDominantMistake() {
    const activeMistakes = sessionMistakes.filter((mistake) => !mistake.resolved);

    if (activeMistakes.length === 0 && sessionMistakes.length > 0) {
        return "ALL_RESOLVED";
    }

    if (activeMistakes.length === 0) {
        return null;
    }

    const counts = activeMistakes.reduce((acc, mistake) => {
        const key = mistake.mistake_type || "word_order_error";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
}

function renderCoachFeedback(targetBox, targetTitle, targetSteps) {
    let key = getDominantMistake();
    if (!key && !sessionMistakes.length) {
        key = "PERFECT_RUN";
    }

    const tip = key ? COACHING_TIPS[key] : null;
    if (!tip) {
        targetBox.hidden = true;
        return;
    }

    targetTitle.innerText = tip.title;
    targetSteps.innerHTML = "";
    tip.steps.forEach((step) => {
        const item = document.createElement("li");
        item.innerText = step;
        targetSteps.appendChild(item);
    });
    targetBox.hidden = false;
}

async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.error || data.mistake_type || "Request failed");
        error.payload = data;
        throw error;
    }

    return data;
}

function showError(message) {
    feedback.innerText = message;
    feedback.className = "error-text";
}

function showLoginError(message) {
    loginError.innerText = message;
    loginError.hidden = !message;
}

function formatPercent(value, digits = 0) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "--";
    }

    return `${(value * 100).toFixed(digits)}%`;
}

function isLearningSummaryRequestCurrent(userId, requestToken) {
    return (
        requestToken === learningSummaryRequestToken &&
        currentUserId === userId &&
        localStorage.getItem("user_id") === userId
    );
}

function renderWeakPatternsEmpty() {
    weakPatternsList.innerHTML = "";
    const item = document.createElement("li");
    item.innerText = "\u76ee\u524d\u6c92\u6709\u660e\u986f\u5f31\u53e5\u578b\u3002";
    weakPatternsList.appendChild(item);
}

function clearNextPracticePanel() {
    nextPracticeStatus.innerText = "";
    nextPracticeList.innerHTML = "";
}

function hideNextPracticePanel() {
    nextPracticePanel.hidden = true;
}

function showNextPracticePanel() {
    nextPracticePanel.hidden = false;
}

async function loadNextPractice() {
    const storedUserId = localStorage.getItem("user_id");
    nextPracticeRequestToken += 1;
    const requestToken = nextPracticeRequestToken;

    if (!storedUserId) {
        clearNextPracticePanel();
        hideNextPracticePanel();
        return;
    }

    try {
        const data = await fetchJson(
            `/api/users/${encodeURIComponent(storedUserId)}/next-practice?limit=5`
        );
        if (
            requestToken !== nextPracticeRequestToken ||
            localStorage.getItem("user_id") !== storedUserId
        ) {
            return;
        }

        clearNextPracticePanel();
        showNextPracticePanel();
        nextPracticeStatus.innerText =
            NEXT_PRACTICE_STRATEGY_LABELS[data.strategy] || "下一步建議";

        const recommendations = data.recommendations || [];
        if (!recommendations.length) {
            nextPracticeStatus.innerText = "目前沒有推薦題目。";
            return;
        }

        recommendations.forEach((item) => {
            const row = document.createElement("li");
            const main = document.createElement("span");
            const meta = document.createElement("span");
            const reasonLabel =
                NEXT_PRACTICE_REASON_LABELS[item.reason] || item.reason || "建議";

            main.className = "next-practice-main";
            meta.className = "next-practice-meta";
            main.innerText = `${item.level} / ${item.pattern} / ${reasonLabel}`;
            meta.innerText = item.sentence_id;
            row.appendChild(main);
            row.appendChild(meta);
            nextPracticeList.appendChild(row);
        });
    } catch (error) {
        if (
            requestToken !== nextPracticeRequestToken ||
            localStorage.getItem("user_id") !== storedUserId
        ) {
            return;
        }

        console.warn("Failed to load next practice recommendations", error);
        clearNextPracticePanel();
        showNextPracticePanel();
        nextPracticeStatus.innerText = "無法載入下一步建議。";
    }
}

function getStoredUser() {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!userId || !username) {
        return null;
    }

    return { userId, username, role: role || "student" };
}

function clearLearningSummary() {
    summaryTotalAttempts.innerText = "--";
    summaryAccuracy.innerText = "--";
    summaryRecentAccuracy.innerText = "--";
    summaryCoverage.innerText = "--";
    summaryNotAttempted.innerText = "--";
    weakPatternsList.innerHTML = "";
    clearNextPracticePanel();
}

function hideLearningSummaryPanel() {
    learningSummaryPanel.hidden = true;
}

function showLearningSummaryPanel() {
    learningSummaryPanel.hidden = false;
    weakPatternsPanel.hidden = false;
    nextPracticePanel.hidden = false;
}

async function loadStatsSummary(userId, requestToken = learningSummaryRequestToken) {
    const data = await fetchJson(`/api/users/${encodeURIComponent(userId)}/stats`);
    if (!isLearningSummaryRequestCurrent(userId, requestToken)) {
        return;
    }

    summaryTotalAttempts.innerText = String(data.total_attempts ?? 0);
    summaryAccuracy.innerText = formatPercent(data.accuracy ?? 0);
    if ((data.recent?.last_10?.total_attempts ?? 0) > 0) {
        summaryRecentAccuracy.innerText = formatPercent(data.recent?.last_10?.accuracy ?? 0);
    } else {
        summaryRecentAccuracy.innerText = "--";
    }
}

async function loadCoverageSummary(userId, requestToken = learningSummaryRequestToken) {
    const data = await fetchJson(`/api/users/${encodeURIComponent(userId)}/coverage`);
    if (!isLearningSummaryRequestCurrent(userId, requestToken)) {
        return;
    }

    summaryCoverage.innerText = formatPercent(data.coverage_rate ?? 0, 1);
    summaryNotAttempted.innerText = String(data.not_attempted_sentences ?? 0);
}

async function loadWeakPatternsSummary(userId, requestToken = learningSummaryRequestToken) {
    const data = await fetchJson(`/api/users/${encodeURIComponent(userId)}/weak-patterns`);
    if (!isLearningSummaryRequestCurrent(userId, requestToken)) {
        return;
    }

    weakPatternsList.innerHTML = "";
    const weakPatterns = (data.weak_patterns || []).slice(0, 3);
    if (!weakPatterns.length) {
        renderWeakPatternsEmpty();
        return;
    }

    weakPatterns.forEach((pattern) => {
        const item = document.createElement("li");
        item.innerText = `${pattern.pattern} (${formatPercent(pattern.accuracy ?? 0)})`;
        weakPatternsList.appendChild(item);
    });
}

async function loadNextPractice(userId, requestToken = learningSummaryRequestToken) {
    const data = await fetchJson(
        `/api/users/${encodeURIComponent(userId)}/next-practice?limit=5`
    );
    if (!isLearningSummaryRequestCurrent(userId, requestToken)) {
        return;
    }

    clearNextPracticePanel();
    if (
        data.reason_code === "RECENT_ACCURACY_LOW" ||
        data.strategy === "remediate_recent_wrong"
    ) {
        nextPracticeStatus.innerText =
            "🛠️ 偵測到近期錯誤較多，建議先完成錯題修復，再開啟新挑戰。";
    } else {
        nextPracticeStatus.innerText =
            data.message ||
            NEXT_PRACTICE_STRATEGY_LABELS[data.strategy] ||
            "Next practice recommendations";
    }

    const recommendations = data.recommendations || [];
    if (!recommendations.length) {
        nextPracticeStatus.innerText = "No recommended practice items right now.";
        return;
    }

    recommendations.forEach((item) => {
        const row = document.createElement("li");
        const main = document.createElement("span");
        const meta = document.createElement("span");
        const reasonLabel =
            NEXT_PRACTICE_REASON_LABELS[item.reason] || item.reason || "reason";

        main.className = "next-practice-main";
        meta.className = "next-practice-meta";
        main.innerText = `${item.level} / ${item.pattern} / ${reasonLabel}`;
        meta.innerText = item.sentence_id;
        row.appendChild(main);
        row.appendChild(meta);
        nextPracticeList.appendChild(row);
    });
}

function applyLearningSummaryFailure(sectionName) {
    if (sectionName === "stats") {
        summaryTotalAttempts.innerText = "--";
        summaryAccuracy.innerText = "--";
        summaryRecentAccuracy.innerText = "--";
        return;
    }

    if (sectionName === "coverage") {
        summaryCoverage.innerText = "--";
        summaryNotAttempted.innerText = "--";
        return;
    }

    if (sectionName === "weak-patterns") {
        weakPatternsList.innerHTML = "";
        const item = document.createElement("li");
        item.innerText = "\u5f31\u53e5\u578b\u8cc7\u6599\u66ab\u6642\u7121\u6cd5\u8f09\u5165\u3002";
        weakPatternsList.appendChild(item);
        return;
    }

    clearNextPracticePanel();
    nextPracticeStatus.innerText = "Next practice is temporarily unavailable.";
}

async function loadLearningSummary() {
    const userId = currentUserId || localStorage.getItem("user_id");
    clearLearningSummary();

    if (!userId) {
        hideLearningSummaryPanel();
        return;
    }

    learningSummaryRequestToken += 1;
    const requestToken = learningSummaryRequestToken;
    showLearningSummaryPanel();

    const results = await Promise.allSettled([
        loadStatsSummary(userId, requestToken),
        loadCoverageSummary(userId, requestToken),
        loadWeakPatternsSummary(userId, requestToken),
        loadNextPractice(userId, requestToken),
    ]);

    if (!isLearningSummaryRequestCurrent(userId, requestToken)) {
        return;
    }

    ["stats", "coverage", "weak-patterns", "next-practice"].forEach((sectionName, index) => {
        if (results[index].status === "rejected") {
            console.warn(`Failed to load ${sectionName}`, results[index].reason);
            applyLearningSummaryFailure(sectionName);
        }
    });
}

function applyUserSession(user) {
    currentUserId = user.userId;
    currentUsername = user.username;
    currentUserRole = user.role || "student";
    userSessionText.innerText = `${currentUsername} (${currentUserRole})`;
    userSessionBar.hidden = false;
    loginView.hidden = true;
    launcherView.hidden = false;
    showLoginError("");
}

function clearUserSession() {
    learningSummaryRequestToken += 1;
    clearLearningSummary();
    hideLearningSummaryPanel();
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    currentUserId = null;
    currentUsername = "";
    currentUserRole = "";
    gamePlayArea.hidden = true;
    launcherView.hidden = true;
    loginView.hidden = false;
    userSessionBar.hidden = true;
    usernameInput.value = "";
    showLoginError("");
    feedback.innerText = "";
    speaker.reset();
}

function renderHint(item) {
    dropZone.classList.remove("review-mode");

    if (item.source === "review") {
        fsiInstruction.innerText = "Practice mode: repair this mistake.";
        fsiInstruction.style.display = "block";
        dropZone.classList.add("review-mode");
        return;
    }

    if (item.task_type !== "original") {
        fsiInstruction.innerText = FSI_TEXTS[item.task_type] || "Change the sentence.";
        fsiInstruction.style.display = "block";
        return;
    }

    fsiInstruction.innerText = "";
    fsiInstruction.style.display = "none";
}

function showSummary() {
    setGameSectionsHidden(true);
    gameOverView.hidden = true;
    summaryView.hidden = false;

    summaryScoreText.innerText = `Final Score: ${score}`;
    finalHearts.innerText = hearts > 0 ? "❤️".repeat(hearts) : "0";
    completedCount.innerText = String(questItems.length);

    if (bonusScore > 0) {
        bonusScoreNote.innerText = `Includes review bonus: +${bonusScore}`;
        bonusScoreNote.hidden = false;
        resilienceBadge.innerText = "Resilience Badge: you repaired mistakes in review mode.";
        resilienceBadge.hidden = false;
    } else {
        bonusScoreNote.hidden = true;
        resilienceBadge.hidden = true;
    }

    renderCoachFeedback(coachFeedback, coachTitle, coachSteps);

    masteredTopics.innerHTML = "";
    sessionGrammar.forEach((topic) => {
        const item = document.createElement("li");
        item.innerText = formatGrammarLabel(topic);
        masteredTopics.appendChild(item);
    });

    renderSkillReport();
}

function showGameOver() {
    setGameSectionsHidden(true);
    summaryView.hidden = true;
    gameOverView.hidden = false;
    renderCoachFeedback(coachFeedbackOver, coachTitleOver, coachStepsOver);

    mistakeList.innerHTML = "";
    sessionMistakes.forEach((mistake) => {
        const item = document.createElement("li");
        const tip = COACHING_TIPS[mistake.mistake_type];
        const label = tip ? tip.title : "Weakness: Sentence Control";
        item.innerHTML = `<strong>${mistake.translation}</strong><br><small>${label}</small>`;
        item.style.marginBottom = "10px";
        mistakeList.appendChild(item);
    });
}

function collectMistake(result) {
    const currentItem = questItems[currentIndex];
    if (!currentItem) {
        return;
    }

    const existing = sessionMistakes.find((mistake) => mistake.sentence_id === currentItem.sentence_id);
    if (existing) {
        existing.translation = translationDisplay.innerText;
        existing.mistake_type = result.mistake_type;
        existing.task_type = currentItem.task_type || "original";
        existing.grammar_focus = currentItem.grammar_focus || [];
        existing.resolved = false;
        return;
    }

    sessionMistakes.push({
        sentence_id: currentItem.sentence_id,
        translation: translationDisplay.innerText,
        mistake_type: result.mistake_type,
        task_type: currentItem.task_type || "original",
        grammar_focus: currentItem.grammar_focus || [],
        resolved: false,
    });
}

function updateMistakeStatus(sentenceId, resolved = true) {
    const mistake = sessionMistakes.find((item) => item.sentence_id === sentenceId);
    if (mistake) {
        mistake.resolved = resolved;
    }
}

function resetSessionForFreshQuest() {
    sessionGrammar = new Set();
    sessionMistakes = [];
    currentIndex = 0;
    hearts = MAX_HEARTS;
    score = 0;
    bonusScore = 0;
    currentQuestionId = null;
    hintUsed = false;
    questionResolved = false;
    currentAudioHintText = "";
    summaryView.hidden = true;
    gameOverView.hidden = true;
    setGameSectionsHidden(false);
    bonusScoreNote.hidden = true;
    resilienceBadge.hidden = true;
    coachFeedback.hidden = true;
    coachFeedbackOver.hidden = true;
    unlockSubmitting();
}

async function startQuest(level, scenario, userId = currentUserId) {
    currentUserId = userId;
    const data = await fetchJson(
        `/api/quest?user_id=${encodeURIComponent(userId)}&level=${encodeURIComponent(level)}&scenario=${encodeURIComponent(scenario)}`
    );

    questItems = data.quest_items || [];
    resetSessionForFreshQuest();

    questItems.forEach((item) => {
        (item.grammar_focus || []).forEach((grammar) => sessionGrammar.add(grammar));
    });

    updateStatusBar();

    if (!questItems.length) {
        scenarioDisplay.innerText = `${level} / ${scenario}`;
        translationDisplay.innerText = "No available questions for this mission yet.";
        return;
    }

    await loadQuestion(questItems[currentIndex]);
}

async function initGame(level, scenario, userId = currentUserId) {
    if (!userId) {
        clearUserSession();
        return;
    }
    currentLevel = level;
    currentScenario = scenario;
    currentUserId = userId;
    launcherView.hidden = true;
    gamePlayArea.hidden = false;

    try {
        await startQuest(level, scenario, userId);
    } catch (error) {
        showError(error.payload?.error || error.message);
        unlockSubmitting();
    }
}

async function loadQuestion(item) {
    try {
        speaker.reset();
        const query = new URLSearchParams({
            sentence_id: item.sentence_id,
            task_type: item.task_type,
        });
        const data = await fetchJson(`/api/question?${query.toString()}`);

        currentQuestionId = data.question_id;
        hintUsed = false;
        questionResolved = false;
        currentAudioHintText = data.audio_hint_text || "";
        currentQuestionLevel = data.level || currentLevel;
        currentQuestionPattern = data.pattern_id || "";
        currentCorrectAnswer = data.audio_hint_text || "";
        if (item.source === "review") {
            scenarioDisplay.innerText = `Review Mode | ${item.task_type}`;
        } else {
            scenarioDisplay.innerText = `${currentLevel} | ${currentScenario} | ${item.task_type}`;
        }
        translationDisplay.innerText = data.translation;
        renderHint(item);
        resetBoardState();
        updateStatusBar();
        updateReplayButton();
        unlockSubmitting();

        data.shuffled_chunks.forEach((chunk) => {
            const card = document.createElement("div");
            card.className = "chunk-card";
            card.dataset.id = chunk.chunk_id;
            card.innerText = chunk.text;
            poolZone.appendChild(card);
        });
    } catch (error) {
        showError(error.payload?.error || error.message);
        unlockSubmitting();
    }
}

async function goNext() {
    currentIndex += 1;

    if (currentIndex < questItems.length) {
        await loadQuestion(questItems[currentIndex]);
        return;
    }

    progressFill.style.width = "100%";
    unlockSubmitting();
    showSummary();
}

async function showFeedback(result) {
    const currentItem = questItems[currentIndex];
    const isReviewMode = currentItem?.source === "review";

    if (result.is_correct) {
        questionResolved = true;

        if (isReviewMode) {
            const reviewPoints = result.result_type === "assisted_correct" ? 3 : 5;
            bonusScore += reviewPoints;
            score += reviewPoints;
            updateMistakeStatus(currentItem.sentence_id, true);
        } else {
            score += result.result_type === "assisted_correct" ? 8 : 10;
        }

        if (result.result_type === "assisted_correct") {
            feedback.innerText = isReviewMode ? "Recovered with hint! +3 bonus" : "Assisted correct! +8";
        } else {
            feedback.innerText = isReviewMode ? "Recovered! +5 bonus" : "Perfect correct! +10";
        }
        feedback.className = "success-text";
        const spokenSentence = Array.from(dropZone.children)
            .map((chunk) => chunk.innerText.trim())
            .filter(Boolean)
            .join(" ");
        dropZone.classList.add("correct-flash");
        setTimeout(() => dropZone.classList.remove("correct-flash"), 500);
        await speaker.play(spokenSentence);

        if (!isReviewMode && result.next_immediate_task) {
            submitButton.disabled = true;
            await loadQuestion({
                ...result.next_immediate_task,
                source: currentItem.source,
                grammar_focus: currentItem.grammar_focus || [],
            });
        } else {
            submitButton.hidden = true;
            await goNext();
        }
    } else {
        hearts -= 1;
        collectMistake(result);
        feedback.innerText = `Try again! (${result.mistake_type || "word_order_error"})`;
        feedback.className = "error-text";
        gameContainer.classList.add("shake");
        setTimeout(() => gameContainer.classList.remove("shake"), 300);

        if (hearts <= 0) {
            updateStatusBar();
            unlockSubmitting();
            showGameOver();
            return;
        }
    }

    updateStatusBar();
}

async function submitAnswer() {
    if (isSubmitting) {
        return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    const userChunkIds = Array.from(dropZone.children).map((child) => child.dataset.id);
    const userAnswer = Array.from(dropZone.children)
        .map((child) => child.innerText.trim())
        .filter(Boolean)
        .join(" ");
    let result = null;

    try {
        result = await fetchJson("/api/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUserId,
                question_id: currentQuestionId,
                user_chunk_ids: userChunkIds,
                hint_used: hintUsed,
            }),
        });
        try {
            await fetchJson("/api/attempts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: currentUserId,
                    sentence_id: questItems[currentIndex]?.sentence_id,
                    level: currentQuestionLevel || currentLevel,
                    pattern: currentQuestionPattern,
                    user_answer: userAnswer,
                    correct_answer: currentCorrectAnswer,
                    is_correct: result.is_correct,
                }),
            });
            await loadLearningSummary();
        } catch (attemptError) {
            console.warn("Failed to save attempt", attemptError);
        }
        await showFeedback(result);
    } catch (error) {
        showError(error.payload?.mistake_type || error.payload?.error || error.message);
    } finally {
        if (!result?.is_correct) {
            unlockSubmitting();
        }
    }
}

submitButton.addEventListener("click", submitAnswer);

loginButton.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        showLoginError("Username is required.");
        return;
    }

    loginButton.disabled = true;
    try {
        clearLearningSummary();
        hideLearningSummaryPanel();
        const user = await fetchJson("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        localStorage.setItem("user_id", user.id);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        applyUserSession({
            userId: user.id,
            username: user.username,
            role: user.role,
        });
        await loadLearningSummary();
    } catch (error) {
        showLoginError(error.payload?.error || error.message);
    } finally {
        loginButton.disabled = false;
    }
});

usernameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loginButton.click();
    }
});

replayVoiceButton.addEventListener("click", () => {
    if (questionResolved) {
        speaker.replay();
        return;
    }

    if (!currentAudioHintText) {
        return;
    }

    if (!hintUsed) {
        hintUsed = true;
        score = Math.max(0, score - 2);
        updateStatusBar();
        feedback.innerText = "Audio hint used: -2 points";
        feedback.className = "error-text";
    }

    speaker.play(currentAudioHintText);
});

nextButton.addEventListener("click", async () => {
    await goNext();
});

restartButton.addEventListener("click", () => {
    window.location.reload();
});

quitButton.addEventListener("click", () => {
    speaker.reset();
    gamePlayArea.hidden = true;
    launcherView.hidden = false;
    feedback.innerText = "";
    setSelectedLevel(currentLevel);
});

logoutButton.addEventListener("click", () => {
    clearUserSession();
});

reviewButton.addEventListener("click", async () => {
    if (!sessionMistakes.length) {
        return;
    }

    questItems = sessionMistakes
        .map((mistake) => ({
            sentence_id: mistake.sentence_id,
            task_type: mistake.task_type || "original",
            grammar_focus: mistake.grammar_focus || [],
            source: "review",
        }))
        .filter((item) => {
            const mistake = sessionMistakes.find((entry) => entry.sentence_id === item.sentence_id);
            return mistake && !mistake.resolved;
        });

    if (!questItems.length) {
        showSummary();
        return;
    }

    hearts = MAX_HEARTS;
    currentIndex = 0;
    currentQuestionId = null;

    gameOverView.hidden = true;
    summaryView.hidden = true;
    coachFeedback.hidden = true;
    coachFeedbackOver.hidden = true;
    setGameSectionsHidden(false);
    updateStatusBar();
    await loadQuestion(questItems[currentIndex]);
});

levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setSelectedLevel(button.dataset.level);
    });
});

scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
        initGame(currentLevel, button.dataset.scenario);
    });
});

setSelectedLevel(currentLevel);
updateReplayButton();

const searchParams = new URLSearchParams(window.location.search);
if (searchParams.get("demo") === "true") {
    const demoLevel = searchParams.get("level") || "A1";
    const demoScenario = searchParams.get("scenario") || "daily_routine";
    const demoUserId = searchParams.get("user_id") || "demo_user";
    setSelectedLevel(demoLevel);
    initGame(demoLevel, demoScenario, demoUserId);
} else {
    launcherView.hidden = true;
    gamePlayArea.hidden = true;
    const storedUser = getStoredUser();
    if (storedUser) {
        applyUserSession(storedUser);
        loadLearningSummary();
    } else {
        clearUserSession();
    }
}

window.initGame = initGame;
