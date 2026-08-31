# Fabric Explorer

Fabric Explorer is an interactive DP-600 learning environment built around **guided, realistic Microsoft Fabric scenarios**. The learner follows Aurora Outfitters through real analytical problems, watches difficult concepts work visually, completes scaffolded assignments, and then applies the same ideas in explicit DP-600 exam practice.

Free exploration remains available throughout. The goal is to combine the clarity of a guided field trip with the freedom of an interactive systems lab.

It is not affiliated with Microsoft, a replacement for official documentation, an exam dump, a giant question bank, or a conventional learning-management system.

## Learning modes

### Guided Field Trips

The default learning path for a beginner. Each trip starts with a realistic Aurora Outfitters requirement and moves through:

**orientation → worked example → guided assignment → independent variation → debrief → exam lens**

The learner can leave a field trip to explore any system freely and return to the same point later.

### Foundation Bridge

Concise prerequisite support for learners who are new to Power BI, data modeling, or analytics concepts. Foundations include tables and keys, joins and relationships, fact/dimension/grain, transformation versus querying versus calculation, semantic models, refresh/query paths, and the basic relationship between Power BI and Microsoft Fabric.

These foundations support the DP-600 material; they are not presented as an additional exam domain.

### Explore Freely

The original interactive Fabric Explorer experience. Select objects, trace data and query paths, change configurations, break models deliberately, compare architectures, and inspect why the system behaves differently.

### Exam Prep

Explicit certification transfer after concepts have been taught. Exam Prep can include scenario-based questions, case files, ordering or classification tasks, short timed sets, objective-focused review, and direct remediation links back into the relevant interactive lab.

An optional **Exam Sprint** can use an entered exam date, current DP-600 domain weighting, prior learning evidence, and review timing to recommend a small daily study queue. It does not estimate a probability of passing.

## Current build

The current product already establishes much of the visual language and Fabric simulation layer:

- responsive application shell and inspector
- a selectable Fabric Atlas built around Aurora Outfitters
- learner-controlled data-flow and query-path traces
- a Data Store Lab where workload requirements shift Lakehouse, Warehouse, and Eventhouse fit
- a Direct Lake Engine Room for column loading, framing, and SQL-endpoint fallback behavior
- an Exam Map connecting the current official objective areas to built and planned experiences
- a reversible Transformation Workbench where operation order changes visible table results
- a Query Rosetta comparing visual queries, T-SQL, KQL, and DAX by execution layer and purpose
- an SCD Time Machine showing overwrite versus surrogate-key versioning across historical facts
- a Schema and Relationship experience for grain, star schemas, filter propagation, and many-to-many patterns
- a Storage Mode Lab where Import, DirectQuery, Dual, and Direct Lake reroute the same report request
- an Incremental Refresh Time Machine exposing rolling windows, partition processing, and late-arriving changes
- a Security Lens separating workspace, item, semantic-model, row, column, object, and OneLake controls
- a deterministic Performance Lab connecting model, DAX, relationship, and visual changes to simulated engine work
- a Field Parameter Explorer that swaps report dimensions and explicit measures without replacing the visual
- a Calculation Group Lab collapsing repeated time-intelligence measures into reusable calculation items
- a Composite Model Lab exposing cache, DirectQuery, Dual, and limited cross-source relationships
- central concept, exam, and documentation registries
- local exploration persistence
- deterministic trace tests

## Current instructional priority

The visual sandbox is substantially built. The next priority is **not simply to add more labs**.

The project should now retrofit the existing experiences with:

- beginner orientation and prerequisite links
- a Foundation Bridge
- realistic recurring Aurora workplace situations
- worked examples
- guided assignments
- independent variations
- debriefs and general rules
- “what this looks like at work” and real-product orientation
- explicit Exam Lens connections
- contextual retrieval and reinforcement
- a dedicated Exam Prep mode and optional Exam Sprint

The core product principle remains visual cause-and-effect, but the default experience should feel less like being dropped into a sandbox and more like taking a technical field trip with a knowledgeable guide.

## Pedagogical principle

A strong concept experience should eventually let the learner say:

1. **I know what problem this solves.**
2. **I can see why it behaves that way.**
3. **I recognize what this looks like in real work.**
4. **I can apply it when the scenario changes.**

Questions are not the primary teaching interface, but retrieval and exam-style assessment are legitimate after the concept has been taught.

## Development

Requires Node.js 22.13 or later.

```sh
npm install
npm run dev
```

Quality checks:

```sh
npm run typecheck
npm test
npm run lint
npm run build
```

## Content model

Technical concepts live in `content/concepts.ts`, the exam blueprint metadata in `content/exam.ts`, and documentation provenance in `content/sources.ts`. Simulation rules belong in `engine/` so they can be tested independently of presentation.

As the guided-learning layer is implemented, keep journeys, foundation concepts, assignments, exam-lens metadata, and reinforcement evidence content-driven rather than hard-coded into page components.
