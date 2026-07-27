# Critique (React Native)

Resolve one stable target, run UX assessment, synthesize a design critique, persist, and ask the user what to improve next.

## Hard Invariants

- Assessment A (design review) is required.
- Assessment A must run as an isolated sub-agent whenever a sub-agent/Task tool is exposed.
- If no sub-agent is available, the report's first line MUST be a banner: `⚠️ DEGRADED: single-context`.
- No CSS detector is available for RN. Assessment B (detector) is replaced with a manual RN component audit.

## Setup

1. **Resolve the target** to a concrete file path (screen component, component file, or route).
2. **Read `.impeccable/critique/ignore.md`** if it exists. Drop matching findings silently.

## Assessment: Design Review

Read relevant source files. Think like a design director.

Evaluate:
- **AI slop**: Would someone believe "AI made this" immediately? Check all DON'T guidance from the parent skill.
- **Holistic design**: hierarchy, IA, emotional fit, composition, typography, color, accessibility, states, copy.
- **Cognitive load**: ≤4 items per decision point, ≤4 visible options, progressive disclosure.
- **Emotional journey**: peak-end rule, reassurance at high-stakes moments.
- **Nielsen heuristics**: score all 10 heuristics 0-4.

Return: AI slop verdict, heuristic scores, cognitive load assessment, 2-3 strengths, 3-5 priority issues, persona red flags, minor observations.

### RN-Specific Audit (replaces CSS detector)

Check these manually:

- **Safe areas**: uses SafeAreaView or useSafeAreaInsets? No hardcoded padding.
- **Touch targets**: all interactive elements ≥ 44×44pt.
- **ScrollView vs FlashList**: dynamic lists use FlashList. No ScrollView.map() for >5 items.
- **Images**: uses expo-image (not RN Image). Has blurhash placeholder.
- **Fonts**: loaded via expo-font. Static text uses system fonts.
- **Animations**: Reanimated, not LayoutAnimation. Reduced motion handled.
- **Shadows**: both iOS shadow props AND Android elevation.
- **Dark mode**: tokens defined for dark palette. useColorScheme detected.
- **Platform**: Platform.select used where behavior differs.
- **Keyboard**: KeyboardAvoidingView on form screens.
- **Pressable**: scale animation on touch, not bare TouchableOpacity.
- **i18n**: text wrapped for translation? Date/currency formatted with Intl?

## Generate Critique Report

Synthesize into a single report. Structure:

### Report header provenance
- Normal: `Method: sub-agent`
- Degraded: `⚠️ DEGRADED: single-context`

### Design Health Score
Nielsen's 10 heuristics table (0-4 each). Total /40.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | ? | [specific finding or n/a] |
| 2 | Match System / Real World | ? | |
| 3 | User Control and Freedom | ? | |
| 4 | Consistency and Standards | ? | |
| 5 | Error Prevention | ? | |
| 6 | Recognition Rather Than Recall | ? | |
| 7 | Flexibility and Efficiency | ? | |
| 8 | Aesthetic and Minimalist Design | ? | |
| 9 | Error Recovery | ? | |
| 10 | Help and Documentation | ? | |
| **Total** | | **??/40** | **[Rating band]** |

### Anti-Patterns Verdict
Does this look AI-generated? Cover AI slop tells, RN-specific tells (no reanimated, no tokens, no safe areas, etc.).

### Overall Impression
Gut reaction: what works, what doesn't, single biggest opportunity.

### What's Working
2-3 specific things done well.

### Priority Issues
3-5 most impactful problems, ordered. Each tagged P0-P3:
- **[P?] What**: Name the problem
- **Why it matters**: How this hurts users
- **Fix**: Concrete suggestion
- **Suggested command**: Which `/impeccable-rn` command addresses it

### Persona Red Flags
Select 2-3 personas from the standard set (Power User Alex, First-Timer Jordan, Accessibility Sam, Stress Tester Riley, Mobile Casey). Walk through the primary action. Report specific failures.

### Minor Observations
Quick notes on smaller issues.

### Questions to Consider
Provocative questions that might unlock better solutions.

## Persist Snapshot

Write the report to `.impeccable/critique/<slug>.md` for future reference. Use the slug from the setup step.

## Ask the User

After presenting findings, use targeted questions based on what was found:
1. **Priority direction**: which category matters most?
2. **Design intent**: is the current tonal direction intentional?
3. **Scope**: top 3 issues or all?

## Recommended Actions

List commands in priority order. End with `/impeccable-rn polish` as final step.

> You can ask me to run these one at a time, all at once, or in any order. Re-run `/impeccable-rn critique` after fixes to see your score improve.
