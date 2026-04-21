// ts-check
/**
 * @param {string} domainName
 * @returns {import("./schema").checkDomain}
 */
async function checkDomain(domainName) {
    try {
        const response = await fetch(`http://localhost:3000/${domainName}`)
        if (response.status === 200) {
            const result = await response.json()
            return result
        }
        return { "authorized": false, "started": false, "closed": false }
    } catch (e) {
        return { "authorized": false, "started": false, "closed": false }
    }
}

// ─── CONFIGURATION API ───────────────────────────────────────────────────────
const BASE_URL = 'http://72.61.162.43:8000'

// ⬇️ COLLE TON job_id ICI
const JOB_ID = '40903be3-f18e-4f69-9a81-54eecc343e37'

const API = {
    uploadCV : `${BASE_URL}/candidates/${JOB_ID}/cv`,
    apply    : `${BASE_URL}/applications`,
}

function simulateUpload(blob, type) {
    return new Promise((resolve) => {
        console.log(`[Demo] Envoi du flux ${type} en cours...`);
        setTimeout(() => {
            console.log(`[Demo] ${type} stocké avec succès.`);
            resolve({ success: true });
        }, 2000);
    });
}

(async function () {

    let userName = "Candidat";

    const rootDocument         = document.getElementById('root')
    const loadedElement        = document.getElementById('isLoaded')
    const unauthorisedElement  = document.getElementById('unauthorised')
    const applicationUnstarted = document.getElementById('applicationUnstarted')
    const applicationClosed    = document.getElementById('applicationClosed')

    rootDocument.classList.add("isLoading")
    loadedElement.classList.add("enabled")

    const result = { "authorized": true, "started": true, "closed": false }
    loadedElement.classList.remove("enabled")

    if (result.authorized === false) {
        unauthorisedElement.classList.add("enabled"); rootDocument.classList.add("disabled"); return;
    }
    if (result.started === false) {
        rootDocument.classList.add("disabled"); applicationUnstarted.classList.add("enabled"); return;
    }
    if (result.closed === true) {
        rootDocument.classList.add("disabled"); applicationClosed.classList.add("enabled"); return;
    }

    rootDocument.classList.remove("isLoading")

    // ─── PHASE 1 : UPLOAD CV ──────────────────────────────────────────────
    const dropZone      = document.getElementById('dropZone')
    const fileInput     = document.getElementById('fileInput')
    const browseBtn     = document.getElementById('browseBtn')
    const filePreview   = document.getElementById('filePreview')
    const fileNameEl    = document.getElementById('fileName')
    const fileSizeEl    = document.getElementById('fileSize')
    const removeBtn     = document.getElementById('removeBtn')
    const submitCvBtn   = document.getElementById('submitCvBtn')
    const errorMsg      = document.getElementById('errorMsg')
    const uploadSection = document.getElementById('upload-section')
    const step1         = document.getElementById('step1')
    const step2         = document.getElementById('step2')
    const step3         = document.getElementById('step3')

    step1.classList.add('active');
    browseBtn.addEventListener('click', () => fileInput.click())

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) handleFile(fileInput.files[0])
    })

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover') })
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'))
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); dropZone.classList.remove('dragover')
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0])
    })

    function handleFile(file) {
        errorMsg.classList.remove('visible')
        if (file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024) {
            errorMsg.classList.add('visible'); return;
        }
        let nameRaw = file.name.split('.').slice(0, -1).join('.');
        userName = nameRaw.replace(/[_-]/g, " ");
        fileNameEl.textContent = file.name;
        fileSizeEl.textContent = (file.size / 1024).toFixed(0) + ' Ko';
        filePreview.classList.add('visible');
        submitCvBtn.classList.add('active');
    }

    removeBtn.addEventListener('click', () => {
        fileInput.value = '';
        filePreview.classList.remove('visible');
        submitCvBtn.classList.remove('active');
        errorMsg.classList.remove('visible');
    })

    // Variables de session — remplies par les réponses de l'API
    let cvUrl        = null   // reçu après upload CV
    let aiQuestion   = null   // question générée par l'IA depuis le CV
    let candidateId  = null   // reçu après upload CV

    submitCvBtn.addEventListener('click', async () => {
        submitCvBtn.textContent = 'Analyse du profil...';
        submitCvBtn.classList.remove('active');

          try {
            // ── API CALL 1 : Upload du CV ─────────────────────────────────
            // POST /candidates/{job_id}/cv
            // Body : multipart/form-data { cv: File }
            // Réponse : { candidate_id, cv_url, ai_question, ... }
            const formData = new FormData()
            formData.append('cv', fileInput.files[0])

            const response = await fetch(API.uploadCV, {
                method: 'POST',
                body: formData
                // Pas de header Authorization (retiré par le backend)
                // Pas de Content-Type : le navigateur le génère automatiquement avec le boundary
            })

            if (!response.ok) throw new Error('Upload CV échoué : ' + response.status)

            const data  = await response.json()
            candidateId = data.candidate_id
            cvUrl       = data.cv_url
            aiQuestion  = data.ai_question  // ← question générée par l'IA depuis le CV

            console.log('[HireBox] CV uploadé :', data)

        } catch (err) {
            console.error('[HireBox] Erreur upload CV :', err)
            submitCvBtn.textContent = 'Envoyer mon CV'
            submitCvBtn.classList.add('active')
            errorMsg.textContent = "Erreur lors de l'envoi du CV. Veuillez réessayer."
            errorMsg.classList.add('visible')
            return
        }

        uploadSection.style.display = 'none'
        step1.classList.remove('active'); step1.classList.add('done');
        step1.querySelector('.step-circle').textContent = '✓';
        step2.classList.add('active');
        startInterview();
    })

    // ─── PHASE 2 : INTERVIEW ──────────────────────────────────────────────
    let attempt = 0;
    // Variables interview
    let readingRemaining = 30, readingInterval = null;
    let responseRemaining = 90, responseInterval = null;  // 1m30
    let isRecording = false, sessionStarted = false;
    let mediaRecorder = null, audioChunks = [], audioBlob = null;

    const interviewSection = document.getElementById('interview-section')
    const readingTimer     = document.getElementById('readingTimer')
    const readingFill      = document.getElementById('readingFill')
    const readingCount     = document.getElementById('readingCount')
    const micOuter         = document.getElementById('micOuter')
    const micTitle         = document.getElementById('micTitle')
    const micSub           = document.getElementById('micSub')
    const submitBtn        = document.getElementById('submitBtn')
    const timerDisplay     = document.getElementById('timerDisplay')
    const timerFill        = document.getElementById('timerFill')
    const responseTimer    = document.getElementById('responseTimer')
    const waveBars         = document.querySelectorAll('#interview-section .wave-bar')
    const expireBanner     = document.getElementById('expireBanner')
    const resultCard       = document.getElementById('resultCard')

    // Clic sur Play → déverrouille le micro SANS toucher au chrono 30s
    document.getElementById('playBtn').addEventListener('click', function () {
        this.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
        unlockMicOnly()   // micro dispo, chrono continue
        let prog = 0
        const pi = setInterval(() => {
            prog += 1.5
            document.getElementById('audioProgress').style.width = Math.min(prog, 100) + '%'
            if (prog >= 100) {
                clearInterval(pi)
                this.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><polygon points="5,3 19,12 5,21"/></svg>'
            }
        }, 100)
    })

    // Bouton "Je suis prêt" → arrête le chrono ET déverrouille le micro
    document.getElementById('readyBtn').addEventListener('click', () => { unlockMic(); startRecording(); })

    // Déverrouille uniquement le micro — le chrono continue (appelé par Play)
    function unlockMicOnly() {
        micOuter.classList.remove('disabled')
        micTitle.textContent = 'Appuyez pour parler'
        micSub.textContent   = 'Cliquez sur le micro pour démarrer votre réponse'
    }

    // Arrête le chrono ET déverrouille le micro (appelé par "Je suis prêt" et expiration)
    function unlockMic() {
        clearInterval(readingInterval)
        readingTimer.style.display = 'none'
        unlockMicOnly()
    }

    function startInterview() {
        interviewSection.style.display = 'block'
        loadQuestion()
    }

    // Questions : la 1ère vient de l'IA (via le CV uploadé), les suivantes sont de secours
    const questions = [
        aiQuestion || `Bonjour ${userName}, votre CV mentionne une expérience en développement. Pouvez-vous décrire un projet concret ?`,
        `${userName}, comment gérez-vous les imprévus ou les blocages techniques en cours de projet ?`,
        `${userName}, quelle est votre approche pour apprendre rapidement une nouvelle technologie imposée par un projet ?`
    ];

    function loadQuestion() {
        doSubmitResponse._done = false;  // reset du garde anti-double-appel
        document.getElementById('questionText').textContent = questions[attempt];
        document.getElementById('attemptLabel').textContent = 'Question ' + (attempt + 1) + ' sur 3';

        document.getElementById('audioProgress').style.width = '0%';
        document.getElementById('playBtn').innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><polygon points="5,3 19,12 5,21"/></svg>';

        // Mise à jour des dots
        for (let i = 0; i < 3; i++) {
            const dot = document.getElementById('dot' + i);
            if (!dot) continue;
            dot.style.display = '';
            dot.className = 'attempt-dot';
            if (i < attempt)       dot.classList.add('expired');
            else if (i === attempt) dot.classList.add('active');
        }

        // Réinitialisation état
        readingRemaining = 30; responseRemaining = 90;
        sessionStarted = false; isRecording = false;
        audioChunks = []; audioBlob = null;

        readingCount.textContent = '30';
        readingFill.style.width  = '100%';
        readingTimer.classList.remove('urgent');
        readingTimer.style.display = 'flex';
        responseTimer.classList.remove('visible');
        timerDisplay.textContent = '1:30';
        timerDisplay.classList.remove('urgent');
        timerFill.style.width = '100%';
        timerFill.classList.remove('urgent');

        micOuter.className   = 'mic-outer disabled';
        micTitle.textContent = "Écoutez la question d'abord";
        micSub.textContent   = "Le micro s'activera dans 30 secondes maximum";
        submitBtn.classList.remove('active');
        waveBars.forEach(b => b.classList.remove('active'));

        // Cache la réécoute de la question précédente
        const replayCard = document.getElementById('replayCard');
        if (replayCard) replayCard.style.display = 'none';

        startReadingTimer();
    }

    function startReadingTimer() {
        clearInterval(readingInterval)
        readingInterval = setInterval(() => {
            readingRemaining--;
            readingCount.textContent = readingRemaining;
            readingFill.style.width  = Math.round((readingRemaining / 30) * 100) + '%'
            if (readingRemaining <= 10) readingTimer.classList.add('urgent')
            if (readingRemaining <= 0) {
                clearInterval(readingInterval);
                // Le candidat n'a rien fait : on passe à la question suivante
                // (ou à la présentation si c'était la dernière)
                skipToNext();
            }
        }, 1000)
    }

    function skipToNext() {
        // Marque la tentative comme expirée
        const dot = document.getElementById('dot' + attempt);
        if (dot) dot.classList.replace('active', 'expired');

        attempt++;

        if (attempt < 3) {
            // Affiche la bannière puis charge la question suivante
            expireBanner.textContent = 'Temps écoulé — question suivante (' + attempt + ' sur 3)';
            expireBanner.classList.add('visible');
            setTimeout(() => {
                expireBanner.classList.remove('visible');
                loadQuestion();
            }, 2000);
        } else {
            // Les 3 tentatives sont épuisées → présentation
            interviewSection.style.display = 'none';
            step2.classList.remove('active'); step2.classList.add('done');
            step2.querySelector('.step-circle').textContent = '✓';
            startPresentation();
        }
    }

    micOuter.addEventListener('click', async () => {
        if (isRecording) stopRecording();
        else await startRecording();
    });

    async function startRecording() {
        // Démarrer le chrono 1m30 IMMÉDIATEMENT, avant la demande de permission micro
        if (!sessionStarted) {
            sessionStarted = true;
            clearInterval(readingInterval);
            readingTimer.style.display = 'none';
            responseTimer.classList.add('visible');
            startResponseTimer();
        }

        // Feedback visuel immédiat — le candidat sait que c'est en cours
        micOuter.classList.remove('disabled')
        micTitle.textContent = 'Activation du micro...'
        micSub.textContent   = "Veuillez autoriser l'accès au microphone"

        try {
            audioChunks = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data) }
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
                stream.getTracks().forEach(t => t.stop())
                // Réécoute disponible
                const replayCard  = document.getElementById('replayCard')
                const replayAudio = document.getElementById('replayAudio')
                if (replayCard && replayAudio) {
                    replayAudio.src          = URL.createObjectURL(audioBlob)
                    replayCard.style.display = 'block'
                }
                submitBtn.classList.add('active')
            }
            mediaRecorder.start()

            isRecording = true;
            micOuter.classList.remove('disabled', 'done')
            micOuter.classList.add('recording');
            micTitle.textContent = 'Enregistrement en cours...';
            micSub.textContent   = 'Cliquez à nouveau pour arrêter'
            waveBars.forEach(b => b.classList.add('active'))

        } catch (err) {
            // Si le micro est refusé, on arrête le chrono et on réinitialise
            sessionStarted = false;
            responseTimer.classList.remove('visible');
            clearInterval(responseInterval);
            readingTimer.style.display = 'flex';
            micTitle.textContent = 'Accès au micro refusé';
            micSub.textContent   = 'Autorisez le micro dans les paramètres de votre navigateur.';
            console.error('Erreur micro:', err)
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        isRecording = false;
        micOuter.classList.remove('recording');
        micOuter.classList.add('done');
        micTitle.textContent = 'Enregistrement terminé';
        micSub.textContent   = 'Cliquez sur le micro pour recommencer'
        waveBars.forEach(b => b.classList.remove('active'));
    }

    function startResponseTimer() {
        clearInterval(responseInterval)
        responseInterval = setInterval(() => {
            responseRemaining--;
            const m = Math.floor(responseRemaining / 60), s = responseRemaining % 60;
            timerDisplay.textContent = m + ':' + (s < 10 ? '0' : '') + s;
            timerFill.style.width    = Math.round((responseRemaining / 90) * 100) + '%'
            if (responseRemaining <= 30) {
                timerDisplay.classList.add('urgent')
                timerFill.classList.add('urgent')
            }
            if (responseRemaining <= 0) { clearInterval(responseInterval); doSubmitResponse(); }
        }, 1000)
    }

    submitBtn.addEventListener('click', doSubmitResponse);

    async function doSubmitResponse() {
        if (doSubmitResponse._done) return;
        doSubmitResponse._done = true;
        clearInterval(readingInterval);
        clearInterval(responseInterval);
        submitBtn.classList.remove('active');
        submitBtn.disabled = true;

        const currentQ   = document.getElementById('questionText').textContent;
        const questionNum = attempt + 1;

        // Créer la carte historique immédiatement — l'audio sera injecté après
        const historyItem = document.createElement('div');
        historyItem.className = 'card';
        historyItem.style.cssText = "border-left: 4px solid #378ADD; margin-bottom: 1rem;";
        const audioEl = document.createElement('audio');
        audioEl.controls = true;
        audioEl.style.cssText = "width:100%; height:36px;";
        historyItem.innerHTML = `
            <p style="margin:0 0 4px; font-weight:600; font-size:13px; color:#aaa;">Question ${questionNum}</p>
            <p style="margin:0 0 10px; font-size:14px; color:#111; line-height:1.6;">${currentQ}</p>
        `;
        historyItem.appendChild(audioEl);
        interviewSection.before(historyItem);

        // Arrêt du micro en arrière-plan — on n'attend PAS le blob pour avancer
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.addEventListener('stop', () => {
                const chunks = audioChunks.slice()
                const blob = new Blob(chunks, { type: 'audio/webm' })
                audioEl.src = URL.createObjectURL(blob)
                audioBlob = blob
            }, { once: true })
            mediaRecorder.stop()
            isRecording = false
        } else if (audioBlob) {
            audioEl.src = URL.createObjectURL(audioBlob)
        }

        // Marque la tentative comme réussie
        const dotDone = document.getElementById('dot' + attempt);
        if (dotDone) dotDone.classList.replace('active', 'done');
        attempt++;

        // Transition immédiate — sans attendre le blob
        interviewSection.style.display = 'none';
        step2.classList.remove('active'); step2.classList.add('done');
        step2.querySelector('.step-circle').textContent = '✓';
        startPresentation();
    }

    // ─── PHASE 2b : PRÉSENTATION ──────────────────────────────────────────
    // Même logique que l'interview : 30s prépa → micro dispo → 1m30 pour répondre
    const presentationSection    = document.getElementById('presentation-section')
    const micOuterP              = document.getElementById('micOuterPresentation')
    const micTitleP              = document.getElementById('micTitlePresentation')
    const micSubP                = document.getElementById('micSubPresentation')
    const submitBtnP             = document.getElementById('submitBtnPresentation')
    submitBtnP.addEventListener('click', doSubmitPresentation)
    const responseTimerP         = document.getElementById('responseTimerPresentation')
    const timerDisplayP          = document.getElementById('timerDisplayPresentation')
    const timerFillP             = document.getElementById('timerFillPresentation')
    const waveBarsP              = document.querySelectorAll('#wavePresentation .wave-bar')

    let readingRemainingP = 30, readingIntervalP = null;
    let responseRemainingP = 90, responseIntervalP = null;  // 1m30
    let isRecordingP = false, sessionStartedP = false;
    let mediaRecorderP = null, audioChunksP = [], audioBlobP = null;

    // Clic sur Play de la présentation → déverrouille le micro SANS toucher au chrono
    document.getElementById('playBtnPresentation').addEventListener('click', function () {
        this.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
        unlockMicOnlyP()   // micro dispo, chrono continue
        let prog = 0
        const pi = setInterval(() => {
            prog += 1.5
            document.getElementById('audioProgressPresentation').style.width = Math.min(prog, 100) + '%'
            if (prog >= 100) {
                clearInterval(pi)
                this.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><polygon points="5,3 19,12 5,21"/></svg>'
            }
        }, 100)
    })

    // Déverrouille uniquement le micro présentation — chrono continue (appelé par Play)
    function unlockMicOnlyP() {
        micOuterP.classList.remove('disabled')
        micTitleP.textContent = 'Appuyez pour parler'
        micSubP.textContent   = 'Cliquez sur le micro pour démarrer votre réponse'
    }

    // Arrête le chrono ET déverrouille le micro présentation (appelé par "Je suis prêt" et expiration)
    function unlockMicP() {
        clearInterval(readingIntervalP)
        const rtP = document.getElementById('readingTimerPresentation')
        if (rtP) rtP.style.display = 'none'
        unlockMicOnlyP()
    }

