<template>
  <main>
    <h1>CPRG-312 Portfolio</h1>

    <nav>
      <RouterLink to="/profile">Profile</RouterLink>
      <RouterLink to="/skills">Skills</RouterLink>
      <RouterLink to="/projects">Projects</RouterLink>
      <RouterLink to="/health">Health</RouterLink>
    </nav>

    <RouterView />
  </main>
</template>

<style scoped>
nav {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

a {
  color: #2563eb;
  text-decoration: none;
}

.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
