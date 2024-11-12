<template>
    <div class="container containerHome">
      <div class="row">
        <div class="col-md-6">
          <div class="imageBox">
            <img :src="imagem1" alt="">
            <img :src="imagem2" alt="">
            <img :src="imagem3" alt="">
            <img :src="imagem4" alt="">
          </div>
        </div>
        <div class="col-md-6">
            <h1><span>Geophotography:</span> Capturing the Earth’s Natural Beauty</h1>
            <p>Geophotography is the art of capturing images of the Earth’s surface in order to capture its beauty and share it with others.
            It can range from simple snapshots taken with a smartphone to complex shots taken with expensive equipment by professionals who have spent years mastering their craft.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import img1 from '@/assets/images-_1_.svg';
  import img2 from '@/assets/images-_2_.svg';
  import img3 from '@/assets/images-_3_.svg';
  import img4 from '@/assets/images-_4_.svg';
  
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
    .containerHome {
        margin: 3rem auto;
    }

    .imageBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        flex-direction: row;
        gap: 2rem;
        border-radius: 10px;
        background: navajowhite;
        padding: 0.5rem;
    }

    .imageBox img {
      width: 290px;  
      height: 290px;
    }

    h1 {
        font-size: 4rem;
        margin-bottom: 2rem;
        font-weight: 700;
        color: brown;
        letter-spacing: 2px;
    }

    span {
        color: #212121;
        margin-bottom: 2rem;
    }

    p {
        line-height: 2;
        font-size: 1.4rem;
    }
  </style>
  