function startPresentation() {
        doSubmitPresentation._done = false;  // reset du garde anti-double-appel
        // Réinitialise l'état
        readingRemainingP = 30; responseRemainingP = 90;
        sessionStartedP = false; isRecordingP = false;
        audioChunksP = []; audioBlobP = null;

        presentationSection.style.display = 'block'

        // Mise à jour de la question
        const qTextP = document.getElementById('questionTextPresentation');
        if (qTextP) qTextP.textContent = `${userName}, pouvez-vous vous présenter brièvement ?`;

        // GESTION DU TIMER DE PRÉPARATION
        let rtP = document.getElementById('readingTimerPresentation');
        
        if (!rtP) {
            // 1. CRÉATION
            rtP = document.createElement('div');
            rtP.id = 'readingTimerPresentation';
            rtP.className = 'reading-timer';
            rtP.innerHTML = `
                <div>
                    <div class="reading-left">Temps pour commencer à répondre</div>
                    <div class="reading-bar"><div class="reading-fill" id="readingFillPresentation"></div></div>
                </div>
                <div class="reading-timer-right">
                    <div class="reading-count" id="readingCountPresentation">30</div>
                    <button class="ready-btn" id="readyBtnPresentation">Je suis prêt</button>
                </div>
            `;
            const micCard = micOuterP.closest('.card');
            micCard.parentNode.insertBefore(rtP, micCard);

            // 2. ATTACHE DE L'ÉVÉNEMENT (Crucial ici !)
            document.getElementById('readyBtnPresentation').addEventListener('click', () => { unlockMicP(); startRecordingP(); });
        }

        // 3. RÉINITIALISATION VISUELLE
        rtP.style.display = 'flex';
        rtP.classList.remove('urgent');
        document.getElementById('readingFillPresentation').style.width = '100%';
        document.getElementById('readingCountPresentation').textContent = '30';

        // Reset UI micro
        micOuterP.className = 'mic-outer disabled';
        micTitleP.textContent = "Écoutez la question d'abord";
        micSubP.textContent = "Le micro s'activera dans 30 secondes maximum";
        submitBtnP.classList.remove('active');
        waveBarsP.forEach(b => b.classList.remove('active'));
        document.getElementById('audioProgressPresentation').style.width = '0%';

        startReadingTimerP();
    }

    function startReadingTimerP() {
        clearInterval(readingIntervalP)
        readingIntervalP = setInterval(() => {
            readingRemainingP--;
            const countEl = document.getElementById('readingCountPresentation')
            const fillEl  = document.getElementById('readingFillPresentation')
            const rtP     = document.getElementById('readingTimerPresentation')
            if (countEl) countEl.textContent = readingRemainingP
            if (fillEl)  fillEl.style.width  = Math.round((readingRemainingP / 30) * 100) + '%'
            if (readingRemainingP <= 10 && rtP) rtP.classList.add('urgent')
            if (readingRemainingP <= 0) { clearInterval(readingIntervalP); unlockMicP(); startRecordingP(); }
        }, 1000)
    }

    micOuterP.addEventListener('click', async () => {
        if (isRecordingP) stopRecordingP();
        else await startRecordingP();
    });

