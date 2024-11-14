<template>
  <div class="backgroundImg">
    <div class="container containerHome">
      <div class="row">
        <div class="col-12">
          <div class="divTitulo">
            <h1><span>Geophotography:</span></h1>
            <h2>Capturing the Earth’s Natural Beauty</h2>
          </div>
        </div>
        <div class="col-12">
          <div class="imageBox">
            <p>Geophotography is the art of capturing images of the Earth’s surface in order to capture its beauty and share it with others.
              It can range from simple snapshots taken with a smartphone to complex shots taken with expensive equipment by professionals who have spent years mastering their craft.</p>
          </div>
        </div>     
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import img1 from '@/assets/images-_1_.webp';
  import img2 from '@/assets/images-_2_.webp';
  import img3 from '@/assets/images-_3_.webp';
  import img4 from '@/assets/images-_4_.webp';
  
  export default {
    name: 'HomePage',
    data() {
      return {
        imagem1: img1,
        imagem2: img2,
        imagem3: img3,
        imagem4: img4,
      };
    }
  };
  </script>
  
  <style scoped>
  .backgroundImg {
    background-image: url('../assets/tim-stief-YFFGkE3y4F8-unsplash.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -11.4rem;
  }

    .containerHome {
        margin: 3rem auto;
    }
  
  .divTitulo {
    margin-bottom: 7rem;
    margin-top: 12rem;
  }

    .imageBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        flex-direction: row;
        gap: 1rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
    }

    .imageBox img {
      width: 290px;  
      height: 290px;
      border-radius: 10px;
    }

    h2 {
      font-size: 4rem;
      font-weight: 500;
      color: azure;
      letter-spacing: 10px;
      margin-top: 3rem;
    }

    span {
      color: #FF6F3C;
      letter-spacing: 20px;
      font-size: 5.5rem;
      font-weight: 300;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      border-radius: 20px
    }

    p {
        line-height: 2;
        font-size: 1.4rem;
    }
  </style>
  