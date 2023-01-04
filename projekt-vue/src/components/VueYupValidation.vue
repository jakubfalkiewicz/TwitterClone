<template>
  <form @submit.prevent="submit">
    <slot :errors="errors"></slot>
  </form>
</template>

<script>
import { isEqual } from "lodash";
import axios from "axios";
import { userStore } from "../store";

const store = userStore();

export default {
  data() {
    return {
      errors: {},
      oldValues: { ...this.values },
    };
  },
  name: "vue-yup-validation",
  props: {
    schema: {
      required: true,
      type: Object,
    },
    values: {
      required: true,
      type: Object,
    },
    validFieldOnChange: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  methods: {
    validate(field) {
      return this.schema
        .validateAt(field, this.values)
        .then(() => {
          this.errors[field] = "";
        })
        .catch((err) => {
          this.errors[field] = err.message;
        });
    },
    validateForm() {
      this.errors = {};
      return this.schema
        .validate(this.values, { abortEarly: false })
        .then(() => {
          return true;
        })
        .catch((err) => {
          err.inner.forEach((error) => {
            this.errors[error.path] = error.message;
          });
          return false;
        });
    },
    async submit(call) {
      console.log(call.target.action);
      if (await this.validateForm()) {
        if (call.target.action == `http://127.0.0.1:5173/register`) {
          await axios
            .post("http://localhost:4000/api/users/register", this.values)
            .then((res) => console.log(res.data));
        }
        if (call.target.action == `http://127.0.0.1:5173/login`) {
          await axios
            .post("http://localhost:4000/api/users/login", this.values)
            .then((res) => {
              console.log(res.data);
            });
        }
      }
    },
  },
  watch: {
    values: {
      handler() {
        if (!this.validFieldOnChange) {
          return;
        }
        for (const propriety of Object.keys(this.values)) {
          if (!isEqual(this.oldValues[propriety], this.values[propriety])) {
            this.validate(propriety);
          }
        }
        this.oldValues = { ...this.values };
      },
      deep: true,
    },
  },
};
</script>