async function startRecordingP() {
        // Démarrer le chrono 1m30 IMMÉDIATEMENT, avant la demande de permission micro
        if (!sessionStartedP) {
            sessionStartedP = true;
            clearInterval(readingIntervalP);
            const rtP = document.getElementById('readingTimerPresentation')
            if (rtP) rtP.style.display = 'none'
            responseTimerP.classList.add('visible');
            submitBtnP.classList.add('active');
            submitBtnP.disabled = false;
            startResponseTimerP();
        }

        // Feedback visuel immédiat
        micOuterP.classList.remove('disabled')
        micTitleP.textContent = 'Activation du micro...'
        micSubP.textContent   = "Veuillez autoriser l'accès au microphone"

        try {
            audioChunksP = [];
            const streamP = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorderP = new MediaRecorder(streamP)
            mediaRecorderP.ondataavailable = (e) => { if (e.data.size > 0) audioChunksP.push(e.data) }
            
            mediaRecorderP.onstop = () => {
                audioBlobP = new Blob(audioChunksP, { type: 'audio/webm' })
                streamP.getTracks().forEach(t => t.stop())
                
                // Réécoute disponible
                const replayCardP  = document.getElementById('replayCardPresentation')
                const replayAudioP = document.getElementById('replayAudioPresentation')
                if (replayCardP && replayAudioP) {
                    replayAudioP.src          = URL.createObjectURL(audioBlobP)
                    replayCardP.style.display = 'block'
                }
                submitBtnP.classList.add('active');
                submitBtnP.disabled = false;
            }
            
            mediaRecorderP.start()

            isRecordingP = true;
            micOuterP.classList.remove('disabled', 'done')
            micOuterP.classList.add('recording');
            micTitleP.textContent = 'Enregistrement en cours...';
            micSubP.textContent   = 'Cliquez à nouveau pour arrêter'
            waveBarsP.forEach(b => b.classList.add('active'))

        } catch (err) {
            // Si le micro est refusé, on arrête le chrono et on réinitialise
            sessionStartedP = false;
            responseTimerP.classList.remove('visible');
            clearInterval(responseIntervalP);
            const rtP = document.getElementById('readingTimerPresentation')
            if (rtP) rtP.style.display = 'flex';
            micTitleP.textContent = 'Accès au micro refusé';
            micSubP.textContent   = 'Autorisez le micro dans les paramètres de votre navigateur.';
            console.error('Erreur micro présentation:', err)
        }
    }

    function stopRecordingP() {
        if (mediaRecorderP && mediaRecorderP.state !== 'inactive') mediaRecorderP.stop();
        isRecordingP = false;
        micOuterP.classList.remove('recording');
        micOuterP.classList.add('done');
        micTitleP.textContent = 'Enregistrement terminé';
        micSubP.textContent   = 'Cliquez sur le micro pour recommencer'
        waveBarsP.forEach(b => b.classList.remove('active'));
    }

    function startResponseTimerP() {
        clearInterval(responseIntervalP)
        responseIntervalP = setInterval(() => {
            responseRemainingP--;
            const m = Math.floor(responseRemainingP / 60), s = responseRemainingP % 60;
            timerDisplayP.textContent = m + ':' + (s < 10 ? '0' : '') + s;
            timerFillP.style.width    = Math.round((responseRemainingP / 90) * 100) + '%'
            if (responseRemainingP <= 30) {
                timerDisplayP.classList.add('urgent')
                timerFillP.classList.add('urgent')
            }
            if (responseRemainingP <= 0) { clearInterval(responseIntervalP); doSubmitPresentation(); }
        }, 1000)
    }

