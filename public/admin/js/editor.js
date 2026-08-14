const Editor = {
  init(textareaId) {
    return new SimpleMDE({
      element: document.getElementById(textareaId),
      spellChecker: false,
      status: false,
      toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen"]
    });
  }
};