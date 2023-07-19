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
  border-radius: 5px;
  margin-right: 15px;
  color: #333;
  padding: 5px;

  &:last-child {
    margin-right: 0;
  }
}
</style>
