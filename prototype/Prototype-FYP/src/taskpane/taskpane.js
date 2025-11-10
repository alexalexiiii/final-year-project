/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;
  }
});

export async function run() {
 const noteWindow = document.getElementById('noteWindow');
  const noteWindowHeader = document.getElementById('noteWindowHeader');
  const noteIcon = document.getElementById('icon-heart');

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  noteWindowHeader.addEventListener('mousedown', (e) => {
    isDragging = true;

    const rect = noteWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // Bring window to front
    noteWindow.style.zIndex = 9999;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      // Optional: keep window inside viewport
      const maxLeft = window.innerWidth - noteWindow.offsetWidth;
      const maxTop = window.innerHeight - noteWindow.offsetHeight;

      if (newLeft < 0) newLeft = 0;
      else if (newLeft > maxLeft) newLeft = maxLeft;

      if (newTop < 0) newTop = 0;
      else if (newTop > maxTop) newTop = maxTop;

      noteWindow.style.left = newLeft + 'px';
      noteWindow.style.top = newTop + 'px';
    }
  });
}
