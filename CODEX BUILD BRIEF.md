# CODEX BUILD BRIEF
# DP-600 Fabric Explorer

## 0. Read this before writing code

Build an interactive GitHub Pages web application for learning the material covered by Microsoft’s DP-600 certification exam.

This must **not** become a conventional certification-prep website.

Do not build:

- a quiz homepage
- flashcards
- a bank of multiple-choice questions
- a sequence of lessons followed by tests
- a prettier copy of Microsoft Learn
- a collection of static articles
- a dashboard covered in progress percentages
- a gamified streak/XP/achievement system
- a set of decorative diagrams where clicking merely opens text
- a Power BI or Microsoft Fabric clone

The product should instead function as an **interactive exploratory model of Microsoft Fabric analytics**.

The central learning loop is:

**See a system → manipulate something → observe the consequence → inspect why it happened → follow a connection into another concept.**

The user should gradually construct an interconnected mental model of Fabric rather than memorize isolated certification facts.

The closest metaphors are:

- interactive museum
- systems laboratory
- explorable explanation
- technical atlas
- simulation
- model inspector
- sandbox

The working product name can be **Fabric Explorer** or **DP-600 Explorer**. Keep naming easy to change.

Do not spend significant effort on branding yet.

---

# 1. Product objective

The application has one primary job:

> Make difficult DP-600 concepts understandable by turning their rules, architectures, dependencies, and tradeoffs into visible systems the learner can manipulate.

The application should be useful when the learner thinks:

- “I keep confusing lakehouse and warehouse.”
- “I know what Direct Lake is called, but I do not really understand what it does.”
- “I can read CALCULATE documentation, but filter context still feels abstract.”
- “Why is this many-to-many relationship dangerous?”
- “What actually changes when I use bidirectional filtering?”
- “Where does RLS operate?”
- “How do workspace permissions differ from semantic-model security?”
- “Why would this DAX expression be slow?”
- “What does incremental refresh actually partition?”
- “What happens when I deploy from Dev to Test?”
- “Which downstream objects are affected if I change this table?”
- “Why would I choose Eventhouse here?”
- “When am I querying with SQL versus KQL versus DAX?”
- “How do all these Fabric objects fit together?”

The ideal outcome is not simply that the user remembers an answer.

The ideal outcome is that the user can **predict what the system will do**.

---

# 2. Current DP-600 scope is the source of truth

As of this build, use the Microsoft DP-600 skills outline effective **July 21, 2026**.

Store this metadata centrally rather than hardcoding it into components:

```ts
exam = {
  code: "DP-600",
  blueprintEffectiveDate: "2026-07-21",
  verifiedDate: "2026-08-31",
  domains: [
    {
      id: "maintain",
      title: "Maintain a data analytics solution",
      weight: "25–30%"
    },
    {
      id: "prepare",
      title: "Prepare data",
      weight: "45–50%"
    },
    {
      id: "models",
      title: "Implement and manage semantic models",
      weight: "25–30%"
    }
  ]
}
```

Do not bake assumptions about those percentages into layout logic. The exam changes. Content should be updateable separately from the application.

The current outline requires coverage of the following concepts.

## Maintain a data analytics solution

### Security and governance

Teach:

- workspace-level access
- item-level access
- row-level security
- column-level security
- object-level security
- file-level access/security
- sensitivity labels
- endorsements

### Development lifecycle

Teach:

- workspace version control
- Power BI Project files, PBIP
- deployment pipelines
- downstream impact analysis
- XMLA endpoint
- reusable Power BI assets
- PBIT
- PBIDS
- shared semantic models

## Prepare data

### Get and discover data

Teach:

- creating connections
- finding data through the OneLake catalog
- discovering streams through Real-Time Hub
- ingesting versus accessing data
- choosing an appropriate Fabric data store
- OneLake integration for Eventhouse
- OneLake integration for semantic models

### Transform data

Teach:

- views
- functions
- stored procedures
- derived columns and derived tables
- star schemas in lakehouses and warehouses
- denormalization
- aggregation
- merge
- join
- duplicates
- missing values
- null values
- data types
- filtering

### Query and analyze data

Teach:

- Visual Query Editor
- selecting columns
- filtering
- aggregating
- T-SQL
- KQL
- DAX

## Implement and manage semantic models

Teach:

- storage mode selection
- star schema
- relationships
- bridge tables
- many-to-many relationships
- DAX variables
- DAX iterators
- DAX table filtering
- DAX windowing functions
- DAX information functions
- calculation groups
- dynamic format strings
- field parameters
- large semantic model format
- composite models
- query performance
- report visual performance
- DAX performance
- Direct Lake fallback behavior
- Direct Lake refresh/framing behavior
- Direct Lake on OneLake
- Direct Lake on SQL analytics endpoints
- incremental refresh

This scope comes from the current official DP-600 study guide and must remain traceable back to that source. citeturn655032view0

---

# 3. Do not organize the site like the exam outline

The exam outline is metadata, not the navigation hierarchy.

Do **not** make the primary navigation:

1. Maintain a data analytics solution
2. Prepare data
3. Implement and manage semantic models

That is useful for an exam coverage page but poor as the main mental model.

The actual application should organize concepts according to how Fabric works.

The primary conceptual chain is approximately:

**Sources**
→ **Connections / ingestion**
→ **OneLake**
→ **Lakehouse / Warehouse / Eventhouse**
→ **Transformation**
→ **Semantic model**
→ **DAX / relationships / storage**
→ **Reports and consumers**

Cross-cutting layers surround that pipeline:

- security
- governance
- lifecycle
- Git
- deployment
- performance
- lineage
- monitoring

The exam outline should be an overlay on this architecture.

A learner should be able to click **Exam Map** and see which portions of the system correspond to each DP-600 domain.

---

# 4. Core conceptual model of the site

The entire application should feel as though it contains one explorable Fabric world.

Use one coherent fictional organization and one coherent set of datasets throughout the website.

Create an original fictional company, for example:

**Aurora Outfitters**

It sells outdoor products through stores and online.

The company has:

- customers
- products
- product categories
- stores
- geographic regions
- orders
- order lines
- daily sales
- inventory
- employees
- website events
- device telemetry
- marketing campaigns

This is intentionally broad enough to support:

- relational sales analytics
- dimensional modeling
- event data
- streaming scenarios
- KQL
- SQL
- DAX
- RLS by region
- incremental refresh by transaction date
- Direct Lake
- composite models
- dirty data
- data transformation
- performance examples
- lineage
- lifecycle

Do not use a completely different toy dataset for every lab.

Repeated entities should become familiar.

If the learner sees `FactSales`, `DimProduct`, and `DimRegion` in Schema Lab, those same tables should appear later in Relationship Lab, DAX Microscope, Direct Lake, Security Lens, and Performance Lab.

This continuity matters.

It reduces incidental cognitive load and makes the site feel like a coherent world.

---

# 5. Pedagogical philosophy

Every major interaction must expose a rule or causal relationship.

Before implementing an interaction, answer:

> What understanding becomes visible because the learner can interact with this?

If there is no strong answer, do not add the interaction.

Bad interaction:

- click a warehouse icon
- modal appears containing three paragraphs about warehouses

Better interaction:

- put a workload beside lakehouse, warehouse, and Eventhouse
- switch its requirements
- show which architecture characteristics become relevant
- allow the learner to move the workload
- visibly change available query engines, latency characteristics, table representation, and downstream connections

Bad interaction:

- animated particles flowing through OneLake because it looks attractive

Better interaction:

- user selects a table
- query path illuminates
- changing storage mode causes the path to visibly reroute
- labels explain which engine now executes which part

The site should teach through **model behavior** rather than decorative motion.

---

# 6. Learning principles to encode into the UI

## 6.1 Recognition before recall

The site should normally let users inspect, compare, manipulate, and recognize patterns rather than force retrieval from memory.

Do not turn every topic into “What is X?”

Instead show X in context.

Examples:

Instead of asking what a fact table is, show a model and let the learner inspect its grain.

Instead of asking whether RLS restricts rows, change the active user and visibly remove rows.

Instead of asking which storage mode performs queries against the source, show query arrows reroute when DirectQuery is selected.

Instead of asking what `ALL()` does, show filters disappear from the current evaluation context.

This follows the usability principle of minimizing memory burden by making relevant objects and actions visible. citeturn523929search1

## 6.2 Progressive disclosure

Every concept needs at least two levels:

**Simple view**

The smallest mental model sufficient to understand the concept.

**Inspect internals**

More implementation detail, terminology, edge cases, code, or exam-specific nuance.

Do not display every caveat in the first frame.

For example, Direct Lake initially shows:

**Delta tables → OneLake → semantic model → report**

An expandable deeper view can then show:

- framing
- column loading
- cache
- guardrails
- fallback
- Direct Lake on OneLake
- Direct Lake on SQL endpoint
- DirectLakeBehavior

Progressive disclosure should keep complex interfaces learnable without withholding advanced information. citeturn523929search0

## 6.3 Learner-controlled pacing

Animations should rarely run continuously.

Use:

- Step
- Next
- Previous
- Replay
- Reset
- Play
- Pause

For complicated transformations, default to discrete stepping.

Users should be able to stop on an intermediate state and inspect it.

This is especially important for:

- DAX evaluation
- filter propagation
- SCD changes
- incremental refresh
- deployment
- query execution
- Direct Lake framing

Learner control and segmentation are preferable to forcing users through transient animation at a fixed pace. citeturn941093search0turn941093search2

## 6.4 One visual idea at a time

Avoid spectacular but cognitively overloaded diagrams.

If several processes are visible, de-emphasize inactive ones.

When demonstrating relationship propagation, the security layer does not also need to animate.

When demonstrating Direct Lake, deployment lineage does not need to glow.

Interactive visualizations can themselves create unnecessary cognitive load if too many perceptually rich cues compete simultaneously. citeturn941093search5

## 6.5 Reversibility

Every laboratory needs:

**Reset scenario**

Important changes should either be undoable or trivially resettable.

The learner should feel safe experimenting.

Do not make the user afraid to “break” the simulation.

---

# 7. Overall information architecture

Implement approximately these top-level experiences.

Do not expose twenty equal navigation links.

Use a compact application shell with:

- Explore
- Labs
- Map
- Exam coverage
- Search

Suggested routes:

