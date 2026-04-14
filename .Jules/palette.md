## 2024-05-18 - Improve Form Label Associations
**Learning:** Found multiple instances of forms where `label` elements were visually grouped with `input`/`textarea` elements but lacked programmatic association via the `htmlFor` and `id` attributes. This is a common accessibility issue that impairs screen reader experiences.
**Action:** Always ensure that every form input field is explicitly tied to its `label` using `id` and `htmlFor` to enhance accessibility and standard UX.
