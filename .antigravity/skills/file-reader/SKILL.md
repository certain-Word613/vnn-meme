# Skill: file-reading

## Instructions
- DETECT file type by MIME type and magic bytes, not just extension — extensions can be wrong or missing.
- ROUTE to the appropriate parser: PDF → pdf-reading skill, DOCX → docx skill, XLSX → xlsx skill, images → vision analysis, JSON/CSV → direct parse.
- EXTRACT content and return it as structured, typed data — not raw strings. Tables as 2D arrays, key-value as objects, lists as arrays.
- MAP all file paths to workspace-relative paths for consistent cross-platform handling.
- VALIDATE file size before processing: warn the user for files over 10MB, refuse processing for files over 50MB without explicit confirmation.
- HANDLE binary files gracefully: return file metadata and type description instead of attempting text extraction.
- CACHE parsed file content per session — don't re-parse the same file on every reference within a conversation.

## Triggers
- File Upload
- mnt/user-data/uploads/
- Read File