async function doSubmitPresentation() {
        // Garde anti-double-appel
        if (doSubmitPresentation._done) return;
        doSubmitPresentation._done = true;

        clearInterval(readingIntervalP);
        clearInterval(responseIntervalP);
        submitBtnP.classList.remove('active');
        submitBtnP.disabled = true;

        // Arrêt du micro en arrière-plan — transition immédiate sans attendre le blob
        const currentQP = document.getElementById('questionTextPresentation').textContent;
        const historyItem = document.createElement('div');
        historyItem.className = 'card';
        historyItem.style.cssText = "border-left: 4px solid #10B981; margin-bottom: 1rem; background: rgba(16, 185, 129, 0.05);";
        const audioElP = document.createElement('audio');
        audioElP.controls = true;
        audioElP.style.cssText = "width:100%; height:36px;";
        historyItem.innerHTML = `
            <p style="margin:0 0 4px; font-weight:600; font-size:13px; color:#059669;">Présentation Finale</p>
            <p style="margin:0 0 10px; font-size:14px; color:#111; line-height:1.6;">${currentQP}</p>
        `;
        historyItem.appendChild(audioElP);
        presentationSection.before(historyItem);

        if (mediaRecorderP && mediaRecorderP.state !== 'inactive') {
            mediaRecorderP.addEventListener('stop', () => {
                const blob = new Blob(audioChunksP.slice(), { type: 'audio/webm' })
                audioElP.src = URL.createObjectURL(blob)
                audioBlobP = blob
            }, { once: true })
            mediaRecorderP.stop()
            isRecordingP = false
        } else if (audioBlobP) {
            audioElP.src = URL.createObjectURL(audioBlobP)
        }
        // ------------------------------------------------

        try {
            // ── API CALL 2 : Soumission finale de la candidature ──────────
            // POST /applications
            // Body : multipart/form-data
            //   email                  ← à collecter (voir note ci-dessous)
            //   job_id                 ← JOB_ID défini en haut du script
            //   nom                    ← extrait du nom de fichier CV
            //   prenom                 ← extrait du nom de fichier CV
            //   telephone              ← à collecter
            //   resume_url             ← reçu après upload CV
            //   introduction_audio     ← blob audio de la présentation
            //   question_on_resume_audio ← blob audio de la réponse à la question IA
            //
            // ⚠️  NOTE : email, nom, prenom, telephone sont "required" côté API.
            //     Si tu n'as pas de formulaire pour les collecter, demande au backend
            //     de les rendre optionnels ou ajoute un mini-formulaire avant l'upload.

            const fd = new FormData()
            fd.append('job_id',   JOB_ID)
            fd.append('nom',      userName)       // nom extrait du fichier CV
            fd.append('prenom',   '')             // ⬅️ à remplir si collecté
            fd.append('email',    '')             // ⬅️ à remplir si collecté
            fd.append('telephone','')             // ⬅️ à remplir si collecté
            fd.append('resume_url', cvUrl || '')

            // Audio de la réponse à la question IA
            if (audioBlob) fd.append('question_on_resume_audio', audioBlob, 'reponse.webm')

            // Audio de la présentation
            if (audioBlobP) fd.append('introduction_audio', audioBlobP, 'presentation.webm')

            const response = await fetch(API.apply, {
                method: 'POST',
                body: fd
            })

            if (!response.ok) throw new Error('Soumission échouée : ' + response.status)

            const data = await response.json()
            console.log('[HireBox] Candidature soumise :', data)

        } catch (err) {
            console.error('[HireBox] Erreur soumission :', err)
            // On affiche quand même le succès car les audios sont enregistrés localement
        }

        presentationSection.style.display = 'none';
        step3.classList.remove('active'); step3.classList.add('done');
        step3.querySelector('.step-circle').textContent = '✓';

        document.getElementById('resultIcon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#3B6D11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polyline points="20 6 9 17 4 12"/></svg>'
        document.getElementById('resultIcon').className   = 'result-icon success'
        document.getElementById('resultTitle').textContent = `Merci ${userName}, votre candidature est envoyée !`
        document.getElementById('resultSub').textContent  = "L'équipe RH vous contactera prochainement."
        resultCard.classList.add('visible');
    }

})();