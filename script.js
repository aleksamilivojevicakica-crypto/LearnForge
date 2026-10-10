
'use strict';

const bank = {
    math: {
        title: 'Quadratic equations',
        explanation: 'A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0. To solve it, calculate the discriminant D = b² − 4ac. If D > 0, there are two distinct real roots; if D = 0, one repeated real root; if D < 0, no real roots. When D ≥ 0, use x = (−b ± √D)/(2a). Example: x² − 5x + 6 = 0 gives (x − 2)(x − 3) = 0, so x = 2 or x = 3.',
        questions: [
            ['What is the standard form of a quadratic equation?', ['ax² + bx + c = 0', 'ax + b = 0', 'a + b + c = 0'], 0, 'The highest power of x is 2.'],
            ['What is the discriminant?', ['b² + 4ac', 'b² − 4ac', '2a'], 1, 'D = b² − 4ac.'],
            ['Solve x² − 5x + 6 = 0.', ['2 and 3', '−2 and −3', '1 and 6'], 0, '(x − 2)(x − 3) = 0.']
        ]
    },
    science: {
        title: 'Photosynthesis',
        explanation: 'Photosynthesis is the process by which plants, algae and some bacteria convert light energy into chemical energy. In plants, chlorophyll in chloroplasts absorbs light. Water and carbon dioxide are used to produce sugars, and oxygen is released. A simplified equation is 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.',
        questions: [
            ['Which organelle carries out photosynthesis?', ['Mitochondrion', 'Chloroplast', 'Nucleus'], 1, 'Chloroplasts contain chlorophyll.'],
            ['Which gas is consumed?', ['Carbon dioxide', 'Oxygen', 'Nitrogen'], 0, 'Plants take in CO₂.'],
            ['What provides energy for photosynthesis?', ['Sound', 'Light', 'Gravity'], 1, 'Light drives the process.']
        ]
    },
    history: {
        title: 'Industrial Revolution',
        explanation: 'The Industrial Revolution began in Britain in the late 18th century and spread to other regions. Mechanized production, steam power, factories, and new transport systems transformed work and society. Production increased, but industrial cities also faced pollution, overcrowding and harsh working conditions.',
        questions: [
            ['Where did the Industrial Revolution begin?', ['Britain', 'Japan', 'Brazil'], 0, 'It began in Britain.'],
            ['Which power source was important for early factories?', ['Solar panels', 'Steam engines', 'Nuclear reactors'], 1, 'Steam power drove machinery.'],
            ['Which was a common urban problem?', ['Overcrowding', 'Less pollution', 'No factories'], 0, 'Rapid urbanization led to overcrowding.']
        ]
    },
    english: {
        title: 'English conditionals',
        explanation: 'Conditionals connect a condition to its result. Zero conditional: If + present simple, present simple (general truths). First conditional: If + present simple, will + base verb (real future possibility). Second conditional: If + past simple, would + base verb (hypothetical present/future). Example: If I studied more, I would improve.',
        questions: [
            ['Choose the first conditional.', ['If it rains, I will stay home.', 'If it rained, I would stay home.', 'If water freezes, it expands.'], 0, 'First conditional uses if + present, will + verb.'],
            ['Which form expresses a hypothetical situation?', ['Zero', 'First', 'Second'], 2, 'Second conditional describes hypothetical situations.'],
            ['Complete: If I had time, I ___ read more.', ['will', 'would', 'am'], 1, 'Use would + base verb.']
        ]
    },
    computing: {
        title: 'Algorithms and complexity',
        explanation: 'An algorithm is a finite sequence of steps to solve a problem. Time complexity describes how running time grows with input size. A linear scan of n items takes O(n) time in the worst case. Binary search takes O(log n), but requires sorted data. Good algorithms are correct, understandable and efficient.',
        questions: [
            ['What does O(n) mean?', ['Linear growth', 'Constant time', 'Exponential growth'], 0, 'Work grows proportionally with n.'],
            ['Binary search requires data to be…', ['Random', 'Sorted', 'Encrypted'], 1, 'Binary search relies on ordering.'],
            ['Worst-case complexity of binary search?', ['O(n²)', 'O(n)', 'O(log n)'], 2, 'The search space is halved each step.']
        ]
    }
};

const $ = id => document.getElementById(id);

const safe = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));

let sessions = [];

try {
    const saved = JSON.parse(
        localStorage.getItem('learnforge_sessions') || '[]'
    );

    if (Array.isArray(saved)) {
        sessions = saved
            .filter(x =>
                x &&
                typeof x.score === 'number' &&
                typeof x.date === 'string'
            )
            .slice(0, 30);
    }
} catch {}

let active = null;
let aiEnabled = false;