```text
#/
#/explore
#/atlas
#/labs
#/lab/data-stores
#/lab/data-journey
#/lab/transformation
#/lab/schema
#/lab/scd
#/lab/query
#/lab/dax
#/lab/relationships
#/lab/storage-modes
#/lab/direct-lake
#/lab/performance
#/lab/incremental-refresh
#/lab/security
#/lab/governance
#/lab/lifecycle
#/lab/lineage
#/exam
#/glossary
```

The final set can evolve.

Use Pages-safe routing.

A hash-based router is acceptable and preferable to broken deep links on a static GitHub Pages project deployment.

Examples:

```text
/#/atlas
/#/lab/direct-lake
/#/lab/dax
```

Deep links should be shareable.

---

# 8. Homepage

The homepage should immediately communicate that this is an explorable system.

Do not begin with a giant marketing hero and several paragraphs.

Do not begin with “Choose a course.”

The dominant visual on desktop should be a simplified Fabric system.

Example:

```text
DATA SOURCES

Databases    Files    APIs    Streams
      \        |       |        /
             INGEST
                |
             ONELAKE
       /          |          \
 LAKEHOUSE    WAREHOUSE    EVENTHOUSE
       \          |          /
          SEMANTIC MODELS
                 |
              REPORTS
```

This diagram should be visually sophisticated, but initially understandable in seconds.

Around it or above it should be a short instruction:

**Explore the system**

Subtext:

**Select an object, follow a data path, or open a lab.**

Clicking an object opens an inspector rather than navigating instantly away.

Example inspector for Lakehouse:

**Lakehouse**

- Stores files and Delta tables.
- Supports Spark workloads.
- Exposes a SQL analytics endpoint.
- Good when analytics and data engineering need to meet.

Then provide meaningful actions:

**Open Lakehouse**
**Compare with Warehouse**
**Trace sales data through it**
**See DP-600 objectives**

Those actions should open real interactions, not articles.

The homepage should also contain a restrained “continue exploring” area using local state.

Example:

**Continue**
Direct Lake · last explored yesterday

Do not show streaks.

---

# 9. Application shell

Desktop layout should generally use:

```text
┌────────────────────────────────────────────────────────────────┐
│ Logo / Explore      Search          Map     Exam     Settings   │
├─────────────┬───────────────────────────────────┬───────────────┤
│             │                                   │               │
│ Context /   │                                   │ Inspector     │
│ navigation  │         MAIN VISUAL SPACE         │               │
│             │                                   │               │
│             │                                   │               │
└─────────────┴───────────────────────────────────┴───────────────┘
```

But do not permanently sacrifice too much horizontal space.

The left context rail can collapse.

The right inspector can collapse.

The central visualization is the priority.

On mobile:

- top app bar
- main visualization
- bottom or inline inspector
- no permanent sidebars
- controls reflow below the visual

Never simply shrink the desktop UI until text becomes microscopic.

---

# 10. The Inspector

The right-side Inspector is a key reusable component.

Selecting almost any visual object should populate it.

Use a consistent hierarchy.

Possible inspector sections:

**What is this?**

One or two direct sentences.

**What is happening?**

Dynamic description of the current state.

**Why?**

Explanation of the rule causing it.

**Try**

One or two suggested manipulations.

**Compare**

Contextual comparison link.

**Exam connection**

Which current DP-600 objective(s) this teaches.

**Go deeper**

Optional implementation detail.

**Source**

Microsoft documentation title and verification date.

Do not show every section if unnecessary.

Keep the top of the inspector concise.

---

# 11. Global knowledge graph

Every concept should belong to a knowledge graph.

Example relationships:

```text
Direct Lake
  dependsOn → OneLake
  relatedTo → Delta tables
  relatedTo → Semantic model
  compareWith → Import
  compareWith → DirectQuery
  hasBehavior → Framing
  hasBehavior → Fallback
  impacts → Performance
```

Likewise:

```text
RLS
  belongsTo → Security
  appliesTo → Semantic model
  interactsWith → User identity
  compareWith → OLS
  compareWith → CLS
```

Represent concepts in data.

Example:

```ts
type Concept = {
  id: string;
  title: string;
  shortDescription: string;
  category: ConceptCategory;
  relatedConceptIds: string[];
  prerequisiteConceptIds?: string[];
  compareConceptIds?: string[];
  objectiveIds: string[];
  labIds: string[];
  sourceIds: string[];
  keywords: string[];
};
```

The knowledge graph powers:

- search
- related concept suggestions
- Exam Map
- concept map
- breadcrumbs
- “go deeper”
- coverage analysis

Do not hand-code these relationships into random components.

---

# 12. Global Map

The Map is the learner's spatial orientation system.

It should answer:

- Where am I?
- What is this connected to?
- What else should I inspect?
- Which part of DP-600 am I looking at?

Do not render a giant graph with 150 unreadable nodes.

Default to a local neighborhood around the current concept.

Example while viewing Direct Lake:

```text
                     Delta tables
                          |
                        OneLake
                          |
                      Direct Lake
                 /         |        \
             Framing    Fallback   Refresh
               |           |          |
             Cache      SQL EP     Model state
                 \          |          /
                     Performance
```

Allow:

**Show broader map**

Then gradually reveal more.

Clicking a connected node should open it.

The active concept must remain obvious.

---

# 13. Exam Coverage mode

This is where the official certification outline becomes explicit.

Do not make this the main learning interface.

Provide three current domains with official weight ranges.

Selecting a domain highlights all labs and concepts covering it.

Example:

**Prepare data — 45–50%**

Then map its objectives to actual interactive experiences:

```text
Choose data stores       → Data Store Lab
Discover data            → OneLake / Real-Time Hub Explorer
Transform data           → Transformation Workbench
Star schema              → Schema Lab
Merge / join             → Transformation Workbench
SQL                      → Query Lab
KQL                      → Query Lab
DAX                      → Query Lab + DAX Microscope
```

Coverage states can be:

- not explored
- viewed
- manipulated
- revisited

Never label someone “mastered” solely because they clicked an interaction.

Do not calculate a fake exam-readiness percentage.

---

# 14. Flagship Lab 1: Fabric Atlas

This is the central architectural experience.

Represent major Fabric concepts as nodes with visible relationships.

Initial nodes:

- sources
- connections
- pipelines/dataflows
- OneLake
- Lakehouse
- Warehouse
- Eventhouse
- SQL analytics endpoint
- Real-Time Hub
- semantic model
- Power BI report
- workspace
- Git
- deployment pipeline

Cross-cutting overlay buttons:

- Data flow
- Query path
- Security
- Lineage
- Lifecycle
- Exam coverage

Only one overlay should dominate at once.

## Interaction: trace a record

Let the user select:

**Trace order #10482**

Animate or step through:

Source SQL database
→ ingestion
→ OneLake
→ Lakehouse/Warehouse
→ transformed `FactSales`
→ semantic model
→ measure
→ report visual

At every step:

- emphasize active object
- dim irrelevant objects
- inspector explains transformation
- user controls pace

## Interaction: trace a query

Start at a report visual.

Run backward:

Report
→ DAX query
→ semantic model
→ storage layer
→ engine/source as appropriate

Changing the semantic-model storage mode should change this route.

This creates continuity between architecture and storage-mode labs.

---

# 15. Flagship Lab 2: Data Store Lab

The learner should understand:

- OneLake
- Lakehouse
- Warehouse
- Eventhouse

Do not reduce this to a feature comparison table.

Use a workbench.

Left side contains a workload card.

Example:

**Retail sales reporting**

```text
Data:
Structured transaction tables

Typical access:
T-SQL

Latency:
Batch

Primary workload:
BI and enterprise reporting

Needs:
Relational constraints and warehouse-style SQL
```

Center contains three destination objects:

**Lakehouse**
**Warehouse**
**Eventhouse**

User selects one.

The system reacts by showing:

- supported/relevant query engine
- expected storage representation
- likely downstream path
- mismatches
- strengths

Do not make this a “correct/incorrect” question.

Instead show tradeoffs.

Then let the user alter workload characteristics.

Switch:

**Data form**
Structured / mixed / streaming

**Primary language**
SQL / Spark / KQL

**Latency**
Batch / near-real-time / real-time

**Workload**
BI / data engineering / telemetry

The architecture recommendation should shift visibly.

Use language such as:

**Strong fit**
**Possible**
**Poor fit for this requirement**

Not green check / red X quiz feedback.

Current Fabric storage guidance distinguishes Lakehouse, Warehouse, and Eventhouse according to data shape, workload, engines, latency, and query needs. citeturn568253search2turn568253search4

---

# 16. OneLake Explorer

OneLake should become a place the learner can inspect rather than merely a definition.

Visualize:

```text
Tenant
└── Workspace: Sales Analytics
    ├── Lakehouse: RetailLake
    │   ├── Files
    │   └── Tables
    ├── Warehouse: SalesWarehouse
    └── Semantic model: Sales Model
```

Allow a toggle:

**Physical view**
**Logical view**

Use this to explain the idea of unified logical storage.

Show several analytics engines pointing toward one logical copy where appropriate.

Explain shortcuts visually.

Potential interaction:

Create shortcut from one location to another.

The data does **not** visibly duplicate.

Instead a reference/path appears.

The key lesson is:

**Accessing the same data does not necessarily require another physical copy.**

The current OneLake architecture is a unified logical tenant data lake designed so multiple Fabric engines can work over shared data. citeturn385878search4

---

# 17. OneLake Catalog Explorer

Make a small mock catalog based on the real conceptual functions of OneLake Catalog.

Rows/items can show:

- item name
- type
- workspace
- owner
- last refresh
- endorsement
- sensitivity

Controls:

- filter by workspace
- filter by item type
- filter by domain
- filter by tag
- search

Selecting an item opens:

- metadata
- lineage
- permissions summary
- related assets

This is not meant to copy Microsoft's UI.

It is meant to teach what the catalog is for.

The current OneLake Catalog centers discovery and governance, including metadata, filtering, lineage, endorsement, sensitivity, and permission context. citeturn385878search0turn385878search2

---

# 18. Real-Time Hub Explorer

Create a streaming-data counterpart to OneLake Catalog.

Example streams:

- WebClickstream
- StorePOS
- DeliveryTelemetry
- InventorySensors

Visually distinguish:

**data at rest**
versus
**data in motion**

Selecting `DeliveryTelemetry` can reveal:

```text
Device events
      ↓
Real-Time Hub
      ↓
Eventstream
      ↓
Eventhouse
      ↓
KQL database
```

Then allow:

**Open in Eventhouse**

That should transition naturally into Eventhouse/KQL interactions.

