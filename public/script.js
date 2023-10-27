document.addEventListener("DOMContentLoaded", function() {
  const teleportContainer = document.getElementById("teleportContainer");

  function createTeleportingElement() {
    const teleportItem = document.createElement("img");
    teleportItem.src = './wizard.gif'; // GIF dosyasının yolunu belirtin
    teleportItem.classList.add("teleport-item");
    teleportContainer.appendChild(teleportItem);

    const randomX = Math.floor(Math.random() * (window.innerWidth - 50));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 50));

    teleportItem.style.left = randomX + "px";
    teleportItem.style.top = randomY + "px";

    setTimeout(() => {
      teleportContainer.removeChild(teleportItem);
      createTeleportingElement(); // Yeniden oluştur
    }, 2000);
  }

  // İlk GIF'i oluştur
  createTeleportingElement();
});
