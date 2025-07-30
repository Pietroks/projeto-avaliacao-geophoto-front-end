<template>
  <div class="background">
    <div class="container">
      <div class="row">
        <div class="col-md-5 col-12">
          <div class="containerFooter1">
            <div class="divLogo">
              <img class="logo" src="../assets/logo.png" alt="" />
              <h3>Laboratório de Geoiconografia e Multimídias - UNB</h3>
            </div>
            <div class="divPrivacidade">
              <a class="infoContato" href="#">Política de Privacidade e Contrato de Prestação de Serviço</a>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-12">
          <div class="containerContato">
            <p class="infoContato">LAGIM.</p>
          </div>
        </div>
        <div class="col-md-3 col-12">
          <div class="divSocialMedia">
            <a href="https://www.instagram.com/lagimunb/?igsh=cWVieGNwbXhjbjYx&utm_source=qr" target="_blank"
              ><img class="socialMedia" src="../assets/socialMedia/instagram.svg" alt=""
            /></a>
            <a href="https://www.youtube.com/user/LAGIM2011" target="_blank"
              ><img class="socialMedia youtube" src="../assets/socialMedia/youtube.svg" alt=""
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

.premio {
  width: 60px;
  height: 60px;
  border-radius: 15px;
}

.divLogo,
.divPremios {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.divLogo h3 {
  color: ghostwhite;
  font-size: 1.1rem;
  font-weight: 700;
}

.divPremios {
  margin-right: auto;
}

.divPrivacidade {
  width: 90%;
  margin-right: auto;
}

.politica {
  text-decoration: none;
  color: #817090;
  font-weight: 500;
  font-size: 0.9rem;
}

.containerContato {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contato {
  color: #817090;
  font-size: 1rem;
  font-weight: 600;
}

.infoContato {
  color: ghostwhite;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: 0.3s ease-in-out;
}

.infoContato:hover {
  color: #01313d;
}

.divSocialMedia {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2rem 0;
  align-items: center;
}

.socialMedia {
  width: 40px;
  height: 40px;
  transition: filter 0.3s ease, transform 0.3s ease;
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

  .containerFooter1,
  .divPrivacidade {
    width: auto;
    margin: 0rem;
    gap: 0rem;
  }

  .divLogo h3 {
    font-size: 1rem;
    margin-top: 1rem;
  }

  .contato {
    font-size: 1rem;
  }

  .infoContato {
    font-size: 1rem;
    margin-bottom: 0rem;
  }

  .socialMedia {
    width: 35px;
  }

  .divLogo,
  .divPremios {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 767px) {
  .containerFooter1,
  .divPrivacidade {
    width: auto;
  }

  .divPremios {
    margin-left: auto;
    gap: 5rem;
  }
}
</style>