Real-Time Hub is the Fabric-wide location for discovering, ingesting, managing, and consuming streaming data. citeturn568253search1

---

# 19. Transformation Workbench

This lab handles a large amount of the “Prepare data” domain.

Use a compact messy source table.

Example:

```text
OrderID | Customer | Region | Qty | Price | OrderDate
10481   | Ava      | North  | 2   | 499   | 2026-08-02
10482   | Ben      | NULL   | 1   | 899   | 03/08/26
10482   | Ben      | NULL   | 1   | 899   | 03/08/26
10483   | Chen     | South  |     | 199   | 2026-08-03
...
```

Tool palette:

- Filter
- Change type
- Replace null
- Remove duplicate
- Split
- Merge
- Join
- Aggregate
- Add derived column

Each operation should update the data preview immediately.

Maintain a visible transformation pipeline:

```text
Source
↓
Changed OrderDate type
↓
Removed duplicate OrderID
↓
Joined DimRegion
↓
Added Revenue
```

Selecting a step shows before/after differences.

Allow undo.

Do not grade the user's transformation sequence.

This is a sandbox.

Add a **Show equivalent** button where appropriate:

- Power Query conceptual operation
- SQL concept

Do not attempt to implement every possible Power Query feature.

Focus on operations in the DP-600 blueprint.

---

# 20. Visual Query Editor Lab

Recreate the **concept**, not the Microsoft interface.

Present:

**Available tables**

`FactSales`
`DimProduct`
`DimStore`

The learner can add tables to a query canvas.

Then build operations through controls:

- select
- filter
- join
- group
- aggregate

Display generated SQL beside the visual representation.

Example:

Visual representation:

```text
FactSales
   JOIN DimProduct
   FILTER Category = "Bikes"
   GROUP BY Region
   SUM Revenue
```

Generated SQL updates live.

The educational purpose is to establish correspondence between a no-code query representation and relational query operations.

Do not require the learner to memorize syntax before seeing the relational operation.

---

# 21. Query Language Lab

Working name:

**Query Rosetta**

Show one dataset.

Tabs:

**Visual**
**SQL**
**KQL**
**DAX**

Do not pretend all languages are interchangeable.

Instead teach **where and why** each language operates.

Header should continually show:

```text
YOU ARE QUERYING

Warehouse
Language: SQL
Purpose: retrieve and transform relational data
```

Switch to:

```text
YOU ARE QUERYING

Eventhouse
Language: KQL
Purpose: analyze event and telemetry data
```

Switch to:

```text
YOU ARE QUERYING

Semantic model
Language: DAX
Purpose: calculate over model context
```

Give several shared conceptual tasks where comparison is meaningful:

- filter rows
- aggregate values
- group results
- calculate total sales

Then include language-specific tasks.

For KQL:

- time ranges
- event aggregation
- telemetry
- summarize
- time-based analysis

For SQL:

- relational querying
- joins
- views
- stored procedures
- transformations

For DAX:

- measures
- model-aware calculations
- filter context

The key educational message is **layer and purpose**, not syntax equivalence.

The current DP-600 exam explicitly expects SQL, KQL, and DAX. citeturn655032view0

---

# 22. Schema Lab

This should be one of the best parts of the site.

Begin with a wide operational-style table:

```text
OrderID
OrderDate
CustomerID
CustomerName
CustomerCity
ProductID
ProductName
ProductCategory
StoreID
StoreRegion
Quantity
UnitPrice
```

Show repeated attributes visually.

Allow learner to transform this into:

```text
DimCustomer
DimProduct
DimStore
DimDate
FactSales
```

Dragging is welcome on desktop, but every drag operation must also have an accessible button-based alternative.

For example:

Select `ProductName`.

Actions:

**Move to DimProduct**
**Keep in FactSales**

Show relationships materialize as fields move.

Display grain prominently.

For `FactSales`:

**Current grain: one row per order line**

If a change accidentally produces mixed grain, warn visually.

Provide overlays:

**Repeated text**
**Keys**
**Grain**
**Cardinality**
**Filter direction**

Then show how the model changes.

Do not simply tell the user “star schemas are better.”

Let them observe:

- fewer repeated attributes
- clean dimension filtering
- clearer grain
- relationship structure
- implications for analysis

Star-schema guidance in Fabric/Power BI distinguishes dimension tables used for filtering and grouping from fact tables used for summarization, with consistent fact grain as a core modeling principle. citeturn156311search1turn156311search5

---

# 23. Slowly Changing Dimension Time Machine

Create a visual timeline.

Example customer:

```text
Customer 812
Jan–May: Oslo
Jun onward: Bergen
```

Switch:

**SCD Type 1**
**SCD Type 2**

Type 1 animation:

Old value:

Oslo

becomes:

Bergen

Historical value disappears.

Type 2 animation:

Old row becomes:

```text
CustomerKey 1029
CustomerID 812
City Oslo
ValidFrom 2025-01-01
ValidTo 2026-05-31
Current false
```

New row appears:

```text
CustomerKey 1884
CustomerID 812
City Bergen
ValidFrom 2026-06-01
ValidTo —
Current true
```

Then show how historical sales remain associated with the appropriate surrogate key.

This is exactly the kind of concept that benefits from temporal animation.

Include:

- business/natural key
- surrogate key
- current flag
- validity dates

Microsoft's dimensional modeling guidance distinguishes Type 1 overwrite behavior from Type 2 historical row versioning. citeturn156311search4turn156311search7

---

# 24. Relationship Lab

Begin with:

```text
DimProduct 1 ───── * FactSales
DimStore   1 ───── * FactSales
DimDate    1 ───── * FactSales
```

Click any relationship.

Inspector shows:

- cardinality
- active/inactive
- filter direction
- related columns
- uniqueness

## Filter propagation mode

User clicks:

**Region = North**

Rows in `DimRegion` highlight.

Then the relationship illuminates.

Matching fact rows highlight.

Measures recalculate.

This should make filtering spatially visible.

## Bidirectional toggle

Allow:

**Single**
**Both**

When Both is enabled:

- arrow becomes double
- additional tables receive propagated filters
- ambiguous or undesirable paths can visibly appear
- inspector explains consequences

Do not label bidirectional as simply “wrong.”

Teach when it is required and why it should generally be minimized.

Microsoft guidance recommends minimizing bidirectional relationships because of potential performance and user-experience complexity, while recognizing valid patterns such as certain bridge-table scenarios. citeturn848879search0

## Many-to-many scenario

Introduce:

`DimCustomer`
`Account`
`CustomerAccountBridge`
`FactBalance`

Show why a bridge exists.

Allow an intentionally poor direct many-to-many connection and compare it with the bridge design.

Another scenario can demonstrate why directly relating two fact tables is usually inferior to shared dimensions.

Microsoft recommends bridge-based patterns for many-to-many dimensions and generally avoiding direct many-to-many fact relationships when a star design can express the model. citeturn848879search3

---

# 25. DAX Microscope

This is a flagship experience.

Do not build a full DAX interpreter during the first implementation.

Instead build a deterministic educational execution engine for curated expressions and scenarios.

Use small tables whose row states are visible.

Layout:

```text
┌──────────────────────┐ ┌───────────────────────────────┐
│ Model                │ │ Expression                    │
│                      │ │ CALCULATE(...)                │
│ DimProduct           │ │                               │
│ FactSales            │ │ [ Step ] [ Play ] [ Reset ]  │
└──────────────────────┘ └───────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Evaluation state                                       │
│                                                        │
│ Filter context                                         │
│ Active rows                                            │
│ Current variable values                                │
│ Intermediate result                                    │
└────────────────────────────────────────────────────────┘
```

## Required early scenarios

### Measure baseline

```text
Total Sales = SUM(FactSales[Revenue])
```

Show fact rows contributing to result.

### CALCULATE

Show existing filter context.

Then add/change a filter.

Show filter propagation.

Then evaluate measure.

### ALL

Visually remove relevant filters.

### FILTER

Display intermediate table produced by the filtering expression.

### SUMX

Step row by row.

For each row:

- current row highlights
- expression evaluates
- intermediate value appears
- accumulator updates

### Variables

Example:

```DAX
VAR SalesAmount = ...
VAR Target = ...
RETURN ...
```

Expose the variable values.

### Windowing

Later create a timeline/table where the active window becomes visible.

Do not make users decipher a long textual explanation while the animation plays.

Use short state labels.

Example:

**1. Existing filter context**

**2. CALCULATE modifies context**

**3. Filter propagates through relationship**

**4. Measure evaluates over visible fact rows**

Allow Previous/Next.

---

# 26. DAX Context Visual Language

Use consistent visual encodings.

Example:

- highlighted table rows = currently visible rows
- dimmed rows = filtered out
- outlined row = row context
- relationship pulse = filter propagation
- filter chips = filter context
- variable chips = evaluated variable state
- subtotal badge = intermediate result

Do not rely on color alone.

Use:

- opacity
- icons
- borders
- labels
- patterns where appropriate

The learner should be able to look at the UI and distinguish:

**row context**

from

**filter context**

without reading a paragraph.

---

# 27. Calculation Group Lab

Do not explain calculation groups only through code.

Start with repetitive measures:

```text
Sales
Sales YTD
Sales PY
Sales YoY
Margin
Margin YTD
Margin PY
Margin YoY
Orders
Orders YTD
Orders PY
Orders YoY
```

Visually show the combinatorial repetition.

Then introduce a calculation group:

```text
Time Intelligence
  Current
  YTD
  Previous Year
  YoY
```

Show the measure grid collapse.

Selecting a calculation item applies it to the selected measure.

Expose `SELECTEDMEASURE()` in advanced view.

Then show dynamic format strings preserving numeric behavior.

Microsoft calculation groups are designed to reduce repetitive measures by applying reusable calculation items to measures. citeturn461779search1

---

# 28. Field Parameter Explorer

Use a report mock-up.

Chart axis currently:

**Product Category**

A field parameter control lets the user switch:

- Category
- Brand
- Region
- Store

The actual visualization changes.

A separate measure parameter can switch:

- Revenue
- Margin
- Orders

The educational purpose is to show how field parameters make report dimensions/measures dynamically selectable.

No quiz.

---

# 29. Storage Mode Lab

Show a semantic model over a large fictional sales table.

Modes:

- Import
- DirectQuery
- Dual
- Direct Lake

Use a consistent query-path animation.

## Import

```text
Source
   ↓ REFRESH
Semantic model memory
   ↓ QUERY
Report
```

