# To Be Confirmed Register

**Status:** Open discovery items; no inferred answer is approved.

| ID | Question / unknown | Why it matters | Owner/input needed | Planning disposition |
|---|---|---|---|---|
| TBC-001 | Is there a dedicated automation/staging environment, and may the public playground be used for repeatable test runs? | Controls safety, test data, reliability, and CI target. | Application owner | Block state-changing automation until confirmed. |
| TBC-002 | What is the approved test account lifecycle and secret source? | Required for authenticated journeys without exposing credentials. | Application/test environment owner | Use only an authorized identity from secret storage; never copy the on-page credential hint. |
| TBC-003 | What are invalid and empty sign-in outcomes, lockout rules, and validation copy? | Defines negative authentication assertions and safe attempt limits. | Product owner | Do not assert exact messages or retry repeatedly. |
| TBC-004 | Does registration, password recovery, MFA, or profile management exist? | User/account scope is otherwise speculative. | Product owner | No scenarios or page objects until routes/features are confirmed. |
| TBC-005 | Are product details, product variants, stock status, or inventory states available? | Determines whether a product detail journey exists. | Product owner / UI inspection | No ProductPage until confirmed and approved. |
| TBC-006 | What are search matching rules (partial, case, whitespace, token order) and empty-result UX? | Needed for precise positive/negative search assertions. | Product owner / direct UI validation | Plan basic search; mark edge rules unresolved. |
| TBC-007 | What does the cart count represent: distinct products or total units? How do repeat-adds aggregate? | Prevents incorrect quantity/count expectations. | Product owner / direct safe validation | Isolate cart and confirm before parallel runs. |
| TBC-008 | Are filters cumulative? What do All/reset controls do? | Defines combined search/category/price scenarios. | Product owner / direct UI validation | Do not assume filter composition. |
| TBC-009 | Are price ranges inclusive/exclusive at each boundary, and how are currency/rounding/taxes handled? | Required for exact price and total assertions. | Product owner | Use observed prices only as data; no boundary invariant until confirmed. |
| TBC-010 | How is cart state scoped (browser context, session, user, shared backend), and what is the reset procedure? | Determines safe fixtures, cleanup, and worker count. | Application owner | Keep cart mutation serial and isolated; do not use orders as cleanup. |
| TBC-011 | What is the empty-cart UI and does Clear Cart require confirmation or support undo? | Needed for deterministic clear/empty-cart tests. | Product owner / safe UI validation | Do not assert specific empty copy yet. |
| TBC-012 | Can quantity be edited or individual items removed? | Affects cart management scope. | UI discovery / product owner | No controls were observed in the available cart snapshot. |
| TBC-013 | What does Place Order do, and does it persist data, invoke payment, or create external side effects? | Potentially destructive or irreversible. | Product/security owner | Never click in discovery; defer test until explicit safe environment and approval. |
| TBC-014 | Is there an order confirmation, order history, or cancellation/reset process? | Required for end-to-end order lifecycle. | Product owner | No route or behavior confirmed. |
| TBC-015 | Is there a supported public API contract, auth method, and test-data setup/cleanup interface? | Needed before API test design. | API owner | No endpoint inference from UI/internal network traffic. |
| TBC-016 | What are the detailed expected behaviors of Table, Dropdown, Alerts & Windows, Frame, Form, Calender, and Mouse Actions? | Navigation is known, but exercise-specific requirements are not. | Product owner / route-by-route inspection | Plan only reachability until inspected. |
| TBC-017 | What browsers/mobile viewports are officially supported? | Defines final browser matrix. | Product owner | Start with Chromium as framework smoke baseline. |
| TBC-018 | What are availability, rate-limit, and test-data stability expectations for the public site? | Influences retry policy and CI suitability. | Application owner | Do not interpret transient failures as application behavior without evidence. |

## Approval Gate

These unknowns are not approvals. A human reviewer must resolve or explicitly accept each risk before promoting affected scenarios from `PENDING HUMAN APPROVAL` to `APPROVED`. Checkout/order scenarios require explicit environment and side-effect approval in addition to functional requirements.
