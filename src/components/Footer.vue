<template>
  <div class="background">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-12">
          <div class="containerFooter1">
            <div class="divLogo">
              <img class="logo" src="../assets/logo.webp" alt="" />
              <h3>Laboratório de Geoiconografia e Multimídias - UNB</h3>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-12">
          <div class="divSocialMedia">
            <a href="https://www.instagram.com/lagimunb/?igsh=cWVieGNwbXhjbjYx&utm_source=qr" target="_blank"
              ><img class="socialMedia" src="../assets/socialMedia/instagram.svg" alt="icone do instragram"
            /></a>
            <a href="https://www.youtube.com/user/LAGIM2011" target="_blank"
              ><img class="socialMedia youtube" src="../assets/socialMedia/youtube.webp" alt="icone do youtube"
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.background {
  background: #03b6e5;
}

.containerFooter1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  gap: 3rem;
  width: 75%;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 20px;
}

.divLogo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.divLogo h3 {
  color: ghostwhite;
  font-size: 1rem;
  font-weight: 700;
}

.divSocialMedia {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
  align-items: center;
}

.socialMedia {
  width: 40px;
  height: 40px;
  transition: filter 0.3s ease, transform 0.3s ease;
}

.youtube {
  width: 53px;
  height: auto;
}

.socialMedia:hover {
  filter: hue-rotate(240deg) brightness(0.7);
  transform: scale(1.1);
}

@media (max-width: 1536px) {
  .divLogo h3 {
    font-size: 1rem;
  }

  .infoContato {
    font-size: 1.1rem;
  }
}

@media (max-width: 1024px) {
  .divSocialMedia {
    margin: 0rem 0rem 1rem 0;
  }

  .containerFooter1 {
    width: auto;
    margin: 0rem;
    gap: 0rem;
  }

  .divLogo h3 {
    font-size: 1rem;
    margin-top: 1rem;
  }

  .socialMedia {
    width: 35px;
  }

  .divLogo {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 767px) {
  .containerFooter1 {
    width: auto;
  }
}
</style>