Display:

**Data copied during refresh**

Queries read from the imported model.

## DirectQuery

```text
Report
   ↓
Semantic model
   ↓ QUERY SOURCE
Data source
   ↓
Result
```

Display:

**Query reaches source**

## Dual

Use a dimension table.

Show that depending on query context it can behave as imported or participate in a DirectQuery path.

## Direct Lake

Route:

```text
Delta tables
   ↓
OneLake
   ↓
Semantic model
   ↓
Report
```

Then open the Direct Lake Engine Room.

Keep terminology precise.

Do not imply that all storage modes have identical capabilities.

---

# 30. Direct Lake Engine Room

This is another flagship experience.

Current Direct Lake behavior deserves a detailed simulation.

Microsoft currently distinguishes **Direct Lake on OneLake** from **Direct Lake on SQL analytics endpoints**. Direct Lake on OneLake is the recommended direction for new semantic models and avoids DirectQuery fallback, while the SQL-endpoint variant can fall back to DirectQuery in specified circumstances. Direct Lake queries can load required columns from Delta/Parquet data into memory for query execution. citeturn848879search1turn576626search4

## Main visual

Show layers:

```text
REPORT VISUAL
      |
SEMANTIC MODEL
      |
IN-MEMORY COLUMN CACHE
      |
ONELAKE
      |
DELTA TABLES
```

Buttons:

**Run first query**
**Run second query**
**Change data**
**Refresh framing**
**Introduce fallback condition**
**Reset**

## First query

A measure requires:

`FactSales[Revenue]`
`DimProduct[Category]`

Animate only those required columns into the in-memory representation.

Label:

**Required columns loaded**

Do not animate entire tables if not required.

## Second query

Reuse already available columns.

Load any new required column.

Make this behavior visually understandable.

## Framing / refresh

Change the underlying table.

Show:

**Data state changed**

Then expose what semantic model refresh/framing means in this context.

Avoid inaccurate analogy to Import-mode copying.

## SQL analytics endpoint variant

Toggle:

**Direct Lake on OneLake**
**Direct Lake on SQL analytics endpoint**

For SQL endpoint mode, allow a curated fallback-triggering condition.

When fallback happens:

Normal path fades.

New path:

```text
Semantic model
      ↓
DirectQuery
      ↓
SQL analytics endpoint
```

Display:

**Query is no longer being served through the normal Direct Lake path.**

Then explain why this can matter for performance.

Do not imply that Direct Lake on OneLake has the same fallback mechanism.

---

# 31. Composite Model Lab

Create:

```text
DimProduct       Import / Dual
DimDate          Import / Dual
FactSales        DirectQuery
SalesTargets     Import
```

Show the model.

Run different queries.

Highlight which sources/modes participate.

Then allow toggling `DimProduct` from Import to Dual.

Show the query path changing for appropriate scenarios.

Expose cross-source relationships.

Provide an **Aggregation table** scenario later:

```text
FactSales        DirectQuery    200M rows
AggSalesByMonth  Import           200K rows
```

Run:

**Monthly revenue by region**

Route to aggregation table.

Then run:

**Individual transaction details**

Route to DirectQuery fact table.

The purpose is to make composite storage architecture visible.

Microsoft guidance describes composite models as combining Import and DirectQuery storage, with Dual tables and aggregation patterns useful in appropriate mixed-storage scenarios. citeturn848879search4turn848879search11turn848879search7

---

# 32. Incremental Refresh Time Machine

Create a horizontal timeline.

Example:

```text
2023 | 2024 | 2025 | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug
```

Initial state:

one large table

Action:

**Enable incremental refresh**

Settings:

**Store:** 3 years

**Refresh:** last 30 days

Then split timeline into visible partitions.

Historical partitions become visually stable.

Recent partitions remain active.

Run refresh.

Only recent partitions animate.

Display:

```text
Historical partitions reused
Recent partitions refreshed
```

Then add optional:

**Real-time data**

Show a current DirectQuery partition when relevant.

Advanced inspector shows:

- `RangeStart`
- `RangeEnd`
- filter requirement
- rolling window
- historical period
- refresh period

The current incremental-refresh model partitions data so that only recent portions need repeated refresh, with `RangeStart` and `RangeEnd` central to configuration. citeturn461779search0turn461779search6

---

# 33. Performance Lab

Do not make performance a list of “tips.”

Use an intentionally inefficient semantic model/query and allow the learner to improve it.

Dashboard:

```text
Query duration        1.84 s
Rows scanned          ...
Model cardinality     ...
Storage engine work   ...
Formula engine work   ...
```

These numbers can be deterministic educational simulation values rather than claims of actual Fabric benchmarking.

Clearly label them:

**Simulated for learning**

Possible manipulations:

- remove unnecessary high-cardinality column
- replace calculated column with measure where appropriate
- simplify an iterator
- change relationship direction
- use aggregation table
- change storage mode
- reduce visual interactions
- remove unnecessarily granular visual

After each manipulation:

show metrics move.

Then explain why.

Do not randomly generate numbers.

Each scenario needs a deterministic rule mapping choice → simulated metric change.

Use relative comparisons where possible.

Example:

**Before: 1.00× baseline**

**After: 0.42× simulated query work**

This avoids pretending the simulator is a real engine profiler.

Microsoft's current semantic-model learning path explicitly includes Performance Analyzer, DAX optimization, cardinality reduction, aggregations, and troubleshooting. citeturn503913view2

---

# 34. Security Lens

Use the same model and dataset already familiar from other labs.

Top control:

**View as**

- Workspace Admin
- Data Analyst
- Norway Sales
- Sweden Sales
- Report Viewer
- External Consumer

Switching identity should update access everywhere.

Visual layers:

```text
WORKSPACE
  ↓
ITEM
  ↓
SEMANTIC MODEL
  ↓
TABLE
  ↓
COLUMN
  ↓
ROW
```

This is crucial.

The learner should understand **where** security operates.

## Workspace access

Change role.

Show accessible items.

## Item access

Grant or remove access to a specific semantic model/report.

## RLS

Select:

**Norway Sales**

`DimRegion` filter activates.

Norway rows remain.

FactSales propagates accordingly.

Report changes.

## OLS

Hide a table or object.

The table itself becomes unavailable.

## CLS

Hide a sensitive column.

The column visibly disappears or becomes unavailable according to the educational scenario.

## File/OneLake security

Use the OneLake view to show security closer to stored data.

Do not treat every security mechanism as interchangeable.

Current OneLake security supports object-, column-, and row-oriented controls, while semantic-model security and workspace/item permissions operate at different layers. citeturn576626search6turn576626search12

---

# 35. Security Stack Compare mode

Provide a dedicated comparison:

```text
Mechanism       Controls
-----------------------------------
Workspace role  Workspace capabilities
Item permission Individual Fabric item
RLS             Rows
CLS             Columns
OLS             Objects/tables
OneLake roles   Data access at OneLake layer
Sensitivity     Classification/protection metadata
```

But make the table interactive.

Selecting **RLS** should highlight only the row layer in a model.

Selecting **OLS** highlights the object layer.

Selecting **Sensitivity** should shift away from “data filtering” and show classification/governance behavior.

This prevents a common mental error: treating all Fabric “security” concepts as versions of the same mechanism.

---

# 36. Governance Lab

Use OneLake Catalog-style items.

Teach:

- sensitivity labels
- Promoted
- Certified
- Master data
- ownership
- discoverability/trust context

Scenario:

Several candidate semantic models exist:

```text
Sales Draft
Sales Reporting
Enterprise Sales Model
Sales Sandbox
```

Each has metadata.

Allow an authorized reviewer to change endorsement state in the simulation.

Observe how catalog trust indicators change.

Do not equate endorsement with security.

Do not equate sensitivity labels with RLS.

Keep those concepts visually separate.

Current Fabric endorsement includes states such as Promoted, Certified, and Master data, while sensitivity labeling is part of governance/classification rather than simply a row-filter mechanism. citeturn568253search0turn406834search1

---

# 37. Lifecycle Lab

Main visual:

```text
LOCAL PROJECT
      |
     Git
      |
DEVELOPMENT
      ↓
TEST
      ↓
PRODUCTION
```

Use an actual fictional semantic-model change.

Example:

Developer adds:

`Gross Margin %`

Then show the change in:

**PBIP file tree**

Example conceptual tree:

```text
AuroraSales/
  AuroraSales.Report/
  AuroraSales.SemanticModel/
  AuroraSales.pbip
  .gitignore
```

Expand SemanticModel:

```text
definition/
  tables/
  relationships/
  roles/
```

Do not overpromise exact file structure if Microsoft's format changes. Treat implementation-sensitive details as versioned content.

PBIP currently stores report and semantic-model item definitions as source-control-friendly project files, including text representations suitable for Git and CI/CD workflows. citeturn481125search0turn481125search1

## Git interaction

Show:

```diff
+ measure 'Gross Margin %' = DIVIDE([Gross Margin], [Revenue])
```

Then:

**Commit**

Visual path:

Working tree
→ commit
→ development workspace

Do not implement a real Git client.

This is conceptual.

## Deployment

The semantic-model change appears in Development.

Press:

**Deploy to Test**

Animate only changed assets.

Then:

**Deploy to Production**

Show dependent report updated.

Fabric deployment pipelines commonly use staged environments such as Development, Test, and Production. citeturn576626search10

---

# 38. PBIP Anatomy Explorer

This can be a separate advanced drawer inside Lifecycle Lab.

Use an interactive file tree.

Selecting:

`SemanticModel/definition/tables/...`

shows:

**This is model metadata represented as text suitable for source control.**

Selecting a report visual file in PBIR-style representation later can show why source-controlled report definitions reduce monolithic merge conflicts.

Do not turn this into a file-format reference manual.

The educational objective is:

**Power BI projects can be represented as source-controlled project artifacts instead of only opaque desktop files.**

---

# 39. XMLA Endpoint Explorer

Represent the semantic model as a central object.

External tool nodes around it:

- management tool
- script
- modeling tool
- monitoring tool

Toggle:

**Read**
**Read/write**

Read allows:

- inspect
- query
- monitor

Read/write adds conceptual actions:

- modify metadata
- manage partitions
- perform advanced model management

Do not implement an actual XMLA client.

The current XMLA endpoint supports remote querying/management of semantic models and, with write enabled, advanced metadata and data-management operations. citeturn127228search0turn127228search11

---

