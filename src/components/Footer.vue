<template>
    <div class="background">
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-12">
                    <div class="containerFooter1">
                        <div class="divLogo">
                            <img class="logo" src="../assets/Diamond-jewelry-logo-design-premium-Graphics-14779073-1-1-580x387.jpg" alt="">
                            <h3>Laboratório de Geografia da Faculdade Xing Ling</h3>
                        </div>
                        <div class="divPremios">
                            <img class="premio" src="../assets/tild3964-3837-4466-b437-646561666634__holoniq-2023_1.png" alt="">
                            <img class="premio" src="../assets/tild6630-3339-4361-a138-363835666536__exame.png" alt="">
                        </div>
                        <div class="divPrivacidade">
                            <a class="politica" href="#">Política de Privacidade e Contrato de Prestação de Serviço</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-12">
                    <div class="containerContato">
                        <div class="divContato">
                            <h4 class="contato">whatsApp</h4>
                            <a href="#"  class="infoContato">+55 (55) 99999-9999</a>
                        </div>
                        <div class="divContato">
                            <h4 class="contato">Telefone</h4>
                            <a href="#"  class="infoContato">+55 (55) 99999-9999</a>
                        </div>
                        <div class="divContato">
                            <h4 class="contato">E-mail</h4>
                            <a href="#" class="infoContato">suporte@xingling.com.br</a>
                        </div>
                    </div>
                    <div class="divEndereco">
                        <p class="politica">Faculdade Xing Ling Ltda.<br>Rua xing ling da silva, 123, centro, CEP 99999-999, Xang Gai</p>
                    </div>
                </div>
                <div class="col-md-4 col-12">
                    <div class="divSocialMedia">
                        <a href="#"><img class="socialMedia" src="../assets/socialMedia/instagram.svg" alt=""></a>
                        <a href="#"><img class="socialMedia" src="../assets/socialMedia/facebook.svg" alt=""></a>
                        <a href="#"><img class="socialMedia" src="../assets/socialMedia/youtube.svg" alt=""></a>
                        <a href="#"><img class="socialMedia" src="../assets/socialMedia/logotipo-do-linkedin.svg" alt=""></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FooterComponent'
}
</script>

<style scoped>
.background {
    background: #22053D;
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
    border-radius:15px;
}

.divLogo, .divPremios {
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
    color: #817090;
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
    .divLogo h3[data-v-40ab164b] {
        font-size: 1rem;
    }

    .infoContato[data-v-40ab164b] {
        font-size: 1.1rem;
    }
}

@media (max-width: 1024px) {
    .divSocialMedia[data-v-40ab164b] {
        gap: 1.5rem;
    }

    .containerFooter1, .divPrivacidade {
        width: auto;
    }

    .divLogo h3[data-v-40ab164b] {
        font-size: 0.9rem;
    }

    .contato[data-v-40ab164b] {
        font-size: 1rem;
    }

    .infoContato[data-v-40ab164b] {
        font-size: 1rem;
    }

    .socialMedia[data-v-40ab164b] {
        width: 35px;
    }
}

@media (max-width: 767px) {
    .containerFooter1[data-v-40ab164b], .divPrivacidade[data-v-40ab164b] {
        width: auto;
    }

    .divPremios[data-v-40ab164b] {
        margin-left: auto;
        gap: 5rem;
    }
}
</style>

