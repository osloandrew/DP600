# Evidence base for the DP-600 adaptive quiz

**Audience:** Fabric Explorer maintainers  
**Date:** 7 September 2026  
**Scope:** Practice design for Microsoft role-based certification preparation, with cognitive-accessibility accommodations for an autistic learner who reports low domain confidence and susceptibility to overload.

## Executive answer

The quiz should teach through retrieval rather than imitate a secure exam. It should use concise job scenarios, four plausible and homogeneous alternatives, shuffled answer positions, immediate corrective explanations, mixed DP-600 objectives, later review of missed or learner-flagged items, and calm self-paced presentation. Adaptive difficulty is a practice-routing aid—not a pass prediction or diagnosis of ability.

## Evidence and resulting decisions

- Microsoft says its Practice Assessments demonstrate likely style, wording, and difficulty, provide an answer, rationale, and learning links for every question, and are not substitutes for training or experience. The quiz therefore provides immediate rationale and official-documentation links and avoids readiness claims. [Practice Assessments for Microsoft Certifications](https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications)
- Microsoft’s current DP-600 guide defines three weighted skill domains and expects practical SQL, KQL, DAX, security, lifecycle, data preparation, and semantic-model skills. Question metadata and selection should remain tied to that current outline. [DP-600 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-600)
- Microsoft’s exam sandbox includes multiple choice, case studies, build lists, drag-and-drop, hot areas, review marking, navigation, and a timer. This quiz adopts familiar A–D option labels and review marking but deliberately omits timer pressure in learning mode. [Exam duration and exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)
- Retrieval practice reliably improves learning across settings, and spacing plus retrieval have broad applied support. The quiz mixes objectives and offers an end-of-round review queue rather than relying on rereading. [Carpenter, Pan, and Butler, 2022](https://doi.org/10.1038/s44159-022-00089-1); [Agarwal et al., 2021](https://doi.org/10.1007/s10648-021-09595-9)
- Multiple-choice distractors can reinforce misinformation. Corrective feedback reduces that risk, so every response shows why the selected option fits or fails and makes the decisive clue available without crowding the first feedback view. [Butler and Roediger, 2008](https://pubmed.ncbi.nlm.nih.gov/18491500/)
- Item-writing guidance favors one identifiable objective and plausible, clearly wrong, non-overlapping alternatives. Four options are a project requirement; every item is validated to have exactly four. [University of Toronto MCQ guidelines](https://ofd.med.utoronto.ca/sites/default/files/assets/resource/document/guidelines-writing-mcqs-full-mar-20220.pdf)
- W3C guidance emphasizes readable language, predictable behavior, short critical paths, limited interruptions, and avoiding excess content for cognitive accessibility. The quiz therefore shows one question at a time, has no timer, keeps controls stable, uses optional detail disclosure, and lets the learner disable sounds. [W3C Accessibility Principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/); [W3C Help Users Focus](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/)

## Limitations

The question bank is small and its difficulty values are expert judgments rather than calibrated item-response parameters. The adaptive level must remain labeled as a practice level. The app does not reproduce Microsoft’s protected exam items and should continue linking to Microsoft’s official Practice Assessment and exam sandbox.
