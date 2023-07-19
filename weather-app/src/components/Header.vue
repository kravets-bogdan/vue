<template>
  <header>
    <h1>Weather App</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/favorites">Favorites</router-link>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@import "../styles/media";

h1 {
  align-items: center;
  font-size: 22px;
  display: flex;
}

header {
  justify-content: space-between;
  background-color: silver;
  margin-bottom: 30px;
  display: flex;
  padding: 10px;
  height: 70px;
}

nav {
  justify-content: space-around;
  display: flex;
  padding: 10px;
}

a {
  background-color: white;
  text-transform: uppercase;
  text-decoration: none;
  align-items: center;
  border-radius: 5px;
  margin-right: 15px;
  color: #333;
  display: flex;
  padding: 5px;

  &:last-child {
    margin-right: 0;
  }

  @include media("<=tablet") {
    font-size: 12px;
  }
}
</style>
