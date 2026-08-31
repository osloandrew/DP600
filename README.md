# Fabric Explorer

Fabric Explorer is an interactive learning environment for understanding Microsoft Fabric analytics and the current DP-600 exam scope. It teaches through explorable systems: select an object, manipulate a path, observe the consequence, and inspect why it happened.

It is not affiliated with Microsoft, a replacement for official documentation, an exam dump, a question bank, or a conventional learning-management system.

## Current build

The first product slice establishes the visual language and core architecture:

- responsive application shell and inspector
- a selectable Fabric Atlas built around Aurora Outfitters
- learner-controlled data-flow and query-path traces
- a Data Store Lab where workload requirements shift Lakehouse, Warehouse, and Eventhouse fit
- a Direct Lake Engine Room for column loading, framing, and SQL-endpoint fallback behavior
- an Exam Map connecting the current official objective areas to built and planned experiences
- a reversible Transformation Workbench where operation order changes visible table results
- a Query Rosetta comparing visual queries, T-SQL, KQL, and DAX by execution layer and purpose
- an SCD Time Machine showing overwrite versus surrogate-key versioning across historical facts
- a Storage Mode Lab where Import, DirectQuery, Dual, and Direct Lake reroute the same report request
- an Incremental Refresh Time Machine exposing rolling windows, partition processing, and late-arriving changes
- a Security Lens separating workspace, item, semantic-model, row, column, object, and OneLake controls
- a deterministic Performance Lab connecting model, DAX, relationship, and visual changes to simulated engine work
- central concept, exam, and documentation registries
- local exploration persistence
- deterministic trace tests

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