# 40. Lineage and Impact Lab

Create a directed graph:

```text
Lakehouse
   ↓
Dataflow
   ↓
Warehouse
   ↓
Semantic Model
   ↓
Report
   ↓
Dashboard / Consumer
```

Select `DimProduct[Category]`.

Press:

**Rename field**

Before applying, illuminate downstream dependencies.

Inspector:

**Potentially affected**

- Sales Semantic Model
- Product Performance Report
- Executive Sales Report

Then allow:

**Show only affected path**

Everything unrelated fades.

This should make “impact analysis” intuitive.

Another scenario:

Delete a table.

Show affected graph before actually applying the simulated change.

No surprise destructive state.

---

# 41. Break It mode

Every major lab should eventually support some form of free experimentation.

Do not call it a test.

Button:

**Break it**

Example Relationship Lab mutations:

- make filter bidirectional
- create direct fact-to-fact relationship
- change cardinality
- remove dimension

Example Storage Lab:

- change storage mode
- increase fact volume
- introduce cross-source table

Example Security:

- give Build permission
- remove workspace role
- alter RLS role

Example Data Lab:

- retain duplicates
- convert type incorrectly
- join on a nonunique key

As conditions deteriorate, show consequences.

Possible indicators:

**Ambiguous filter path**

**Duplicate key**

**Historical values overwritten**

**Query path now reaches source**

**Direct Lake fallback triggered**

**Norway role can now see Sweden rows**

These warnings are learning feedback, not scoring.

---

# 42. Compare mode

Compare should be a first-class feature across the application.

Global keyboard/action:

**Compare**

Examples:

- Lakehouse ↔ Warehouse
- Warehouse ↔ Eventhouse
- SQL ↔ KQL
- Import ↔ DirectQuery
- Import ↔ Direct Lake
- Direct Lake on OneLake ↔ SQL endpoint
- RLS ↔ OLS
- Type 1 ↔ Type 2 SCD
- star ↔ snowflake
- single-direction ↔ bidirectional
- before ↔ after optimization

Do not default to giant feature tables.

Prefer synchronized visuals.

Example storage-mode comparison:

Left side runs same report query using Import.

Right side runs same query using DirectQuery.

The learner sees both paths.

---

# 43. Search

Global search should search concepts, not only page titles.

Typing:

`fallback`

should return:

**Direct Lake fallback**
Direct Lake · Storage modes · Performance

Typing:

`many to many`

should return:

**Many-to-many relationships**
Relationships · Bridge tables · Star schema

Typing:

`KQL`

should return:

- KQL
- Eventhouse
- Query Lab
- Real-Time Intelligence

Results need strong information scent: clear title, category, and one-line explanation. Users navigate more effectively when links communicate the likely value of the destination before selection. citeturn523929search2

---

# 44. Glossary

A glossary is allowed but should remain secondary.

Each term includes:

- short definition
- where it sits in Fabric
- related concepts
- open interactive lab

Example:

**Fact table**

> A table of measurements or events at a defined grain, usually related to dimensions.

Actions:

**Show in Schema Lab**
**Compare with dimension table**

Do not write encyclopedia-length entries.

---

# 45. Visual design direction

The interface should look like a **technical exploratory instrument**, not an LMS.

Desired feel:

- clean
- calm
- precise
- spatial
- analytical
- slightly playful
- highly legible
- visually distinctive without being gaudy

Think:

- systems diagram
- architecture explorer
- science museum exhibit
- developer tool
- modern data application

Do not mimic Microsoft Learn.

Do not mimic Power BI's exact chrome.

Do not make every element purple because Fabric branding uses purple.

Develop an independent visual identity.

---

# 46. Color system

Use semantic categories consistently.

Example conceptual categories:

- storage
- compute/query
- semantic modeling
- reports
- security
- lifecycle
- streaming
- source data

Each category can have a distinct hue.

But every distinction must have another cue:

- icon
- label
- border style
- shape
- pattern
- position

Never require color perception to understand a relationship.

Maintain WCAG contrast.

Normal body text should meet at least 4.5:1 contrast.

Large text may use the applicable 3:1 threshold.

---

# 47. Typography

Use a highly readable sans-serif interface font.

Prefer system fonts unless a bundled/open font clearly improves the design.

Code uses a monospace stack.

Hierarchy:

- large but restrained page/lab title
- clear subheadings
- normal 16–18px body reading size
- 13–14px metadata where appropriate
- never tiny 10px labels as the only way to understand a diagram

SVG labels should remain readable when the visualization reflows.

Avoid excessive uppercase.

Use uppercase only for tiny category/status labels if contrast and readability remain adequate.

---

# 48. Surfaces

Avoid the modern-dashboard anti-pattern where every piece of content is inside another rounded card.

Use cards only when they express a meaningful object or grouping.

The central visualization should usually sit on an open canvas-like surface.

Inspector panels and tool palettes can have contained surfaces.

Keep shadows subtle.

Prefer boundaries, whitespace, and hierarchy over heavy decoration.

---

# 49. Motion

Motion must have instructional purpose.

Allowed:

- trace filter propagation
- move current DAX row context
- animate a query path
- reveal new SCD row
- show partition refresh
- show deployment movement
- show column loading into Direct Lake memory

Discouraged:

- floating decorative particles
- continuous pulsing everywhere
- bouncing cards
- gratuitous parallax
- intro animations that delay interaction

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is requested, replace movement with:

- state transitions
- immediate highlighting
- step indicators

The user must still receive the educational information. citeturn819377search6turn819377search8

---

# 50. Interaction design

Every click/tap needs immediate visible feedback.

Examples:

- selected node remains selected
- inspector updates
- filter chip appears
- row states change
- query path illuminates

Do not rely on hover.

Hover may add a tooltip on pointer devices but must never contain essential information unavailable by click/tap/focus.

Follow basic usability heuristics:

- show system status
- let users undo/reset
- prevent avoidable errors
- maintain consistency
- prefer recognition
- explain errors near their source

These align with established interface usability heuristics. citeturn523929search1

---

# 51. Accessibility requirements

Treat accessibility as architecture, not polish.

Target WCAG 2.2 AA.

## Keyboard

Everything essential must work without a mouse.

All controls use actual:

- `<button>`
- `<a>`
- `<input>`
- `<select>`

where possible.

Avoid clickable `<div>` elements.

Interactive SVG nodes must have an accessible equivalent.

Preferred approach:

- SVG renders visual system.
- Synchronized DOM controls/list expose same objects.
- Keyboard selection updates SVG and inspector.

If direct SVG focus is used, provide:

- `tabindex`
- role
- accessible name
- keyboard activation
- visible focus

Focus order should match visual/logical order. citeturn819377search3

## Focus

Always provide a conspicuous focus indicator.

Never remove `outline` without an equally obvious replacement.

## Dragging

Any drag interaction must have a non-drag single-pointer alternative.

Example:

Drag field to dimension.

Alternative:

Select field
→ choose **Move to DimProduct**

WCAG 2.2 specifically requires alternatives for functionality dependent on dragging, subject to applicable exceptions. citeturn571281search6

## Touch target size

Aim for at least approximately 44 × 44 CSS pixels for important touch controls even when the formal minimum applicable requirement may be smaller.

## Screen readers

Dynamic explanatory changes should use restrained `aria-live` regions where meaningful.

Do not announce every animation frame.

Announce state milestones:

**Filter applied. 8 of 24 sales rows remain.**

## Tables

Use semantic tables when displaying actual tabular data.

## Reduced motion

Fully supported.

## High zoom / narrow widths

No essential content should disappear merely because the viewport narrows.

---

# 52. Responsive design

Design mobile intentionally.

Do not assume the user studies only on desktop.

Core principles:

- no page-level horizontal scroll
- controls wrap
- main content remains usable at 320px width
- inspectors move below visualization
- complex models may use a localized horizontal scroll region if necessary
- labels remain readable
- important controls remain tap-friendly

Use CSS Grid and Flexbox.

Use content-driven breakpoints rather than device-specific breakpoints.

Modern responsive guidance emphasizes fluid layouts, flexible grid/flex patterns, and reflow rather than fixed desktop widths. citeturn819377search0

For highly spatial diagrams:

Desktop:
full architecture.

Mobile:
show a focused subset or stacked path.

Do not scale a 1200px diagram to 320px and call it responsive.

---

# 53. Technical stack

Unless the existing repository strongly dictates otherwise, use:

- React
- TypeScript
- Vite
- React Router using hash routing
- CSS variables + CSS Modules or a similarly disciplined CSS approach
- Vitest
- React Testing Library
- Playwright
- axe accessibility checks

Use latest stable releases available at implementation time and commit the lockfile.

Do not add heavy dependencies without a clear need.

Potentially use D3 for:

- scales
- graph layout
- geometry helpers

Do **not** let D3 own the entire DOM.

Prefer React rendering SVG from computed state.

For code editors, use CodeMirror 6 and lazy-load it.

Avoid Monaco unless a compelling requirement appears; it is unnecessarily heavy for the initial site.

---

# 54. Why SVG rather than Canvas for core diagrams

Use SVG for most instructional visualizations.

Reasons:

- inspectable elements
- crisp at arbitrary resolution
- easier responsive sizing
- easy labels
- declarative state
- straightforward CSS
- easier keyboard/accessibility integration
- easier testing
- easier click targets

Canvas is acceptable only where truly necessary.

The architecture atlas, relationship diagrams, query paths, partition timeline, lineage graph, DAX tables, and storage diagrams should all be SVG/DOM first.

---

# 55. State architecture

Separate:

**content state**
from
**simulation state**
from
**user persistence**

Example:

```ts
type LabSessionState = {
  labId: string;
  scenarioId: string;
  selectedObjectId?: string;
  step: number;
  controls: Record<string, string | number | boolean>;
  mutations: LabMutation[];
};
```

Persistent user state:

```ts
type UserProgress = {
  version: number;
  conceptVisits: Record<string, ConceptVisit>;
  labVisits: Record<string, LabVisit>;
  favorites: string[];
  lastLocation?: string;
};
```

Concept visit:

```ts
type ConceptVisit = {
  firstVisitedAt: string;
  lastVisitedAt: string;
  visitCount: number;
  manipulated: boolean;
};
```

Do not store fake mastery scores.

No backend is required.

Use localStorage for lightweight persistence.

Version the stored schema so future updates do not break users.

---

# 56. Lab architecture

Every lab should conform to a reusable contract.

Conceptually:

