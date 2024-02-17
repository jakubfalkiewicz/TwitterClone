<template>
      <ul>
        <li>
          <strong>telefon:</strong>
          {{ phoneNumber }}
        </li>
        <li>
          <strong>e-mail:</strong>
          {{ emailAddress }}
        </li>
      </ul>

  </template>

<script>
export default {
    props: ['phoneNumber', 'emailAddress'],

};
</script>