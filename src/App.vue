<template>
  <div id="app">
    <header>
      <h1>Tamer's Bazaar</h1>
    </header>

    <nav>
      <ul>
        <li><router-link to="/">Cards</router-link></li>
        <li><router-link to="/collection">Collection</router-link></li>
        <li><router-link to="/decks">Decks</router-link></li>
      </ul>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin: 0 auto;
}

header {
  background-color: var(--color-bg-nav-active);
  color: var(--color-text);
  padding: 1rem 2rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
}

nav {
  background-color: var(--color-bg-nav);
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li a {
  display: block;
  padding: 1rem 2rem;
  transition: background-color 0.25s;
}

nav ul li a.router-link-active {
  background-color: var(--color-bg-nav-active);
}

nav ul li a:hover {
  background-color: #505f78;
}

main {
  flex: 1;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 1rem;
}
</style>
