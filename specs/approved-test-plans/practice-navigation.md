# Practice Navigation Candidate Plan

> **Status: APPROVED — GENERATOR MAY USE THIS DEFINED SCOPE**  
> **Approver:** mr.reviewer  
> **Approval date:** 22 Nov 2026

## Objective and Scope

Verify reachability of observed practice-area links from authenticated `/home`. These scenarios do not assert category-specific business behavior. Shopping is excluded because its navigation is covered by `SHOP-001`.

**Priority:** P2 — navigation is useful breadth but secondary to sign-in and the core Shopping path.  
**Execution layer:** UI regression — exercise each destination independently after baseline sign-in smoke is stable.  
**Risk:** Low; read-only navigation  
**Shared precondition:** Authenticated session from a dedicated approved test identity. Current seed only opens `/` and does not provide this state.

## Candidate Scenarios

Each route is independent to avoid one failed navigation preventing coverage of the others.

| ID | Link | Expected route | Expected result | Evidence / limitation |
|---|---|---|---|---|
| `NAV-001` | Table | `/webTable` | Selected navigation opens the linked route and a page is rendered. | Link/path observed; page contents and table behavior To Be Confirmed (`TBC-016`). |
| `NAV-002` | Dropdown | `/dropDown` | Selected navigation opens the linked route and a page is rendered. | Link/path observed; options and behavior To Be Confirmed (`TBC-016`). |
| `NAV-003` | Alerts & Windows | `/alertsAndWindows` | Selected navigation opens the linked route and a page is rendered. | Link/path observed; dialog/window outcomes To Be Confirmed (`TBC-016`). |
| `NAV-004` | Frame | `/frame` | Selected navigation opens the linked route and a page is rendered. | Link/path observed; frame content and behavior To Be Confirmed (`TBC-016`). |
| `NAV-005` | Form | `/form` | Selected navigation opens the linked route and a page is rendered. | Link/path observed; fields, validation, and submission To Be Confirmed (`TBC-016`). |
| `NAV-006` | Calender | `/calender` | Selected navigation opens the linked route and a page is rendered. | Label spelling and link/path observed; date behavior To Be Confirmed (`TBC-016`). |
| `NAV-007` | Mouse Actions | `/mouseActions` | Selected navigation opens the linked route and a page is rendered. | Link/path observed; supported gestures/outcomes To Be Confirmed (`TBC-016`). |

## Scenario Detail (Shared)

- **Goal:** Ensure the authenticated home exposes reachable practice destinations.
- **Steps:** Start at `/home`; select one listed link; verify the URL matches its recorded destination and the browser renders a page.
- **Data:** Dedicated approved test identity; no other test data.
- **Cleanup:** Return to `/home` or close the context; no state mutation intended.
- **Expected result boundary:** Do not assert specific title, content, field, or interaction outcome until the page is directly inspected and requirements are confirmed.

## Source Consolidation

This plan consolidates `NAV-001` from the structured draft, `NAV-001` from the scenario catalog, `J-NAV-01` from the journey map, and duplicate `PRACTICE-001`. Draft navigation was split into seven independent scenario IDs. The Shopping link is covered by `SHOP-001`, not duplicated here.

## Approval Gate

Approval covers route reachability only. Detailed category test plans require further discovery and must not be inferred from labels alone.