```ts
type LabDefinition = {
  id: string;
  title: string;
  subtitle: string;
  conceptIds: string[];
  objectiveIds: string[];
  sourceIds: string[];
  scenarios: ScenarioDefinition[];
};
```

Every scenario should define:

- initial state
- available controls
- state transitions
- explanatory messages
- reset behavior

Do not hide simulation logic inside components.

Prefer pure functions.

Example:

```ts
function applyRelationshipDirection(
  model: ModelState,
  direction: RelationshipDirection
): ModelState
```

This makes:

- testing easier
- reasoning easier
- scenarios deterministic
- UI easier to refactor

---

# 57. Simulation accuracy

The application is educational.

It is not an actual Fabric execution engine.

Be explicit about that.

Where numeric performance behavior is simulated, label it.

Where DAX evaluation is simplified to curated scenarios, label it.

Never invent engine behavior merely to make a visualization work.

For each scenario, maintain a small explanation in source:

```ts
accuracyNote: {
  type: "conceptual-simulation",
  text: "This illustrates filter propagation for this model rather than executing the Microsoft DAX engine."
}
```

Use official Microsoft documentation to verify the underlying conceptual rule.

---

# 58. Shared synthetic data

Create `/src/data/aurora/`.

Suggested files:

```text
customers.ts
products.ts
stores.ts
dates.ts
sales.ts
inventory.ts
employees.ts
webEvents.ts
deviceEvents.ts
dirtyOrders.ts
```

Keep datasets small enough to inspect.

Example:

`FactSales`: 30–100 rows for interactive scenarios.

`WebEvents`: 100–300 lightweight events if needed.

Do not generate thousands of rows when the visualization only displays twenty.

Use deterministic IDs.

Include intentionally useful properties:

- duplicate order
- null region
- malformed date
- historical customer change
- several geographic regions
- several product categories
- employee access region
- recent and historical transaction dates
- high-cardinality optional field
- sales record suitable for many-to-many demonstration

Document why each synthetic anomaly exists.

---

# 59. Content source registry

Create a central source file.

Example:

```ts
type Source = {
  id: string;
  title: string;
  publisher: "Microsoft Learn" | "GitHub Docs" | "web.dev" | "W3C";
  url: string;
  accessed: string;
  appliesTo: string[];
};
```

Sources should never be scattered as hardcoded URLs throughout components.

Create:

```text
src/content/sources.ts
```

Include at minimum the official current documentation behind:

- DP-600 Study Guide
- DP-600 course
- Fabric data storage options
- OneLake
- OneLake Catalog
- Real-Time Hub
- Eventhouse
- Direct Lake
- semantic model storage modes
- star schemas
- many-to-many relationships
- calculation groups
- incremental refresh
- semantic-model security
- OneLake security
- sensitivity labels
- endorsement
- PBIP
- deployment pipelines
- XMLA

Every technical lab should list its source IDs.

---

# 60. Source transparency in the UI

At the bottom of the Inspector or in a sources drawer:

**Based on**
Microsoft Learn · Direct Lake overview

**Verified**
31 Aug 2026

Click opens documentation in a new tab.

Do not clutter the teaching visualization with citation badges everywhere.

But make source provenance easy to inspect.

---

# 61. Exam objective registry

Create IDs.

Example:

```text
MAINTAIN.SECURITY.WORKSPACE
MAINTAIN.SECURITY.ITEM
MAINTAIN.SECURITY.ROW
MAINTAIN.SECURITY.COLUMN
MAINTAIN.SECURITY.OBJECT
MAINTAIN.GOVERNANCE.SENSITIVITY
MAINTAIN.GOVERNANCE.ENDORSEMENT

MAINTAIN.LIFECYCLE.VERSION_CONTROL
MAINTAIN.LIFECYCLE.PBIP
MAINTAIN.LIFECYCLE.DEPLOYMENT
MAINTAIN.LIFECYCLE.IMPACT
MAINTAIN.LIFECYCLE.XMLA
MAINTAIN.LIFECYCLE.REUSABLE_ASSETS

PREPARE.GET.CONNECTION
PREPARE.GET.CATALOG
PREPARE.GET.REALTIME_HUB
PREPARE.GET.INGEST
PREPARE.GET.STORE_SELECTION
PREPARE.GET.ONELAKE_INTEGRATION

PREPARE.TRANSFORM.SQL_OBJECTS
PREPARE.TRANSFORM.DERIVED
PREPARE.TRANSFORM.STAR
PREPARE.TRANSFORM.DENORMALIZE
PREPARE.TRANSFORM.AGGREGATE
PREPARE.TRANSFORM.MERGE
PREPARE.TRANSFORM.JOIN
PREPARE.TRANSFORM.DATA_QUALITY
PREPARE.TRANSFORM.DATA_TYPES
PREPARE.TRANSFORM.FILTER

PREPARE.QUERY.VISUAL
PREPARE.QUERY.SQL
PREPARE.QUERY.KQL
PREPARE.QUERY.DAX

MODEL.DESIGN.STORAGE
MODEL.DESIGN.STAR
MODEL.DESIGN.RELATIONSHIPS
MODEL.DESIGN.DAX
MODEL.DESIGN.CALC_GROUPS
MODEL.DESIGN.FIELD_PARAMETERS
MODEL.DESIGN.LARGE_FORMAT
MODEL.DESIGN.COMPOSITE

MODEL.OPTIMIZE.QUERY
MODEL.OPTIMIZE.DAX
MODEL.OPTIMIZE.DIRECT_LAKE
MODEL.OPTIMIZE.INCREMENTAL_REFRESH
```

Use these mappings to automatically determine exam coverage.

---

# 62. Navigation state and URLs

Important lab state should optionally be encodable in query/hash parameters.

Example:

```text
#/lab/storage-modes?mode=direct-lake
```

or

```text
#/lab/relationships?scenario=bridge
```

Do not encode every transient animation state.

Encode enough to link directly to a scenario.

---

# 63. Component system

Build reusable primitives.

Suggested components:

```text
AppShell
TopNav
ContextRail
Inspector
InspectorSection
ConceptLink
ExamObjectiveBadge
SourceDrawer

LabShell
LabToolbar
ScenarioSelector
ResetButton
StepControls
CompareToggle

DiagramCanvas
DiagramNode
DiagramEdge
DataPath
QueryPath
RelationshipEdge
FilterChip
StateBadge

DataTable
InteractiveRow
InteractiveColumn
TableKeyBadge

CodePanel
CodeTabs

Timeline
Partition
StagePipeline
FileTree
DiffViewer

Metric
MetricChange
WarningCallout
ExplanationCallout
```

Do not prematurely create a giant generic diagram framework.

Extract components after two real labs demonstrate the shared pattern.

---

# 64. CSS design tokens

Create tokens immediately.

Example categories:

```css
:root {
  --bg-page: ...;
  --bg-surface: ...;
  --bg-elevated: ...;

  --text-primary: ...;
  --text-secondary: ...;
  --text-muted: ...;

  --border-subtle: ...;
  --border-strong: ...;

  --accent-interactive: ...;

  --category-storage: ...;
  --category-streaming: ...;
  --category-model: ...;
  --category-query: ...;
  --category-report: ...;
  --category-security: ...;
  --category-lifecycle: ...;

  --state-selected: ...;
  --state-warning: ...;
  --state-success: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;

  --space-1: ...;
  ...
}
```

Do not scatter hard-coded colors everywhere.

---

# 65. Dark mode

Dark mode is desirable but not Phase 1 critical.

Architect tokens so it can be added cleanly.

If implementing immediately, use:

- system default
- light
- dark

Persist preference locally.

All visualization colors must be tested in both themes.

Do not let dark mode delay the primary interaction design.

---

# 66. Performance requirements

This is a visual learning application, but it should still feel instant.

Target Core Web Vitals in the “good” range:

- LCP ≤ 2.5 seconds
- INP ≤ 200 ms
- CLS ≤ 0.1

These are the current web.dev “good” thresholds at the 75th percentile. citeturn819377search1

Actions:

- route/lab code splitting
- lazy-load CodeMirror
- no large hero imagery
- avoid large chart libraries
- avoid needless animation dependencies
- compress static assets
- use SVG for native diagrams
- keep initial JS reasonable
- preload only essentials

The homepage architecture should render without waiting for a giant secondary lab bundle.

---

# 67. GitHub Pages deployment

This project must deploy reliably as static content.

Use Vite.

For a project Pages URL:

```text
https://USERNAME.github.io/REPOSITORY/
```

configure the Vite `base` appropriately for the repository path.

For a user root Pages site or custom root domain, `/` is appropriate.

Vite's official deployment guide explicitly requires adjusting `base` for project Pages deployments. citeturn548658search2

Use GitHub Actions.

GitHub recommends Actions when the site uses a custom build process rather than plain branch-published static/Jekyll content. citeturn548658search0

Workflow concept:

```text
checkout
→ setup Node
→ npm ci
→ lint
→ test
→ build
→ configure Pages
→ upload dist artifact
→ deploy Pages
```

Production deployment only from the default branch.

Pull requests should run:

- lint
- typecheck
- unit tests
- build
- relevant browser tests

without production deployment.

---

# 68. Repository layout

Target something close to:

```text
/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers/
│   │
│   ├── components/
│   │   ├── shell/
│   │   ├── inspector/
│   │   ├── diagrams/
│   │   ├── data/
│   │   ├── controls/
│   │   └── common/
│   │
│   ├── labs/
│   │   ├── atlas/
│   │   ├── dataStores/
│   │   ├── transformation/
│   │   ├── schema/
│   │   ├── dax/
│   │   ├── relationships/
│   │   ├── storageModes/
│   │   ├── directLake/
│   │   ├── performance/
│   │   ├── incrementalRefresh/
│   │   ├── security/
│   │   ├── lifecycle/
│   │   └── lineage/
│   │
│   ├── engine/
│   │   ├── filters/
│   │   ├── relationships/
│   │   ├── transformations/
│   │   └── simulations/
│   │
│   ├── content/
│   │   ├── concepts.ts
│   │   ├── examObjectives.ts
│   │   ├── labs.ts
│   │   ├── sources.ts
│   │   └── glossary.ts
│   │
│   ├── data/
│   │   └── aurora/
│   │
│   ├── hooks/
│   ├── state/
│   ├── styles/
│   ├── test/
│   └── main.tsx
│
├── tests/
│   └── e2e/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Adjust based on reality.

Do not create empty folders for every future feature just to mirror this diagram.

---

# 69. Testing philosophy

Most simulation behavior should be testable without a browser.

Example relationship test:

```text
Given:
DimRegion North selected