function renderStats() {
    $('completed').textContent = sessions.length;

    $('average').textContent = sessions.length
        ? Math.round(
            sessions.reduce((sum, x) => sum + x.score, 0) /
            sessions.length
        ) + '%'
        : '—';

    $('history').innerHTML = sessions.length
        ? sessions.slice(0, 6).map(x => `
            <li>
                ${safe(x.subject)} · ${x.score}%
                <span class="small">(${safe(x.date)})</span>
            </li>
        `).join('')
        : '<li>No quizzes yet. Try one!</li>';
}

function selection() {
    return bank[$('subject').value];
}

async function aiRequest(mode) {
    const topic = $('topic').value.trim();

    if (!topic) {
        $('output').textContent = 'Please enter a topic.';
        return;
    }

    const buttons = [$('explain'), $('quiz')];
    buttons.forEach(button => button.disabled = true);

    $('output').textContent = 'Generating your content…';
    $('quizArea').replaceChildren();
    active = null;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode,
                topic,
                subject: $('subject').selectedOptions[0].text,
                level: $('level').value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Generation failed');
        }

        if (mode === 'explain') {
            $('output').textContent =
                '📘 ' + topic + '\n\n' + data.explanation;
        } else {
            showQuiz(data.questions, topic, false);
        }

    } catch (error) {
        console.error('Generation error:', error.message);

        $('output').textContent =
            'Generation failed. Please try again later.';
    } finally {
        buttons.forEach(button => button.disabled = false);
    }
}

function showQuiz(questions, title, demo) {
    active = {
        subject: $('subject').selectedOptions[0].text,
        questions
    };

    $('output').textContent =
        '📝 ' + title + ' — ' + questions.length + ' questions' +
        (demo
            ? '\nOffline demo: built-in questions.'
            : '\nQuiz generated successfully.');

    $('quizArea').innerHTML =
        questions.map((q, i) => `
            <fieldset class="question">
                <legend>Question ${i + 1}</legend>
                <p>${safe(q[0])}</p>
                ${q[1].map((answer, j) => `
                    <label class="option">
                        <input
                            type="radio"
                            name="q${i}"
                            value="${j}"
                        >
                        ${safe(answer)}
                    </label>
                `).join('')}
            </fieldset>
        `).join('') +
        '<button id="submitQuiz">Check my answers</button>' +
        '<div id="feedback" class="result" aria-live="polite"></div>';

    $('submitQuiz').onclick = grade;
}

$('explain').onclick = () => {
    if (aiEnabled) {
        return aiRequest('explain');
    }

    active = null;
    $('quizArea').replaceChildren();

    const lesson = selection();

    $('output').textContent =
        '📘 ' + lesson.title +
        '\n\n' + lesson.explanation +
        '\n\nOffline demo: choose a subject. Custom topics require the AI server.';
};

$('quiz').onclick = () => {
    if (aiEnabled) {
        return aiRequest('quiz');
    }

    const lesson = selection();
    showQuiz(lesson.questions, lesson.title, true);
};

fetch('/api/status')
    .then(response => response.ok ? response.json() : null)
    .then(data => {
        aiEnabled = !!data?.aiEnabled;

        const hint = document.querySelector('.hint');

        if (hint) {
            hint.textContent = aiEnabled
                ? 'AI mode is ready! Enter any topic and choose a difficulty.'
                : 'Offline demo mode: built-in lessons. To enable AI, run the server with your API key.';
        }
    })
    .catch(() => {});

function grade() {
    if (!active) return;

    const answers = active.questions.map((_, i) =>
        document.querySelector(`input[name="q${i}"]:checked`)
    );

    if (answers.some(answer => !answer)) {
        $('feedback').textContent =
            'Please answer all questions first.';
        return;
    }

    const count = answers.filter((answer, i) =>
        Number(answer.value) === active.questions[i][2]
    ).length;

    const score = Math.round(
        count / active.questions.length * 100
    );

    $('feedback').innerHTML =
        `<strong>Score: ${count}/${active.questions.length} (${score}%)</strong><br><br>` +
        active.questions.map((q, i) => `
            <div class="${
                Number(answers[i].value) === q[2]
                    ? 'correct'
                    : 'wrong'
            }">
                Q${i + 1}:
                ${
                    Number(answers[i].value) === q[2]
                        ? 'Correct'
                        : 'Incorrect'
                }.
                ${safe(q[3])}
            </div>
        `).join('');

    sessions.unshift({
        subject: active.subject,
        score,
        date: new Date().toLocaleDateString()
    });

    sessions = sessions.slice(0, 30);

    try {
        localStorage.setItem(
            'learnforge_sessions',
            JSON.stringify(sessions)
        );
    } catch {}

    $('submitQuiz').disabled = true;

    document.querySelectorAll('#quizArea input')
        .forEach(input => input.disabled = true);

    active = null;
    renderStats();
}

$('clear').onclick = () => {
    sessions = [];

    try {
        localStorage.removeItem('learnforge_sessions');
    } catch {}

    renderStats();
};

renderStats();
