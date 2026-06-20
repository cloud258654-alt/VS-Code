function playJellyAnimation(element) {
  element.classList.remove("jelly-animate");
  void element.offsetWidth;
  element.classList.add("jelly-animate");
}

function triggerHeartParticles(element) {
  var rect = element.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var count = 7 + Math.floor(Math.random() * 5);

  var symbols = ["\u2764\uFE0F", "\u2764\uFE0F", "\u2764\uFE0F", "\u2728", "\u2728", "\u{1F4A0}"];

  for (var i = 0; i < count; i++) {
    var particle = document.createElement("span");
    particle.className = "heart-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    var angle = Math.random() * Math.PI * 2;
    var dist = 35 + Math.random() * 55;
    var dx = Math.cos(angle) * dist;
    var dy = -(50 + Math.random() * 50);
    var rotation = (Math.random() - 0.5) * 90;

    particle.style.left = cx + "px";
    particle.style.top = cy + "px";
    particle.style.fontSize = (18 + Math.random() * 14) + "px";
    particle.style.setProperty("--hx", (dx * 0.5) + "px");
    particle.style.setProperty("--hx2", dx + "px");
    particle.style.setProperty("--hr", (rotation * 0.5) + "deg");
    particle.style.setProperty("--hr2", rotation + "deg");
    particle.style.animationDuration = (0.6 + Math.random() * 0.5) + "s";
    particle.style.animationDelay = Math.random() * 0.2 + "s";

    document.body.appendChild(particle);
    particle.addEventListener("animationend", function () {
      particle.remove();
    });
  }
}
