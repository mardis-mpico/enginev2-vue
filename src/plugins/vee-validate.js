import Vue from "vue";
import moment from "moment";

import {
  extend,
  ValidationObserver,
  ValidationProvider,
  localize,
} from "vee-validate";
import {
  email,
  max,
  min,
  numeric,
  required,
  digits,
} from "vee-validate/dist/rules";

import es from "vee-validate/dist/locale/es.json";

extend("email", email);
extend("max", max);
extend("min", min);
extend("digits", digits);
extend("numeric", numeric);
extend("required", required);
extend("dateRange", {
  params: ["startDate"],
  validate: (value, { startDate }) => {
    var parseStart = new moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    var parseEnd = new moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
    if (
      !moment(parseStart).isBefore(parseEnd) ||
      moment(parseEnd).isSame(parseStart)
    ) {
      return false;
    }
    return true;
  },
  message: "La fecha de fin debe ser mayor a la fecha de inicio.",
});

extend("decimal", {
  validate: (value, { decimals = "*", separator = "." } = {}) => {
    if (value === null || value === undefined || value === "") {
      return {
        valid: false,
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === "*" ? "+" : `{1,${decimals}}`;
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
    );

    return {
      valid: regex.test(value),
    };
  },
  message: "El {_field_} debe ser un número entero o decimal",
});

localize("es", es);

Vue.component("validation-provider", ValidationProvider);
Vue.component("validation-observer", ValidationObserver);
