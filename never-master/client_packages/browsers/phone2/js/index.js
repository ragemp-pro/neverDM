document.addEventListener("DOMContentLoaded", () => {
  const screen = document.querySelector('.screen');
  const was27alks = document.querySelector('.was27alks');

  const welcomeContent = document.getElementById("welcome");
  const menuContent = document.getElementById("menu");
  const swipeText = document.getElementById("swipe-text");
  const close = document.getElementById("close");

  screen.addEventListener("click", () => {
      welcomeContent.classList.add("slide-up");
      swipeText.classList.add("slide-up");
      was27alks.classList.add("slide-up");
      close.classList.add("slide-up");

      setTimeout(() => {
          welcomeContent.style.display = "none";
          swipeText.style.display = "none";
          was27alks.style.display = "none";
          close.style.display = "none";

          menuContent.style.display = "block"; 
          menuContent.classList.add("fade-in"); 

      }, 300); 
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const garageApp = document.getElementById("garage-app");
  const bankApp = document.getElementById("bank-app");
  const menuContent = document.getElementById("menu");
  const garageContent = document.getElementById("garage-content");
  const bankContent = document.getElementById("bank-content");
  const screen = document.querySelector(".screen");

  garageApp.addEventListener("click", () => {
      menuContent.classList.add("fade-out");
      mp.trigger('loadGarageCars::CEF');
      setTimeout(() => {
          menuContent.style.visibility = "hidden";
          menuContent.style.opacity = "0";
          garageContent.style.visibility = "visible";
          garageContent.style.opacity = "1";
          garageContent.classList.add("fade-in");

          screen.classList.add("garage-background");
      }, 300);
  });

  bankApp.addEventListener("click", () => {
      menuContent.classList.add("fade-out");
      mp.trigger('loadTopRichPlayers');
      mp.trigger('loadPlayerMoney');
      setTimeout(() => {
          menuContent.style.visibility = "hidden";
          menuContent.style.opacity = "0";
          bankContent.style.visibility = "visible";
          bankContent.style.opacity = "1";
          bankContent.classList.add("fade-in");

          screen.classList.add("bank-background");
      }, 300);
  });


  const transferButton = document.getElementById("transfer-button");
  transferButton.addEventListener("click", () => {
      const amount = parseInt(document.getElementById("amount").value);
      const recipientId = parseInt(document.getElementById("static-id").value);

      if (isNaN(amount) || isNaN(recipientId)) {
          alert("Пожалуйста, введите корректные данные");
          return;
      }

      mp.trigger('transferMoney', recipientId, amount);
  });
});