Relationship:
DimRegion[RegionID] 1 → * FactSales[RegionID]

Expected:
Only North FactSales rows remain active
```

Test:

- filter propagation
- SCD transformation
- incremental-refresh partition selection
- Direct Lake scenario state transitions
- security visibility
- query-path switching
- transformation operations

UI tests should then verify presentation and controls.

---

# 70. Accessibility testing

Add automated axe checks to representative pages.

But do not treat a passing axe scan as sufficient.

Manual checks required for major labs:

- keyboard-only
- focus visibility
- 200% zoom
- narrow viewport
- reduced motion
- screen-reader semantics for controls
- touch interaction
- drag alternative

---

# 71. Visual regression testing

If practical, use Playwright screenshots for flagship visualizations at:

- desktop
- tablet
- narrow mobile

Focus on:

- clipping
- overlapping labels
- broken diagrams
- misplaced inspectors

Do not create brittle pixel-perfect tests for every animation state.

---

# 72. Content-writing style

Technical writing should be extremely direct.

Prefer:

**A warehouse is optimized for relational analytics with T-SQL.**

Avoid:

**In the exciting world of Microsoft Fabric, warehouses provide a powerful and flexible way to unlock the value of your enterprise data.**

No marketing language.

No fake enthusiasm.

No anthropomorphizing unless it genuinely clarifies an interaction.

Use concise labels.

Inspector explanation paragraphs should usually be two to four sentences at most before progressive disclosure.

---

# 73. Terminology

Use current Microsoft terminology exactly when referring to technical objects.

Examples:

- OneLake
- Lakehouse
- Warehouse
- Eventhouse
- Real-Time Hub
- semantic model
- SQL analytics endpoint
- Direct Lake
- DirectQuery
- Import
- calculation group
- field parameter
- deployment pipeline
- PBIP
- XMLA endpoint

Do not casually invent synonyms that could confuse exam preparation.

---

# 74. Handling preview and changing Fabric features

Fabric evolves rapidly.

Some features such as PBIP may have preview/current-state caveats.

Do not turn current implementation details into timeless truth.

Content objects may include:

```ts
status: "stable" | "preview" | "changing";
verifiedDate: "2026-08-31";
```

If documentation changes later, content should be editable without refactoring the lab architecture.

---

# 75. First implementation scope

Do **not** try to build all labs immediately.

The first implementation should establish the design language and simulation architecture.

Build these first:

### 1. Application shell

Functional:

- routing
- top nav
- inspector
- responsive behavior
- global styling
- basic local progress state

### 2. Fabric Atlas

Functional simplified architecture.

Select nodes.

Inspector updates.

Trace one sales-data path.

Support Data Flow and Query Path views.

### 3. Data Store Lab

Functional Lakehouse/Warehouse/Eventhouse comparison.

Changing workload characteristics changes the explanation and architecture fit.

### 4. Schema Lab

Functional small source table.

Allow fields to move into dimensions/fact.

Show grain.

Show relationships.

Provide reset.

### 5. Relationship Lab

Functional filter propagation.

Single/both direction toggle.

Many-to-many bridge scenario.

### 6. DAX Microscope prototype

Implement only:

- SUM
- CALCULATE
- SUMX
- ALL

But implement them extremely well visually.

### 7. Direct Lake prototype

Implement:

- Direct Lake on OneLake path
- column/cache visualization
- first/second query
- change data
- framing refresh
- SQL endpoint variant
- one deterministic fallback scenario

### 8. Exam Map

Map official current objectives to built and planned labs.

This is enough to validate the core product.

---

# 76. Phase 2

Once Phase 1 is solid:

- Transformation Workbench
- Query Rosetta
- SCD Time Machine
- Storage Mode Lab expansion
- Incremental Refresh
- Security Lens
- Performance Lab

---

# 77. Phase 3

Then:

- Governance
- Lifecycle
- PBIP
- XMLA
- Lineage
- calculation groups
- field parameters
- composite models
- large semantic models
- reusable assets
- richer Real-Time Hub/Eventhouse content

---

# 78. Do not use quizzes as scaffolding

Even during development, do not use quiz cards as placeholders.

If a lab is not ready, show:

**Coming later**

with the concept map.

Do not fill the gap with multiple-choice questions.

A future optional exam-practice mode could exist, but it is not the product's identity and should not influence the initial architecture.

---

# 79. No fake gamification

Do not add:

- XP
- points
- hearts
- streak flames
- levels
- daily quests
- leaderboards
- badges for clicking around

The intrinsic reward should be understanding the system.

Progress should behave like a map uncovered through exploration.

Possible visualization:

Unseen concept:
muted

Explored:
normal

Manipulated:
small interaction marker

Revisited:
small history indicator

Keep this subtle.

---

# 80. The progress screen

If implemented, call it something like:

**Your map**

not:

**Your score**

Show concepts spatially.

Example:

```text
OneLake                  explored
Lakehouse                explored
Warehouse                explored
Eventhouse               unseen

Star schema              manipulated
Relationships            manipulated
DAX filter context       explored
Calculation groups       unseen

Direct Lake              manipulated
Incremental refresh      unseen
```

Allow:

**Continue exploring**

**Show unexplored**

**Show DP-600 objective coverage**

Do not claim likelihood of passing.

---

# 81. Microlearning without fragmentation

Labs should support short sessions, but avoid chopping concepts into arbitrary “5-minute lessons.”

A user can spend:

2 minutes inspecting Import vs DirectQuery

or

30 minutes experimenting with DAX.

The same lab should accommodate both.

Use optional depth.

---

# 82. Contextual recommendations

At the end or side of an interaction, recommend only highly related paths.

After Direct Lake:

**Related**
- Storage modes
- OneLake
- Semantic model performance

After many-to-many:

**Related**
- Bridge tables
- Star schema
- Filter direction

Do not show generic “Next lesson.”

---

# 83. Examples of excellent interaction feedback

When learner switches Import → DirectQuery:

> The query path now reaches the source instead of relying entirely on imported model data.

When learner sets relationship to Both:

> Filters can now propagate in both directions across this relationship. Watch the highlighted filter path expand.

When learner applies `ALL(DimProduct)`:

> The product filter has been removed from the evaluation context. Region remains active.

When learner chooses SCD Type 1:

> The existing customer row is updated. Historical reports now see Bergen for this customer unless history exists elsewhere.

When learner refreshes incremental model:

> Recent partitions were refreshed. Historical partitions were left unchanged.

When Direct Lake SQL-endpoint scenario falls back:

> This query is now being executed through DirectQuery against the SQL analytics endpoint rather than the normal Direct Lake path.

This is the tone.

---

# 84. Examples of bad feedback

Do not write:

> Great job! You nailed it!

Do not write:

> Oops! That's not quite right!

Do not write:

> Amazing! You just earned 50 XP!

Do not write:

> Incorrect. Try again.

This is not a children's quiz.

---

# 85. Handling wrong or risky configurations

The sandbox may allow technically problematic setups.

Do not block every mistake.

Example:

user creates bidirectional path.

Instead of preventing it:

allow it

then expose:

**Ambiguous filter path**

Show the actual path.

This makes the problem visible.

Only block states that make the simulation impossible to interpret.

---

# 86. Tooltips

Use tooltips sparingly.

Useful:

Hover/focus a relationship cardinality symbol:

**One-to-many**

Not useful:

A 200-word explanation hidden inside hover.

Essential explanations belong in the inspector.

---

# 87. Empty states

Every empty state should tell the learner what manipulation is available.

Bad:

**No selection**

Better:

**Select a table to inspect its grain and relationships.**

Bad:

**Nothing here**

Better:

**Choose a filter above to trace how it propagates through the model.**

---

# 88. Error states

If a simulation reaches an invalid configuration:

show the problem in context.

Example:

**Duplicate dimension key**

Highlight duplicated values.

Then:

> A one-side relationship requires unique key values in this scenario.

Do not show a generic toast only.

---

# 89. Mobile interaction examples

Schema Lab desktop:

drag fields between tables.

Schema Lab mobile:

tap field
→ action sheet
→ **Move to DimProduct**

DAX desktop:

model and evaluation panel side-by-side.

DAX mobile:

model
then expression
then current evaluation state
with sticky Step controls.

Atlas desktop:

whole system.

Atlas mobile:

horizontal/vertical focused path with **Show neighbors**.

---

# 90. Core Web Vitals and animation discipline

Never animate layout properties for large elements if transform/opacity can express the same instructional transition.

Avoid layout shift when inspector content changes.

Reserve panel dimensions where appropriate.

Do not load syntax editors or advanced lab code on homepage.

Use code splitting by lab route.

---

# 91. Data tables

Interactive tables are central teaching objects.

Build a strong reusable DataTable component supporting:

- selected rows
- active rows
- filtered-out rows
- current evaluation row
- key columns
- hidden columns
- disabled columns
- column type
- small annotations

But do not overengineer it into a general spreadsheet.

This is an educational visualization primitive.

---

# 92. Relationship edges

Relationship edges should visually encode:

- active/inactive
- one/many
- filter direction
- selected
- propagating filter
- warning

Do not use six colors alone.

Example:

```text
1 ─────────▶ *
```

Bidirectional:

```text
1 ◀────────▶ *
```

Inactive:

dashed.

Filter propagation:

temporary moving/highlight state plus static destination indication.

---

# 93. Query paths

Create one shared path language.

Example:

normal path:
solid

fallback:
distinct dashed path with label

refresh:
different icon/operation state

Do not invent unrelated path styles for each lab.

When users later encounter Direct Lake, they should recognize the same query-path language used in Fabric Atlas.

---

# 94. State legend

Every lab with nontrivial visual state should have a compact legend.

Example DAX:

```text
● active row
○ filtered row
▣ current row context
→ filter propagation
```

Do not assume the user understands arbitrary colors.

Allow legend collapse only after it has been visible.

---

# 95. Consistency across labs

The same object should look like the same object everywhere.

`FactSales` should retain:

- table visual style
- table icon
- category
- key field notation

OneLake should use consistent storage-layer encoding.

Semantic models should be recognizable.

This is important for building a unified mental model.

---

# 96. Content update tooling

Eventually add a development-only validation command:

```text
npm run validate:content
```

It should check:

- every concept references existing objective IDs
- every objective references valid domain
- every lab references existing concepts
- every source ID exists
- no duplicate IDs
- every published lab has at least one objective
- every current exam objective is mapped somewhere

This prevents silent exam coverage gaps.

---

# 97. Coverage report in development

Generate a developer report:

```text
DP-600 coverage

