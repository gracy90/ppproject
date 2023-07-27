import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_7thdv8c";
const TEMPLATE = "template_ngenf03";
const PUBLIC_KEY = "y2sOkUg6f7_PVe5ni";

export const sendEmail = async (data, fun, errFun) => {
  await emailjs.send(SERVICE_ID, TEMPLATE, data, PUBLIC_KEY).then(
    (result) => {
      console.log(result.text);
      fun();
    },
    (error) => {
      console.log(error.text);
      errFun();
    }
  );
};
