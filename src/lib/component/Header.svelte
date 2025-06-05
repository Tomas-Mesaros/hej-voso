<script>

</script>

<header>
    <div class="spacer"></div>
    <div class="artist-info">
        <img class="profil-foto zoom-in" src="./img/Profil.jpg" alt="Fotka hudobného umelca Pata Rychnáka.">
        <h1 class="artist-name wave-line">
            <span style="--i:0">H</span>
            <span style="--i:1">e</span>
            <span style="--i:2">j</span>
            <span style="--i:3">-</span>
            <span style="--i:4">V</span>
            <span style="--i:5">o</span>
            <span style="--i:6">s</span>
            <span style="--i:7">o</span>
        </h1>
    </div>
    <div class="spacer"></div>
</header>

<style>
    header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 5px;
}

.spacer {
  flex: 1;
}

.artist-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
}

.profil-foto {
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
}

.artist-name {
  font-size: clamp(8vw, 10vw, 12vw);
  margin: 0;
}
/******** Animacie *********/
.zoom-in {
  opacity: 0;
  transform: scale(0.3);
  animation: zoomIn 1.5s ease-out forwards;
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.wave-line span {
  display: inline-block;
  animation: wave-letter 1.5s ease-in-out 2;
  animation-delay: calc(var(--i) * 0.1s);
}

@keyframes wave-letter {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Tablet */
@media (max-width: 1000px) {
  .profil-foto {
    width: 12vw;
    height: 12vw;
  }

  .artist-name {
    font-size: 12vw;
  }
}

/* Mobil */
@media (max-width: 570px) {
  header {
    flex-direction: column;
  }

  .artist-info {
    flex-direction: column;
    gap: 5px;
  }

  .profil-foto {
    width: 100px;
    height: 100px;
  }

  .artist-name {
    font-size: 50px;
    margin-top: 20px;
  }
}

</style>