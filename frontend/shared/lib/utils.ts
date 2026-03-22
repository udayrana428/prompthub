// What belongs in utils

// Only pure, reusable, stateless helpers that:

// don’t depend on React

// don’t depend on app state

// don’t have side effects

// Examples that DO belong:

// utils/cn.ts              // className merge helper
// utils/formatDate.ts      // date formatting
// utils/debounce.ts
// utils/slugify.ts
// utils/capitalize.ts
// utils/isEmail.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import moment from "moment";
// import { UPPER_CASE_BREAD_CRUMB } from "../shared/constant";

export const formDataGenerator = (data) => {
  let formDataValue = new FormData();
  if (typeof data === "object" && data !== null) {
    let keys = Object.keys(data);
    keys.map((key) => {
      // Using forEach instead of map
      formDataValue.append(key, data[key]);
    });
    return formDataValue;
  }
  return {};
};

export const digitToRupeeNotation = (value) => {
  if (!isNaN(value)) {
    value = typeof value === "string" ? +value : value;
    value = value.toString();
    let lastThree = value.substring(value.length - 3);
    let otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers != "") lastThree = "," + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  } else {
    return NaN;
  }
};

export const digitToRupeeNotationwithsymbol = (value) => {
  if (!isNaN(value)) {
    value = typeof value === "string" ? +value : value;
    value = value.toString();
    let lastThree = value.substring(value.length - 3);
    let otherNumbers = value.substring(0, value.length - 3);
    if (otherNumbers != "") lastThree = "," + lastThree;
    let res =
      `₹ ` + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  } else {
    return NaN;
  }
};

export const addClass = (element, ...classNames) => {
  classNames.forEach((className) => {
    element
      ? !element.classList.contains(className) &&
        element.classList.add(className)
      : console.log("Element not Found! Cannot add " + className + " class");
  });
};

export const removeClass = (element, ...classNames) => {
  classNames.forEach((className) => {
    element && element.classList != undefined
      ? element.classList.contains(className) &&
        element.classList.remove(className)
      : console.log("Element not Found! Cannot remove " + className + " class");
  });
};

export const autoCapital = (value) => {
  if (value != undefined) {
    if (typeof value === "string") {
      // if(value.toLowerCase() === 'mba')
      //     return value.toUpperCase();
      let newValues = [];
      value.split(" ").forEach((e, i) => {
        let lowerCase = e.toLowerCase();
        let upperCase = e.toUpperCase();
        if (UPPER_CASE_BREAD_CRUMB.includes(upperCase)) {
          newValues[i] = upperCase;
        } else {
          newValues[i] =
            lowerCase.charAt(0).toUpperCase() + lowerCase.substr(1);
        }
      });
      return newValues.join(" ");
    } else {
      return value;
    }
  }
};

export const hideElementAfterDelay = (element, delay = 100) => {
  if (element) {
    setTimeout(() => {
      element.style.display = "none";
    }, delay);
  } else {
    console.log("cannot hide element after delay");
  }
};

export const getCurrentYear = () => moment().format("YYYY");

export const convertAmountToWords = (num) => {
  var a = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen ",
  ];

  var b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if ((num = num.toString()).length > 9) return "overflow";
  var n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        "Rupees Only "
      : "Rupees Only ";
  return autoCapital(str);
};

export const getPostLineGraphDate = (date) => {
  const [day, month, year] = date.split("/");
  const dateObj = new Date(`${year}-${month}-${day}`);
  const monthShort = dateObj.toLocaleString("en-US", { month: "short" });
  return `${year} - ${monthShort} ${day}`;
};

export const checkIframeContent = () => {
  let isIframeContent = true;
  if (__CLIENT__) {
    const referrer = document.referrer;
    if (referrer == "https://dev-distributor.hdfcfund.com/") {
      isIframeContent = false;
    }
  }
  return isIframeContent;
};

export const generateBreadcrumbs = (url) => {
  const baseUrl = "https://www.hdfcfund.com";
  const pathSegments = url.replace(baseUrl, "").split("/").filter(Boolean);

  return pathSegments.map((segment, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: segment.replace(/-/g, " "), // Replaces hyphens with spaces for readability
    item: `${baseUrl}/${pathSegments.slice(0, index + 1).join("/")}`,
  }));
};

export const getYoutubePosterImage = (youtubeId) => {
  let youtubeBaseURL = "https://img.youtube.com/vi/",
    youtubePoster = "/mqdefault.jpg";

  return youtubeBaseURL + youtubeId + youtubePoster;
};

export const getDropdownData = (obj, additional) => {
  if (obj) {
    let values = Object.keys(obj),
      returnValue;
    returnValue = values.map((item, index) => {
      return { name: obj[item], value: item };
    });
    additional && returnValue.unshift(additional);
    return returnValue;
  }
};

function get_host(url) {
  var match = url.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );
  if (match) {
    return `${match[1]}//${match[2]}`;
  }
  // return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
}

export const isSameOrigin = (url) => {
  if (
    url != null &&
    typeof location != "undefined" &&
    typeof location.origin != "undefined" &&
    ("https://www.hdfcfund.com" == get_host(url) ||
      "https://beta.hdfcfund.com" == get_host(url) ||
      "https://uat.hdfcfund.com" == get_host(url) ||
      "https://qa.hdfcfund.com" == get_host(url) ||
      "https://dev.hdfcfund.com" == get_host(url) ||
      "https://web.hdfcfund.com" == get_host(url))
  ) {
    return true;
  }
  return false;
};

export const getLocationOrigin = (url) => {
  if (isSameOrigin(url)) {
    if (/https:\/\/dev.hdfcfund.com/.test(url)) {
      return url.replace("https://dev.hdfcfund.com", "");
    } else if (/https:\/\/qa.hdfcfund.com/.test(url)) {
      return url.replace("https://qa.hdfcfund.com", "");
    } else if (/https:\/\/uat.hdfcfund.com/.test(url)) {
      return url.replace("https://uat.hdfcfund.com", "");
    } else if (/https:\/\/beta.hdfcfund.com/.test(url)) {
      return url.replace("https://beta.hdfcfund.com", "");
    } else if (/https:\/\/web.hdfcfund.com/.test(url)) {
      return url.replace("https://web.hdfcfund.com", "");
    } else if (/https:\/\/www.hdfcfund.com/.test(url)) {
      return url.replace("https://www.hdfcfund.com", "");
    }
    /*Need to Prod Configuration*/
  }
  return url;
};

export const convertHTMLEntities = (str) => {
  var output =
    str &&
    str
      .replace("&nbsp;", " ")
      .replace("&#160;", " ")
      .replace("&lt;", "<")
      .replace("&#60;", "<")
      .replace("&gt;", ">")
      .replace("&#62;", ">")
      .replace("&amp;", "&")
      .replace("&#38;", "&")
      .replace("&quot;", '"')
      .replace("&#34;", '"')
      .replace("&apos;", "'")
      .replace("&#39;", "'")
      .replace("&cent;", "¢")
      .replace("&#162;", "¢")
      .replace("&pound;", "£")
      .replace("&#163;", "£")
      .replace("&yen;", "¥")
      .replace("&#165;", "¥")
      .replace("&euro;", "€")
      .replace("&#8364;", "€")
      .replace("&copy;", "©")
      .replace("&#169;", "©")
      .replace("&reg;", "®")
      .replace("&#174;", "®")
      .replace(/(\r\n\t|\n|\r|\t)/gm, " ")
      .replace(/(&nbsp;)/g, " ");
  return output;
};

export const formatModelLabel = (model: string) =>
  model
    .split("_")
    .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
    .join(" ");
