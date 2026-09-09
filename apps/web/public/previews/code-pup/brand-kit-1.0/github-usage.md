# GitHub PR usage

Publish `status/` to stable, public HTTPS image URLs on the brand site. Replace `ASSET_BASE_URL` below with that actual path after deployment. Never use private token URLs, local paths, or expiring signed links for public PR images.

```html
<img src="ASSET_BASE_URL/changes-requested.png" width="64" height="64" alt="">

## Verdict: Changes requested

**Validate input before parsing.**

Describe the observed behavior, consequence, and concrete fix here.

<details>
<summary>Evidence and scope</summary>

List only the checks actually performed, findings, and remaining limits.

</details>
```

The example is a layout template, not a finding about a real PR. The heading remains meaningful when images do not load. Keep counts, commands, file names, and evidence in native Markdown.

| Mark | Use when | Text fallback |
| --- | --- | --- |
| reviewing.png | A review is actually in progress | Reviewing |
| approved.png | An explicit approval has been recorded | Approved |
| changes-requested.png | The review requests changes | Changes requested |
| blocked.png | A named condition prevents progress | Blocked: reason |

The current Code Pup internal values `reviewed`, `paused`, `ignored`, and `skipped draft` do not directly map to all four verdict marks. Preserve their truthful wording. Do not map `reviewed` to `approved` without a separate explicit approval outcome.

Render one current status mark per section. Optional motion belongs only in the Verdict slot, at most one GIF per comment. Prefer a linked opt-in animation with the PNG visible by default; GitHub Markdown cannot guarantee automatic image-error or reduced-motion fallback logic. Do not insert JavaScript into comments.

Integration targets, verified during preparation: `src/review/walkthrough.ts` and `src/review/flavor.ts`. Preserve serialized state comments and `codepup:opt:*` markers. This delivery has not modified the renderer or published PR comments.