Maintain               12/12 mapped
Prepare                 18/18 mapped
Semantic models         14/14 mapped

Interactive             21
Planned                 23
Unmapped                 0
```

This is for development.

Do not expose it as a learner “score.”

---

# 98. Research-update workflow

Because Fabric changes quickly:

Create documentation:

`docs/content-maintenance.md`

Explain:

1. Check current DP-600 study guide.
2. Compare blueprint effective date.
3. Update objective registry.
4. Run coverage validator.
5. Review current Microsoft docs for affected concepts.
6. Update `verifiedDate`.
7. Add or update simulations if behavior changed.

This makes the website maintainable after the exam changes.

---

# 99. README

README should explain:

**What this is**

An interactive DP-600 learning environment.

**What it is not**

Not affiliated with Microsoft.
Not a replacement for official documentation.
Not an exam dump.
Not a question bank.

**Architecture**

React/TypeScript/Vite static application.

**Development**

install
run
test
build

**Content model**

concepts
exam objectives
sources
labs

**Deployment**

GitHub Pages via Actions.

---

# 100. Independence and trademark restraint

Microsoft Fabric terminology must be used accurately.

Do not imply Microsoft sponsorship or endorsement.

Do not call this an “official” DP-600 site.

Avoid copying Microsoft Fabric product UI pixel-for-pixel.

Avoid copying copyrighted diagrams verbatim.

Create original diagrams illustrating technical architecture.

Use textual product names where needed.

---

# 101. Initial source material to verify during implementation

Treat Microsoft's current DP-600 study guide as primary authority for exam coverage.

Then use topic-specific current Microsoft Learn documentation for behavior.

The build should specifically verify current documentation for:

- OneLake
- Lakehouse
- Warehouse
- Eventhouse
- Real-Time Hub
- Direct Lake
- semantic model storage modes
- composite models
- dimensional modeling
- relationships
- DAX
- incremental refresh
- model security
- OneLake security
- lifecycle
- PBIP
- deployment pipelines
- XMLA

Do not rely on random certification blogs where authoritative Microsoft documentation exists.

Community explanations may inspire teaching techniques, but technical truth should come from primary documentation.

---

# 102. Phase 1 design acceptance criteria

The first usable version succeeds only if all of the following are true.

## Homepage

A new learner can understand within seconds that the page depicts a Fabric analytics system.

They can select at least:

- Lakehouse
- Warehouse
- Eventhouse
- OneLake
- Semantic model

Selecting them changes visible state and Inspector content.

## Atlas

A learner can trace:

**source → storage → semantic model → report**

They can switch to query path.

## Data stores

A learner can change workload properties and observe why a storage choice becomes more or less suitable.

## Schema

A learner can manipulate table structure and visibly build a star schema.

They can inspect grain.

## Relationships

A learner can apply a filter and watch it propagate.

They can change direction.

They can inspect a bridge-table scenario.

## DAX

A learner can step through at least:

- SUM
- CALCULATE
- SUMX
- ALL

Rows and filter state visibly correspond to the calculation.

## Direct Lake

A learner can distinguish:

- Import
- DirectQuery
- Direct Lake

and can visually understand the Direct Lake query path.

They can see the difference between Direct Lake on OneLake and the SQL-endpoint variant in the curated scenario.

## Exam coverage

Every implemented lab maps to current DP-600 objectives.

## Accessibility

Core workflows work:

- keyboard
- mouse
- touch
- reduced motion

## Responsive

No core workflow is unusable on a 320px-wide layout.

## Deployment

Production GitHub Pages build succeeds.

---

# 103. What quality means

Do not judge success by number of pages.

Five excellent interactive systems are better than fifty shallow cards.

A lab is “good” when the learner can say:

> I can see why that happens now.

A lab is weak when the only thing the learner can say is:

> I clicked through information.

Prioritize conceptual clarity over breadth during early development.

---

# 104. Immediate Codex work order

Start now in this order.

## Step 1: inspect the repository

Before changing anything:

- inspect existing files
- inspect package.json if present
- inspect current build tooling
- inspect existing GitHub Actions
- inspect Pages configuration assumptions
- inspect current styling conventions

Do not destroy an existing project structure without reason.

If the repository is empty/new, initialize the recommended Vite + React + TypeScript project.

## Step 2: establish application foundation

Implement:

- TypeScript strict mode
- Vite
- routing
- CSS design tokens
- responsive AppShell
- Inspector
- minimal source/content registries
- local persistence utility
- test infrastructure

## Step 3: add real DP-600 content structure

Create:

- current exam metadata
- objective IDs
- initial concept registry
- source registry
- first shared Aurora dataset

Do not fill the UI with placeholder lorem ipsum.

Use real concept names from the start.

## Step 4: build the Fabric Atlas

This is the first real product surface.

Required nodes:

- Sources
- OneLake
- Lakehouse
- Warehouse
- Eventhouse
- Semantic model
- Report

Required interactions:

- node selection
- Inspector
- data flow
- query path
- reset
- responsive layout
- keyboard selection

Make this polished enough to establish the design language.

## Step 5: build Data Store Lab

Implement meaningful workload manipulation.

Avoid answer-checking.

## Step 6: build Schema Lab

Use Aurora data.

Allow actual structural manipulation.

Show grain and relationships.

## Step 7: build Relationship Lab

Reuse resulting conceptual star schema.

Implement deterministic filter propagation.

## Step 8: build DAX Microscope

Build a small explicit simulation engine rather than fake animations.

Each visual state must correspond to a deterministic evaluation step.

## Step 9: build Direct Lake Engine Room

Use current documented behavior.

Do not generalize beyond what the documentation supports.

## Step 10: build Exam Map

Render objective-to-concept/lab mappings from data.

## Step 11: test and deploy

Run:

- lint
- typecheck
- unit tests
- browser tests
- accessibility checks
- production build

Configure GitHub Pages Actions workflow.

---

# 105. Do not stop at scaffolding

The first work session should not end with only:

- Vite initialized
- empty routes
- placeholder cards

After establishing foundation, implement at least the first meaningful interactive Atlas experience.

The repository should end the first substantial pass with something that already demonstrates the product thesis.

---

# 106. Do not overbuild the abstraction layer first

Avoid spending the first several hours designing:

- universal visualization DSL
- giant graph engine
- highly generic lab plugin architecture
- abstract state-machine framework

Build two or three concrete interactions.

Then extract stable patterns.

The product's hard problem is educational interaction design, not framework architecture.

---

# 107. Questions Codex should resolve through implementation rather than asking the user

Use judgment for:

- exact neutral palette
- spacing scale
- border radius
- icon library
- precise breakpoint values
- minor typography choices
- internal component names
- exact test organization

Do not stop work for those.

Preserve the core requirements in this brief.

---

# 108. Questions that should not be silently reinterpreted

The following are non-negotiable product requirements:

- GitHub Pages compatible
- static client-side app
- DP-600 current scope
- interactive learning through visuals
- not quiz-centric
- no flashcards
- no fake gamification
- free exploration
- one coherent conceptual Fabric world
- progressive disclosure
- cause-and-effect interactions
- strong accessibility
- responsive design
- source-grounded technical behavior

Do not replace this with a conventional LMS because it is easier to implement.

---

# 109. North-star example

Imagine the learner opens the application because they still do not understand Direct Lake.

They search:

**Direct Lake**

They arrive at the Engine Room.

They see:

```text
Delta tables
    ↓
OneLake
    ↓
Semantic model
    ↓
Report
```

They run a query.

Only required columns visibly move into the model's in-memory query representation.

They run another query.

Some columns are reused.

They switch to Direct Lake on SQL endpoint.

They deliberately introduce a curated fallback condition.

The query path reroutes through DirectQuery.

They select **Why?**

The Inspector explains the current documented behavior.

They select **Compare with Import**.

The screen splits.

Import shows a refresh/copy path.

Direct Lake shows the OneLake-backed path.

They click **Semantic model** in the diagram.

The Map shows:

Direct Lake
→ storage modes
→ semantic models
→ performance
→ OneLake

They open Storage Modes.

No question was asked.

No point was awarded.

No flashcard appeared.

But the user now has a much stronger mental model.

That is the product.

---

# 110. Second north-star example

The learner cannot understand why `CALCULATE` feels so different from `SUM`.

Open DAX Microscope.

The screen displays:

`DimProduct`

`FactSales`

and:

```DAX
Total Bike Sales =
CALCULATE(
    [Total Sales],
    DimProduct[Category] = "Bike"
)
```

Press **Step**.

Screen says:

**Existing filter context**

The active Region filter is visible.

Press **Step**.

**CALCULATE modifies filter context**

A `Category = Bike` chip appears.

Press **Step**.

**Filter propagates through relationship**

Matching rows in FactSales remain bright.

Others fade.

Press **Step**.

**Measure evaluates**

The contributing Revenue cells highlight.

Result appears.

Then the user chooses:

**Remove product filters with ALL**

The category filter visibly disappears.

The fact table expands.

Result changes.

Again:

No quiz.

The mechanism became visible.

That is the standard every abstract concept should aim for.

---

# 111. Third north-star example

The learner sees “many-to-many” in the study guide but does not understand why bridge tables exist.

Relationship Lab begins with:

```text
Customer
Account
Balance
```

Customer and Account are many-to-many.

A direct relationship creates an unclear model.

The learner selects:

**Introduce bridge**

A `CustomerAccount` bridge appears.

Relationships redraw.

Select Customer 101.

The filter path:

Customer
→ CustomerAccount
→ Account
→ FactBalance

lights up.

The table rows update.

The learner can now **see the bridge carrying the filtering relationship**.

Only after that should the Inspector provide the terminology.

That is the teaching order:

**experience → observe → name → inspect nuance**

not:

**definition → memorization → quiz**

---

# 112. Final product rule

Whenever choosing between:

**more content**

and

**a clearer interactive explanation**

choose the clearer interactive explanation.

Whenever choosing between:

**a clever animation**

and

**a precise causal visualization**

choose the causal visualization.

Whenever choosing between:

**exam trivia**

and

**a durable mental model that also answers the exam question**

choose the durable mental model.

Build the site so that DP-600 feels like one understandable system rather than a certification syllabus.