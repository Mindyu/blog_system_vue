<template>
  <div class="about-wrapper">
    <h2 class="list-title">张春晖</h2>
    <p>个人博客前台页面</p>
    <a>基于SprigBoot+Vue的个人博客系统</a>
  </div>
</template>

<script>

</script>
<style>
  .about-wrapper {
    width: 80%;
    padding: 1rem;;
  }

  .about-wrapper p, .about-wrapper h2, .about-wrapper a {
    margin: 1rem auto;
  }

  .about-wrapper p {
    font-size: 1.8rem;
  }
  .sentence{
    font-size: 1.5rem;
  }
  @media screen and (max-width: 768px) {
    .about-wrapper p {
      font-size: 1.6rem;
    }

  }
</style>
